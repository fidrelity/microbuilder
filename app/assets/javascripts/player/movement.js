var Movement = function() {
  
  this.position = new Vector();
  this.startPosition = new Vector();
  
  this.area = new Area();
  
  this.target;
  this.direction;
  
  this.roamArea;
  this.roamMode;
  
  this.speed;
  
};

Movement.prototype = {
  
  speeds : [0.01, 0.03, 0.08, 0.2, 0.5],
  
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
  
  setTarget : function( pos, speed ) {
    
    this.stop();
    
    this.target = pos;
    this.speed = speed;
    
  },
  
  setDirection : function( dir, speed ) {
    
    this.stop();
    
    this.direction = dir;
    this.speed = speed;
    
  },
  
  getArea : function() {
    
    var pos = this.position;
    
    return this.area.setPosition( pos.x, pos.y );
    
  },
  
  roam : function( object, mode, area, speed ) {
    
    var objArea = this.getArea(),
      increase;
    
    this.stop();
    
    this.roamMode = mode;
    this.roamArea = area;
    
    this.speed = speed;
    
    if ( area.width < objArea.width ) {
      
      increase = objArea.width * 0.1;
      
      area.width = objArea.width + increase * 2;
      area.x -= increase;
      
    }
    
    if ( area.height < objArea.height ) {
      
      increase = objArea.height * 0.1;
      
      area.height = objArea.height + increase * 2;
      area.y -= increase;
      
    }
    
    if ( area.leavesArea( objArea ) ) {
      
      this.insertObject( area );
      
    }
    
    if ( mode === 'wiggle' || mode === 'insect' ) {
      
      this.direction = Math.random() * Math.PI * 2;
      
    } else if ( mode === 'reflect' ) {
      
      this.direction = Math.PI * ( 0.25 + 0.5 * ( Math.floor( Math.random() * 100 ) % 4 ) );
      
    } else if ( mode === 'bounce' ) {
      
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
    
    var speed = this.speeds[ this.speed ];
    
    if ( this.target ) {
      
      this.updateTarget( dt * speed );
      
    } else if ( this.direction !== null ) {
      
      this.updateDirection( dt * speed );
    
    }
    
  },
  
  updateTarget : function( distance ) {
    
    var vector = this.vector,
      target = this.target,
      pos = this.position;
    
    vector.copy( target ).subSelf( pos );
    
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
      
      } else if ( mode === 'bounce' ) {
      
      }
      
      
      breakout = roamArea.leavesArea( this.getArea() );
      
      if ( breakout ) {
        
        this.position.subSelf( vector );
        
        this.reflectDirection( breakout );
        
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
    
    this.position.set(
      area.x + Math.random() * ( area.width - this.area.width ),
      area.y + Math.random() * ( area.height - this.area.height )
    );
    
  },
  
  draw : function( ctx ) {
    
    var center;
    
    if ( this.target ) {
      
      ctx.line( this.position.x, this.position.y, this.target.x, this.target.y );
      
    } else if ( this.roamMode ) {
      
      this.roamArea.draw( ctx );
      
    } else if ( this.direction ) {
      
      center = this.getArea().center();
      
      ctx.save();
      
      ctx.translate( center.x, center.y );
      ctx.rotate( this.direction );
      
      ctx.line( 0, 0, 1000, 0 );
      
      ctx.restore();
      
    }
    
  },
  
  vector : new Vector,
  
};