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
      
      if ( game.version < 5 ) {
      
        this.actions.forEachApply( 'execute', game );
      
      } else {
      
        return this.actions;
      
      }
      
    }
    
    return [];
    
  },
  
  reset : function() {
    
    this.triggers.forEachApply( 'reset' );
    
  },
  
  draw : function( ctx ) {
    
    this.triggers.forEachApply( 'draw', ctx );
    
  }
  
};