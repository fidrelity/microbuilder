/*
  GameController
  
  - manages the different states
  - owns the game
*/

var GameController = Ember.Object.extend({

  game : null,

  player : null,

  init : function() {
    
    this.game = GameModel.create();
    
    this.player = new Player();
    
  },
  
  cancel : function() {
    
    App.routeManager.goToLocation( '' );
    
  },
  
  setPlayerCanvas : function( canvas ) {
    
    this.player.setCanvas( canvas );
    this.updatePlayer();
    
  },
  
  updatePlayer : function() {
    
    this.player.parse( this.game );
    
  },
  
  searchGraphic : function() {
    
    App.libraryController.set( 'assetController', App.graphicsController );
    
    App.routeManager.goToLocation( 'library' );
    
  },
  
  drawGraphic : function() {
    
    App.routeManager.goToLocation( 'paint' );
    
  },
  
  selectGraphic : function( graphic ) {
    
    App.placementController.set( 'graphic', graphic );
    
    App.routeManager.goToLocation( 'placement' );
    
  },
  
  placeGraphic : function( graphic, position ) {
    
    this.game.addGameObject( graphic, position );
    
    App.routeManager.goToLocation( '' );
    
  },
  
  searchBackground : function() {
    
    App.libraryController.set( 'assetController', App.backgroundsController );
    
    App.routeManager.goToLocation( 'library' );
    
  },
  
  selectBackground : function( graphic ) {
    
    this.game.setBackground( graphic );
    
    App.routeManager.goToLocation( '' );
    
  },
  
  editBehaviour : function( gameObject ) {
    
    App.behaviourController.set( 'gameObject', gameObject );
    
    App.routeManager.goToLocation( 'behaviour' );
    
  }
  
});
