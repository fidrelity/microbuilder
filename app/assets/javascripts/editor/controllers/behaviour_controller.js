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
    
    return ActionModel.create().parse( data );
    
    switch ( data.type ) {
      
      case 'jumpTo' : return MoveActionModel.create().parse( data );
      case 'moveTo' : return MoveActionModel.create().parse( data );
      case 'moveIn' : return MoveActionModel.create().parse( data );
      
      case 'roam' : return MoveActionModel.create().parse( data );
      
      case 'swap' : return MoveActionModel.create().parse( data );
      case 'stop' : return MoveActionModel.create({ type : 'stop' });
      
      case 'art' : return ArtActionModel.create().parse( data );
      
      case 'win' : return WinLoseActionModel.create({ type : 'win' });
      case 'lose' : return WinLoseActionModel.create({ type : 'lose' });
      
      default : console.error( 'action type ' + data.type + ' not found' ); return null;
      
    }
    
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
