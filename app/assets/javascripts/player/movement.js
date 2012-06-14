var Movement = function() {
  
  this.position = new Vector();
  this.startPosition = new Vector();
  
  this.area = new Area();
  
  this.target;
  this.direction;
  
  this.roamArea;
  this.roamMode;
  this.roamStart = new Vector();
  
  this.time;
  this.speed;
  
};

Movement.prototype = {
  
  speeds : [0.125, 0.375, 1, 2.5, 6.25],
  
  reset : function() {
    
    this.position.copy( this.startPosition );
    
    this.stop();
    
  },
  
  setPosition : function( pos ) {
    
    this.stop();
    
    this.position.copy( pos );
    
  },
  
  movePosition : function( vec ) {
    
    this.stop();
    
    this.position.copy( this.startPosition.addSelf( vec ) );
    
  },
  
  setTarget : function( pos, offset, speed ) {
    
    this.stop();
    
    this.target = pos;
    this.offset = offset;
    
    this.speed = speed;
    
  },
  
  setDirection : function( dir, speed ) {
    
    this.stop();
    
    this.direction = dir;
    this.speed = speed;
    
  },
  
  getArea : function() {
    
    var pos = this.position;
    
    return this.area.setCenter( pos.x, pos.y );
    
  },
  
  roam : function( object, mode, area, speed ) {
    
    var objArea = this.getArea(),
      increase;
    
    this.stop();
    
    this.roamMode = mode;
    this.roamArea = area;
    
    this.speed = speed;
    
    if ( area.width < objArea.width ) {
      
      increase = objArea.width * 1.2 - area.width;
      
      area.width += increase;
      area.x -= increase * 0.5;
      
    }
    
    if ( area.height < objArea.height ) {
      
      increase = objArea.height * 1.2 - area.height;
      
      area.height += increase;
      area.y -= increase * 0.5;
      
    }
    
    if ( area.leavesArea( objArea ) ) {
      
      this.insertObject( area );
      
    }
    
    if ( mode === 'wiggle' || mode === 'insect' ) {
      
      this.direction = Math.random() * Math.PI * 2;
      
    } else if ( mode === 'reflect' ) {
      
      this.direction = Math.PI * ( 0.25 + 0.5 * ( Math.floor( Math.random() * 100 ) % 4 ) );
      
    } else if ( mode === 'bounce' ) {
      
      var height = ( area.height - objArea.height );
      
      this.direction = new Vector( this.speeds[this.speed], Math.sqrt( 2 * height * 9.81 ) );
      this.time = 0;
      
      this.insertObjectAtBottom( area );
      
      this.roamStart.copy( this.position );
      
    }
    
  },
  
  jump : function( area ) {
    
    this.stop();
    
    this.insertObject( area );
    
  },
  
  stop : function() {
    
    this.target = null;
    this.direction = null;
    this.roamMode = null;
    
  },
  
  update : function( dt ) {
    
    var distance = this.speeds[ this.speed ] * 0.08 * dt;
    
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
      pos = this.position;
    
    vector.copy( target ).addSelf( this.offset ).subSelf( pos );
    
    if ( vector.norm() < distance ) {
    
      pos.copy( target );
      
      this.target = null;
    
    } else {
    
      vector.normalizeSelf().mulSelf( distance );
    
      pos.addSelf( vector );
    
    }
    
  },
  
  updateDirection : function( distance ) {
    
    var vector = this.vector,
      mode = this.roamMode,
      roamArea = this.roamArea,
      breakout;
    
    vector.set( distance, 0 ).rotateSelf( this.direction );
    
    this.position.addSelf( vector );
    
    if ( mode ) {
    
      if ( mode === 'wiggle' ) {
      
        this.direction += ( Math.random() * 0.2 - 0.1 ) * Math.PI;
      
      } else if ( mode === 'insect' ) {
      
        this.direction = Math.random() * Math.PI * 2;
      
      }
      
      breakout = roamArea.leavesArea( this.getArea() );
      
      if ( breakout ) {
        
        this.position.subSelf( vector );
        
        this.reflectDirection( breakout );
        
      }
    
    }
    
  },
  
  updateBounce : function( time ) {
    
    var breakout;
    
    time *= 10 * this.speeds[this.speed];
    
    this.position.x += this.direction.x;
    this.position.y = this.roamStart.y - this.direction.y * time + 9.81 / 2 * time * time;
    
    breakout = this.roamArea.leavesArea( this.getArea() );
    
    if ( breakout ) {
      
      if ( breakout === 'x' || breakout === 'width' ) {
      
        this.direction.x *= -1;
        this.position.x += this.direction.x;
      
      } else {
      
        this.time = 0;
        this.position.y = this.roamStart.y;
      
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
    
    var objArea = this.getArea();
    
    objArea.setPosition(
      area.x + Math.random() * ( area.width - objArea.width ),
      area.y + Math.random() * ( area.height - objArea.height )
    );
    
    this.position.copy( objArea.center() );
    
  },
  
  insertObjectAtBottom : function( area ) {
    
    var objArea = this.getArea();
    
    objArea.setPosition(
      area.x + Math.random() * ( area.width - objArea.width ),
      area.y + ( area.height - objArea.height )
    );
    
    this.position.copy( objArea.center() );
    
  },
  
  draw : function( ctx ) {
    
    if ( this.target ) {
      
      ctx.line( this.position.x, this.position.y, this.target.x + this.offset.x, this.target.y + this.offset.y );
      
    } else if ( this.roamMode ) {
      
      this.roamArea.draw( ctx );
      
    } else if ( this.direction ) {
      
      ctx.save();
      
      ctx.translate( this.position.x, this.position.y );
      ctx.rotate( this.direction );
      
      ctx.line( 0, 0, 1000, 0 );
      
      ctx.restore();
      
    }
    
  },
  
  vector : new Vector,
  
};