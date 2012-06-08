var BehaviourModel = Ember.Object.extend({
  
  triggers : null,
  actions : null,
  
  init : function() {
    
    this.set( 'triggers', [] );
    this.set( 'actions', [] );
    
  },
  
  clone : function() {
    
    var behaviour = BehaviourModel.create();
    
    for ( var i = 0; i < this.actions.length; i++ ) {
      
      behaviour.addAction( this.actions[i].clone() );
      
    }
    
    for ( var i = 0; i < this.triggers.length; i++ ) {
      
      behaviour.addTrigger( this.triggers[i].clone() );
      
    }
    
    return behaviour;
    
  },
  
  addAction : function( action ) {
    
    action.parent = this;
    
    this.actions.push( action );
    
  },
  
  addTrigger : function( trigger ) {
    
    trigger.parent = this;
    
    this.triggers.push( trigger );
    
  },
  
  getData : function( graphicIDs ) {
    
    var data, i;
    
    if ( this.triggers.length && this.actions.length ) {
    
      data = { triggers: [], actions: [] };
    
      for ( i = 0; i < this.triggers.length; i++ ) {
      
        data.triggers.push( this.triggers[i].getData() );
      
      }
    
      for ( i = 0; i < this.actions.length; i++ ) {
      
        data.actions.push( this.actions[i].getData( graphicIDs ) );
      
      }
    
    }
    
    return data;
    
  },
  
  removeGameObject : function( gameObject ) {
    
    var actions = this.actions.filterProperty( 'gameObject', gameObject ),
        triggers = this.triggers.filterProperty( 'gameObject', gameObject ),
        i;
    
    for ( i = 0; i < actions.length; i++ ) {
      
      this.actions.removeObject( actions[i] );
      
    }
    
    for ( i = 0; i < triggers.length; i++ ) {
      
      this.triggers.removeObject( triggers[i] );
      
    }
    
  }
  
});
