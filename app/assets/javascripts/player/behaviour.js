var Behaviour = function() {
  
  this.triggers = [];
  this.actions = [];
  
};

Behaviour.prototype = {
  
  check : function( game ) {
    
    var triggers = true;
    
    for ( var i = 0; i < this.triggers.length; i++ ) {
      
      if ( !this.triggers[i].check( game ) ) {
        
        triggers = false;
        
        break;
        
      }
      
    }
    
    if ( triggers ) {
      
      for ( var i = 0; i < this.actions.length; i++ ) {
      
        this.actions[i].execute( game );
      
      }
      
    }
    
  },
  
  draw : function( ctx ) {
    
    for ( var i = 0; i < this.triggers.length; i++ ) {
      
      this.triggers[i].draw( ctx );
      
    }
    
  }
  
};