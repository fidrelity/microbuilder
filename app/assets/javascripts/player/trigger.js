var Trigger = function() {
  
  
  
};

Trigger.prototype = {
  
  
  
};

var ClickTrigger = function() {
  
  this.gameObject = null;
  
};

ClickTrigger.prototype = {
  
  check : function( game ) {
    
    if ( game.mouse ) {
      
      game.mouse.log();
      
      return this.gameObject.checkClick( game.mouse );
      
    } else {
    
      return false;
    
    }
    
  }
  
};