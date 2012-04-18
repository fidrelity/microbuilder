var PlacementView = Ember.View.extend({

  templateName : 'templates_placement_template',
  
  displayAll : true,
  
  player : null,
  type : 'graphic',
  
  didInsertElement : function() {
    
    var self = this,
      player;
    
    if ( this.type === 'graphic' ) {
    
      player = new Player();
      
      player.edit = true;
      // player.debug = true;
      
      player.setCanvas( $('#placementCanvas')[0] );
      player.parse( App.gameController.getGameData() );
      
      player.setDragObject( App.placementController.graphic.imagePath );
      
      this.set( 'player', player );
    
    }
    
  },
  
  placeGraphic : function() {
  
    App.placementController.placeGraphic( this.get( 'player' ).dragObject.position );
  
  }

});