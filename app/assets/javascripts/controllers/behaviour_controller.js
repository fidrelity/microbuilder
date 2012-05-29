/*
  BehaviourController
  
  - manages the behaviours of the game
*/

var BehaviourController = Ember.ArrayController.extend({

  contentBinding : 'App.gameObjectsController.current.behaviours',
  
  startBehaviourBinding : 'App.gameObjectsController.current.startBehaviour',
  
  currentBehaviour : null,
  
  createBehaviour : function() {
    
    var behaviour = BehaviourModel.create();
    
    this.set( 'currentBehaviour', behaviour );
    this.addObject( behaviour );
    
  }

});
