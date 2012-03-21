/*
  BehaviourController
  
  - manages the behaviours of the game
*/

var BehaviourController = Ember.ArrayController.extend({

  contentBinding : "App.gameController.game.behaviours",
  
  currentBehaviour : null,
  
  saveCurrentBehaviour : function() {
    
    this.addObject( this.get( 'currentBehaviour' ) );
    
    this.set( 'currentBehaviour', null );
    
  },
  
  createBehaviour : function() {
    
    var behaviour = BehaviourModel.create();
    
    this.set( 'currentBehaviour', behaviour );
    this.addObject( behaviour );
    
  }

});
