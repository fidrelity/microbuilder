var BehaviourModel = Ember.Object.extend({
  
  triggers : null,
  actions : null,
  
  init : function() {
    
    this.triggers = [];
    this.actions = [];
    
  },
  
  addAction : function( action ) {
    
    action.parent = this;
    
    this.actions.push( action );
    
  },
  
  addTrigger : function( trigger ) {
    
    trigger.parent = this;
    
    this.triggers.push( trigger );
    
  },
  
  getData : function( graphics ) {
    
    var data, i;
    
    if ( this.triggers.length && this.actions.length ) {
    
      data = { triggers: [], actions: [] };
    
      for ( i = 0; i < this.triggers.length; i++ ) {
      
        data.triggers.push( this.triggers[i].getData() );
      
      }
    
      for ( i = 0; i < this.actions.length; i++ ) {
      
        data.actions.push( this.actions[i].getData( graphics ) );
      
      }
    
    }
    
    return data;
    
  }
  
});
