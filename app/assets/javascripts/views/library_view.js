var LibraryView = Ember.View.extend({
  
  templateName : 'templates_library_template'
  
});

var GraphicView = Ember.View.extend({
  
  graphic : null,
  
  select : function() {
    
    var graphic = this.get('graphic');
    
    if ( graphic.isBackground ) {
      
      App.gameController.selectBackground( graphic );
      
    } else {
    
      App.gameController.selectGraphic( graphic );
    
    }
    
  }
  
});