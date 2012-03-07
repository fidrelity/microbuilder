var PlacementView = Ember.View.extend({

  templateName : 'templates_placement_template',
  
  graphicBinding : 'App.placementController.graphic',
  
  position : null,
  
  didInsertElement : function() {
    
    var self = this;
    
    this.position = new Vector();
    
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