var Animation = function() {
  
  this.frame = 1;
  this.time = 0;
  
  this.up = true;
  this.plays = false;
  
  this.speed;
  
  this.scale = new Vector( 1, 1 );
  this.targetScale = new Vector();
  
  this.scales = false;
  this.scaleSpeed;
  
  this.vector = new Vector();
  
};

Animation.prototype = {
  
  speeds : [400, 250, 150, 90, 40],
  
  reset : function() {
    
    this.stop();
    
    this.scale.set( 1, 1 );
    this.scales = false;
    
  },
  
  getFrame : function() {
    
    return this.frame;
    
  },
  
  setFrame : function( frame ) {
    
    this.frame = frame;
    
    this.stop();
    
  },
  
  play : function( start, end, mode, speed ) {
    
    if ( this.plays && start === this.start && end === this.end && 
      mode === this.mode && this.speed === this.speeds[ speed ] ) {
      
      return;
      
    }
    
    this.stop();
    
    this.start = start;
    this.end = end;
    
    this.frame = start;
    
    this.up = start < end;
    this.mode = start !== end ? mode : 'once';
    this.speed = this.speeds[ speed ];
    
    this.plays = true;
    
  },
  
  stop : function() {
    
    this.time = 0;
    this.plays = false;
    
  },
  
  update : function( dt ) {
    
    if ( this.plays ) {
      
      this.updateFrame( dt );
      
    }
    
    if ( this.scales ) {
      
      this.updateScale( dt );
      
    }
    
  },
  
  updateFrame : function( dt ) {
    
    this.time += dt;
    
    if ( this.time >= this.speed ) {
      
      this.time -= this.speed;
      
      if ( this.mode === 'loop' ) {
        
        if ( this.up ) {
          
          this.frame = this.frame + 1 > this.end ? this.start : this.frame + 1;
          
        } else {
          
          this.frame = this.frame - 1 < this.end ? this.start : this.frame - 1;
          
        }
        
      } else if ( this.mode === 'ping-pong' ) {
        
        this.frame += this.up ? 1 : -1;
        
        if ( this.frame === this.end || this.frame === this.start ) {
          
          this.up = !this.up;
          
        }
        
      } else if ( this.frame !== this.end ) {
        
        this.frame += this.up ? 1 : -1;
        
      } else {
        
        this.stop();
        
      }
      
    }
    
  },
  
  getScale : function() {
    
    return this.scale;
    
  },
  
  setScale : function( scale ) {
    
    this.scale.copy( scale );
    
  },
  
  scaleTo : function( target, speed ) {
    
    this.targetScale.copy( target );
    this.scaleSpeed = speed;
    
    this.scales = true;
    
  },
  
  updateScale : function( dt ) {
    
    var vector = this.vector,
      target = this.targetScale,
      scale = this.scale,
      distance = this.scaleSpeed * dt;
    
    vector.copy( target ).subSelf( scale );
    
    if ( vector.norm() < distance ) {
      
      scale.copy( target );
      
      this.scales = false;
      
    } else {
      
      vector.normalizeSelf().mulSelf( distance );
      
      scale.addSelf( vector );
      
    }
    
  },
  
  flip : function( flip ) {
    
    this.scale.x *= flip.x;
    this.scale.y *= flip.y;
    
    this.targetScale.x *= flip.x;
    this.targetScale.y *= flip.y;
    
  }
  
};