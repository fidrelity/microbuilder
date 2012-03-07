var LibraryView = Ember.View.extend({
  
  templateName : 'templates_library_template'
  
});

var GraphicView = Ember.View.extend({
  
  graphic : null,
  
  select : function() {
    
    var graphic = this.get('graphic');
    
    App.gameController.selectGraphic( graphic );
    
  }
  
});

var BackgroundView = Ember.View.extend({
  
  graphic : null,
  
  select : function() {
    
    var graphic = this.get('graphic');
    
    App.gameController.selectBackground( graphic );
    
  }
  
});