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
    
    var behaviour = BehaviourModel.create(), 
      action, trigger, i;
    
    for ( i = 0; i < data.actions.length; i++ ) {
      
      action = ActionTriggerModel.create().parse( data.actions[i] );
      
      behaviour.addAction( action );
      
    }
    
    for ( i = 0; i < data.triggers.length; i++ ) {
      
      trigger = ActionTriggerModel.create().parse( data.triggers[i] );
      
      behaviour.addTrigger( trigger );
      
      if ( data.triggers[i].ID === 'gameStart' ) {
        
        gameObject.set( 'startBehaviour', behaviour );
        return;
        
      }
      
    }
    
    gameObject.behaviours.addObject( behaviour );
    
  }

});
