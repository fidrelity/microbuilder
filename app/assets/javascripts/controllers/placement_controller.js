/*
  PlacementController
  
  - manages the graphic being placed
*/

var PlacementController = Ember.Object.extend({

  graphic : null,
  
  placeGraphic : function( pos ) {
    
    App.gameController.placeGraphic( this.get( 'graphic' ), pos );
    
  }

});
