var Animation = function() {
  
  this.frame = 1;
  this.time = 0;
  
  this.up = true;
  this.plays = false;
  
  this.speed;
  
};

Animation.prototype = {
  
  speeds : [400, 250, 150, 90, 40],
  
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
        
        }
      
      }
      
    }
    
  }
  
};