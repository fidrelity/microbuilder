var LibraryView = Ember.View.extend({
  
  templateName : 'templates_library_template'
  
});

var GraphicsView = Ember.View.extend({
  
  graphic : null,
  
  select : function() {
    
    var graphic = this.get('graphic');
    
    App.editorController.selectGraphic( graphic );
    
  }
  
});