var BehaviourModel = Ember.Object.extend({
  
  triggers : null,
  actions : null,
  
  init : function() {
    
    this.triggers = [];
    this.actions = [];
    
  },
  
  addAction : function( action ) {
    
    this.actions.push( action );
    
  },
  
  addTrigger : function( trigger ) {
    
    this.triggers.push( trigger );
    
  },
  
  getData : function() {
    
    var data = {};
    
    if ( this.triggers.length ) {
      
      data.triggers = [];
      
      for ( var i = 0; i < this.triggers.length; i++ ) {
        
        data.triggers.push( this.triggers[i].getData() );
        
      }
      
    }
    
    if ( this.actions.length ) {
      
      data.actions = [];
      
      for ( var i = 0; i < this.actions.length; i++ ) {
        
        data.actions.push( this.actions[i].getData() );
        
      }
      
    }
    
    return data;
    
  }
  
});
