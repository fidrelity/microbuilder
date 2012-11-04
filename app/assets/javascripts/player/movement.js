var Movement = function( shape ) {
  
  this.shape = shape;
  
  this.target;
  this.direction;
  this.offset = new Vector();
  
  this.roamArea;
  this.roamMode;
  this.bounceStart;
  
  this.time;
  this.speed;

  this.path = [];
  this.pathCounter = 0;
  this.pathMode = null; // loop, ping-pong, once
  this.pathDirection = null;

};

Movement.prototype = {
  
  speeds : [0.125, 0.375, 1, 2.5, 6.25],
  
  reset : function() {
    
    this.stop();
    
  },
  
  getPosition : function() {
    
    return this.shape.getPosition();
    
  },
  
  setPosition : function( pos ) {
    
    this.stop();
    
    this.shape.setPosition( pos );
    
  },
  
  getArea : function() {
    
    return this.shape.getBounds();
    
  },
  
  setTarget : function( pos, offset, speed ) {
    
    this.stop();
    
    this.target = pos;
    this.offset.copy( offset );
    
    this.setSpeed( speed );
    
  },
  
  setDirection : function( dir, speed ) {
    
    this.stop();
    
    this.direction = dir;
    this.setSpeed( speed );
    
  },
  
  setSpeed : function( speed ) {
    
    this.speed = this.speeds[speed];
    
  },
  
  roam : function( mode, area, speed ) {
    
    var objArea = this.getArea(),
      bounds = this.shape.getStartBounds(),
      width, height, increase, v, h, y, g = 9.81;
    
    if ( mode === this.roamMode && area === this.roamArea &&
      this.speed === this.speeds[speed] ) {
      
      return;
      
    }
    
    this.stop();
    
    this.roamMode = mode;
    this.roamArea = area;
    
    this.setSpeed( speed );
    
    width = objArea.width || ( 2 * objArea.radius );
    height = objArea.height || ( 2 * objArea.radius );
    
    if ( area.width < width ) {
      
      increase = width - area.width + 10;
      
      area.width += increase;
      area.x -= increase * 0.5;
      
    }
    
    if ( area.height < height ) {
      
      increase = height - area.height + 10;
      
      area.height += increase;
      area.y -= increase * 0.5;
      
    }
    
    if ( objArea.leavesArea( area ) ) {
      
      this.insertObject( area );
      
    }
    
    if ( mode === 'wiggle' || mode === 'insect' ) {
      
      this.direction = Math.random() * Math.PI * 2;
      
    } else if ( mode === 'reflect' ) {
      
      this.direction = Math.PI * ( 0.25 + 0.5 * ( Math.floor( Math.random() * 100 ) % 4 ) );
      
    } else if ( mode === 'bounce' ) {
      
      objArea = this.getArea();
      
      h = ( area.height - height );
      y = h - objArea.y;
      v = Math.sqrt( 2 * h * g );
      
      if ( bounds ) {
        
        y += bounds.radius || 0;
        this.bounceStart = area.y + area.height - ( bounds.radius || bounds.height ) - bounds.y;
        
      } else {
        
        this.bounceStart = area.y + area.height - height * 0.5;
        
      }
      
      this.direction = new Vector( this.speed * randSign(), v );
      this.time = ( v - Math.sqrt( v * v - 2 * y * g ) ) / g * 100;
      
    }
    
  },
  
  jump : function( area ) {
    
    if ( area === this.roamArea ) {
      
      return;
      
    }
    
    this.stop();
    
    this.roamArea = area;
    
    this.insertObject( area );
    
  },

  followPath : function ( path, mode, speed ) {

    if ( path === this.path && mode === this.pathMode && this.speed === this.speeds[speed] ) {
      
      return;
      
    }

    this.stop();

    if ( path.length > 1 ) {
      
      path[0] = this.getPosition().clone();
      this.target = path[1];
      
      this.path = path;
      this.pathMode = mode;
      
      this.setSpeed( speed );
      this.pathCounter = 1;
      
    }
    
  },
  
  stop : function() {

    this.target = null;
    this.direction = null;
    this.roamMode = null;
    this.roamArea = null;

    this.pathCounter = 0;
    this.pathMode = null;
    this.pathDirection = null;

    this.offset.set( 0, 0 );
   
  },
  
  update : function( dt ) {
    
    var distance = this.speed * 0.08 * dt;

    if ( this.target ) {

      this.updateTarget( distance );
      
    } else if ( this.roamMode === 'bounce' ) {
      
      this.time += dt;
      
      this.updateBounce( this.time * 0.001 );
      
    } else if ( this.direction !== null ) {
      
      this.updateDirection( distance );
      
    }
    
  },
  
  updateTarget : function( distance ) {
    
    var vector = this.vector,
      target = this.target,
      pos = this.getPosition();
    
    vector.copy( target ).addSelf( this.offset ).subSelf( pos );
    
    if ( vector.norm() < distance ) {
    
      pos.copy( target ).addSelf( this.offset );

      if ( this.pathMode ) {

        this.updatePath();

      } else {
      
        this.target = null;

      }
        
    } else {
    
      vector.normalizeSelf().mulSelf( distance );
    
      pos.addSelf( vector );
    
    }
    
  },


  updatePath : function() {

    var lastPoint = this.path.length - 1,
      mode = this.pathMode,
      counter = this.pathCounter;
    
    if ( mode === 'circular' ) {
      
      if ( counter === lastPoint ) {

        counter = 0;

      } else {

        counter++;

      }
      
    } else if ( mode === 'ping-pong' ) {
      
      if ( counter === lastPoint ) {
        
        this.pathDirection = "backward";
      
      } else if ( counter === 0 ) {
      
        this.pathDirection = "forward";
      
      }
      
      counter += ( this.pathDirection === "backward" ? -1 : 1 );

    } else if ( mode === 'once' ) {

      if ( counter === lastPoint ) {

        this.stop();
        return;

      }

      counter++;

    }
    
    this.target = this.path[counter];
    this.pathCounter = counter;

  },
  
  updateDirection : function( distance ) {
    
    var vector = this.vector,
      mode = this.roamMode,
      pos = this.getPosition(),
      breakout;
    
    vector.set( distance, 0 ).rotateSelf( this.direction );
    
    pos.addSelf( vector );
    
    if ( mode ) {
    
      if ( mode === 'wiggle' ) {
      
        this.direction += ( Math.random() * 0.2 - 0.1 ) * Math.PI;
      
      } else if ( mode === 'insect' ) {
      
        this.direction = Math.random() * Math.PI * 2;
      
      }
      
      breakout = this.getArea().leavesArea( this.roamArea );
      
      if ( breakout ) {
        
        pos.subSelf( vector );
        
        this.reflectDirection( breakout );
        
      }
    
    }
    
  },
  
  updateBounce : function( time ) {
    
    var pos = this.getPosition(),
      dir = this.direction,
      breakout;
    
    time *= 10 * this.speed;
    
    pos.x += dir.x;
    pos.y = this.bounceStart - dir.y * time + 4.905 * time * time;
    
    breakout = this.getArea().leavesArea( this.roamArea );
    
    if ( breakout ) {
      
      if ( breakout === 'x' || breakout === 'width' ) {
      
        dir.x *= -1;
        pos.x += dir.x;
      
      } else {
      
        this.time = 0;
        pos.y = this.bounceStart;
      
      }
      
    }
    
  },
  
  reflectDirection : function( breakout ) {
    
    var vector = this.vector.set( 1, 0 ).rotateSelf( this.direction );
          
    if ( breakout === 'x' || breakout === 'width' ) {
      
      vector.x *= -1;
      
    } else {
      
      vector.y *= -1;
      
    }
    
    this.direction = vector.angle();
    
  },
  
  insertObject : function( area ) {
    
    var objArea = this.getArea(),
      bounds = this.shape.getStartBounds(),
      pos = this.getPosition();
    
    pos.set(
      area.x + Math.random() * ( area.width - ( objArea.width || 2 * objArea.radius ) ),
      area.y + Math.random() * ( area.height - ( objArea.height || 2 * objArea.radius ) )
    );
    
    if ( bounds ) {
      
      pos.subSelf( bounds );
      
      if ( bounds.radius) {
        
        pos.x += bounds.radius;
        pos.y += bounds.radius;
        
      }
      
    } else {
      
      pos.x += objArea.width * 0.5;
      pos.y += objArea.height * 0.5;
      
    }
    
  },
  
  draw : function( ctx ) {
    
    var pos = this.getPosition();
    
    this.getArea().draw( ctx );
    
    if ( this.target ) {
      
      if ( this.pathMode ) {
        
        new Path( this.path ).draw( ctx, 0.5 );
        
      }
      
      ctx.save();
      ctx.fillStyle = ctx.strokeStyle = 'red';
      ctx.drawArrow( pos.x, pos.y, this.target.x + this.offset.x, this.target.y + this.offset.y, 0.7 );
      ctx.restore();
      
    } else if ( this.roamMode ) {
      
      this.roamArea.draw( ctx );
      
    } else if ( this.direction ) {
      
      ctx.save();
      
      ctx.translate( pos.x, pos.y );
      ctx.rotate( this.direction );
      
      ctx.drawArrow( 0, 0, 70, 0, 0.5 );
      
      ctx.restore();
      
    }
    
  },
  
  vector : new Vector
  
};