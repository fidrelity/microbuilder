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
      
      this.actions.forEachApply( 'execute', game );
      
    }
    
  },
  
  reset : function() {
    
    this.triggers.forEachApply( 'reset' );
    
  },
  
  draw : function( ctx ) {
    
    this.triggers.forEachApply( 'draw', ctx );
    
  }
  
};