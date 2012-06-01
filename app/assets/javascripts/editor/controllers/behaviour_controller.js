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
    
  }

});
