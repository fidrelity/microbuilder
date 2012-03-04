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
    
    App.placementController.set( 'graphic', graphic );
    
    App.routeManager.goToLocation( 'placement' );
    
  },
  
  placeGraphic : function( graphic, position ) {
    
    this.game.addGameObject( graphic, position );
    
    App.routeManager.goToLocation( '' );
    
  }
  
});
