/*
  BehaviourController
  
  - manages the behaviours of the game
*/

var BehaviourController = Ember.ArrayController.extend({

  contentBinding : 'App.gameObjectsController.current.behaviours',
  startBehaviourBinding : 'App.gameObjectsController.current.startBehaviour',
  
  current : null,
  
  createBehaviour : function() {
    
    var behaviour = BehaviourModel.create();
    
    this.set( 'current', behaviour );
    this.addObject( behaviour );
    
  },
  
  duplicateBehaviour : function( behaviour ) {
    
    this.addObject( behaviour.clone() );
    
  },
  
  parseBehaviour : function( gameObject, data ) {
    
    var behaviour = BehaviourModel.create(), i, trigger;
    
    for ( i = 0; i < data.actions.length; i++ ) {
      
      behaviour.addAction( this.parseActionTrigger( data.actions[i] ) );
      
    }
    
    for ( i = 0; i < data.triggers.length; i++ ) {
      
      trigger = this.parseActionTrigger( data.triggers[i] );
      
      behaviour.addTrigger( trigger );
      
      if ( trigger.type === 'start' ) {
        
        gameObject.set( 'startBehaviour', behaviour );
        return;
        
      }
      
    }
    
    gameObject.behaviours.addObject( behaviour );
    
  },
  
  parseActionTrigger : function( data ) {
    
    return ActionTriggerModel.create().parse( data );
    
  }

});
