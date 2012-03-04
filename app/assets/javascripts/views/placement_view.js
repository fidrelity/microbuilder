var PlacementView = Ember.View.extend({

  templateName : 'templates_placement_template',
  
  graphicBinding : 'App.placementController.graphic',
  
  position : new Vector(),
  
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
  
    App.editorController.placeGraphic( this.get( 'graphic' ), this.position );
  
  }

});