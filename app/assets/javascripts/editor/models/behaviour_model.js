var BehaviourModel = Ember.Object.extend({
  
  ID : null,
  
  triggers : null,
  actions : null,
  
  open : true,
  
  init : function() {
    
    this.ID = App.game.behaviourCounter++;
    
    this.set( 'triggers', [] );
    this.set( 'actions', [] );
    
    this.set( 'open', true );
    
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
  
  addAction : function( action, oldAction, actions ) {
    
    var i;
    
    actions = actions || this.actions;
    
    if ( oldAction ) {
      
      i = actions.indexOf( oldAction );
      
      actions.removeAt( i );
      actions.insertAt( i, action );
      
    } else {
      
      actions.addObject( action );
      
    }
    
    action.set( 'parent', this );
    
  },
  
  addTrigger : function( trigger, oldTrigger ) {
    
    this.addAction( trigger, oldTrigger, this.triggers );
    
  },
  
  getData : function( graphics ) {
    
    var data, i, trigger, action;
    
    if ( this.triggers.length && this.actions.length ) {
    
      data = { triggers: [], actions: [] };
    
      for ( i = 0; i < this.triggers.length; i++ ) {
      
        trigger = this.triggers[i].getData();
      
        if ( trigger ) {
      
          data.triggers.push( trigger );
      
        }
      
      }
    
      for ( i = 0; i < this.actions.length; i++ ) {
      
        action = this.actions[i].getData( graphics );
      
        if ( action ) {
      
          data.actions.push( action );
      
        }
      
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
    
  },
  
  insertAction : function( pos, action ) {
    
    action.set( 'parent', this );
    
    this.actions.insertAt( pos, action );
    
  },
  
  removeAction : function( pos ) {
    
    var action = this.actions[pos];
    
    this.actions.removeAt( pos );
    
    return action;
    
  },
  
  insertTrigger : function( pos, trigger ) {
    
    trigger.set( 'parent', this );
    
    this.triggers.insertAt( pos, trigger );
    
  },
  
  removeTrigger : function( pos ) {
    
    var trigger = this.triggers[pos];
    
    this.triggers.removeAt( pos );
    
    return trigger;
    
  }
  
});
