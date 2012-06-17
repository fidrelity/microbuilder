var ClickTrigger = function() {
  
  this.gameObject = null;
  this.area = null;
  
};

ClickTrigger.prototype = {
  
  check : function( game ) {
    
    if ( game.mouse.clicked ) {
      
      if ( this.gameObject ) {
      
        return this.gameObject.getArea().contains( game.mouse.pos );
      
      } else {
        
        return this.area.contains( game.mouse.pos );
        
      }
      
    }
    
    return false;
    
  },
  
  draw : function( ctx ) {
    
    if ( this.area ) {
      
      ctx.strokeStyle = '#F84';
      this.area.draw( ctx );
      
    }
    
  },
  
  reset : function() {}
  
};


var ContactTrigger = function() {
  
  this.gameObject = null;
  this.gameObject2 = null;
  
  this.area = null;
  
  triggered = false;
  
};

ContactTrigger.prototype = {
  
  check : null,
  
  checkTouch : function() {
    
    var overlaps = this.checkOverlap();
    
    if ( this.triggered && !overlaps ) {
      
      this.triggered = false;
      
    } else if ( !this.triggered && overlaps ) {
      
      return this.triggered = true;
      
    }
    
    return false;
    
  },
  
  checkOverlap : function() {
    
    if ( this.area ) {
      
      return this.gameObject.getArea().overlaps( this.area );
      
    } else {
      
      return this.gameObject.getArea().overlaps( this.gameObject2.getArea() );
      
    }
    
  },
  
  reset : function() {
    
    this.triggered = false;
    
  },
  
  draw : function( ctx ) {
    
    if ( this.area ) {
      
      ctx.strokeStyle = '#F77';
      this.area.draw( ctx );
      
    }
    
  }
  
};

var TimeTrigger = function( time, time2 ) {
  
  this.time = time;
  this.time2 = time2;
  
  this.reset();
  
};

TimeTrigger.prototype = {
  
  check : function( game ) {
    
    var playtime = game.player.timePlayed / game.duration * 100,
      time = ( this.time2 ? this.randTime : this.time );
    
    if ( !this.triggered && playtime >= time ) {
      
      return this.triggered = true;
      
    }
    
    return false;
    
  },
  
  reset : function() {
    
    this.triggered = false;
    
    if ( this.time2 ) {
      
      this.randTime = this.time + Math.random() * ( this.time2 - this.time );
      
    }
    
  },
  
  draw : function( ctx ) {
    
    var time = this.randTime || this.time, i = Stage.prototype.increment;
    
    ctx.fillStyle = this.triggered ? '#AAA' : '#333';
    
    if ( this.randTime ) {
      
      // ctx.fillRect( ( 640 + i.x ) * this.time * 0.01 - i.x / 2 - 1, 390 + i.y / 2 - 4, 2, 16 );
      // ctx.fillRect( ( 640 + i.x ) * this.time2 * 0.01 - i.x / 2 - 1, 390 + i.y / 2 - 4, 2, 16 );
      
      ctx.fillRect( 640 * this.time * 0.01 - 1, 390 + i.y / 2 - 4, 2, 16 );
      ctx.fillRect( 640 * this.time2 * 0.01 - 1, 390 + i.y / 2 - 4, 2, 16 );
      
    }
    
    // ctx.fillRect( ( 640 + i.x ) * time * 0.01 - i.x / 2 - 2, 390 + i.y / 2 - 4, 4, 16 );
    
    ctx.fillRect( 640 * time * 0.01 - 2, 390 + i.y / 2 - 4, 4, 16 );
    
  }
  
};