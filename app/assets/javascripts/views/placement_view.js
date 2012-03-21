var PlacementView = Ember.View.extend({

  templateName : 'templates_placement_template',
  
  graphicBinding : 'App.placementController.graphic',
  backgroundBinding : 'App.gameController.game.background',
  
  position : new Vector(),
  
  displayAll : true,
  
  didInsertElement : function() {
    
    var self = this;
    
    if ( this.get( 'graphic' ) ) {
    
      $('#placementGraphic').draggable({
        containment: '#placementCanvas', 
        scroll: false,
        
        stop: function(e, ui) {
          
          self.position.set( ui.position.left, ui.position.top );
          
        }
        
      });
    
    }
    
  },
  
  placeGraphic : function() {
  
    App.gameController.placeGraphic( this.get( 'graphic' ), this.position );
  
  }

});