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
    
  }
  
};


var ContactTrigger = function() {
  
  this.gameObject1 = null;
  this.gameObject2 = null;
  
  triggered = false;
  
};

ContactTrigger.prototype = {
  
  check : null,
  
  checkContact : function() {
    
    var overlaps = this.checkOverlap();
    
    if ( this.triggered && !overlaps ) {
      
      this.triggered = false;
      
    } else if ( !this.triggered && overlaps ) {
      
      this.triggered = true;
      
      return true;
      
    }
    
    return false;
    
  },
  
  checkOverlap : function() {
    
    return this.gameObject1.getArea().overlaps( this.gameObject2.getArea() );
    
  }
  
};