/*
  EditorController
  
  - manages the different states
  - owns the game
*/

var EditorController = Ember.Object.extend({

  game : null,

  init : function() {
    
    this.game = GameModel.create();
    
  },
  
  searchGraphic : function() {
    
    App.libraryController.assetController = App.graphicsController;
    
    App.routeManager.goToLocation( 'library' );
    
  },
  
  selectGraphic : function( graphic ) {
    
    this.game.addGameObject( graphic );
    
    App.routeManager.goToLocation( '' );
    
  }
  
});
