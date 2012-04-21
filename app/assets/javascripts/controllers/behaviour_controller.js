/*
  BehaviourController
  
  - manages the behaviours of the game
*/

var BehaviourController = Ember.ArrayController.extend({

  contentBinding : "App.game.behaviours",
  
  currentBehaviour : null,
  
  createBehaviour : function() {
    
    var behaviour = BehaviourModel.create();
    
    this.set( 'currentBehaviour', behaviour );
    this.addObject( behaviour );
    
  }

});
