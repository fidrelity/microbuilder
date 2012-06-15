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
      
      behaviour.addAction( this.parseAction( data.actions[i] ) );
      
    }
    
    for ( i = 0; i < data.triggers.length; i++ ) {
      
      trigger = this.parseTrigger( data.triggers[i] );
      
      behaviour.addTrigger( trigger );
      
      if ( trigger.type === 'start' ) {
        
        gameObject.set( 'startBehaviour', behaviour );
        return;
        
      }
      
    }
    
    gameObject.behaviours.addObject( behaviour );
    
  },
  
  parseAction : function( data ) {
    
    return ActionTriggerModel.create().parse( data );
    
  },
  
  parseTrigger : function( data ) {
    
    switch ( data.type ) {
      
      case 'start' : return StartTriggerModel.create();
      
      case 'click' : return ClickTriggerModel.create().parse( data );
      
      case 'touch' : return ContactTriggerModel.create().parse( data );
      case 'overlap' : return ContactTriggerModel.create().parse( data );
      
      case 'time' : return TimeTriggerModel.create().parse( data );
      
      default : console.error( 'trigger type ' + data.type + ' not found' ); return null;
      
    }
    
  }

});
