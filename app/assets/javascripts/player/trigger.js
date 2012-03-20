var ClickTrigger = function() {
  
  this.gameObject = null;
  
};

ClickTrigger.prototype = {
  
  check : function( game ) {
    
    if ( game.mouse ) {
      
      game.mouse.log();
      
      return this.gameObject.getArea().contains( game.mouse );
      
    } else {
    
      return false;
    
    }
    
  }
  
};


var ContactTrigger = function() {
  
  this.gameObject1 = null;
  this.gameObject2 = null;
  
  triggered = false;
  
};

ContactTrigger.prototype = {
  
  check : null,
  
  checkContact : function( game ) {
    
    var overlaps = this.checkOverlap();
    
    if ( this.triggered && !overlaps ) {
      
      this.triggered = false;
      
    } else if ( !this.triggered && overlaps ) {
      
      this.triggered = true;
      
      return true;
      
    }
    
    return false;
    
  },
  
  checkOverlap : function( game ) {
    
    return this.gameObject1.getArea().overlaps( this.gameObject2.getArea() );
    
  }
  
};