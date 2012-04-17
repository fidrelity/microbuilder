var PaintView = Ember.View.extend({
  
  templateName: 'templates/paint_template',
  
  didInsertElement : function() {
    
    paint_main();
    
  }
  
});


var SpriteView = Ember.View.extend({
  
  templateName: 'templates_sprite_template',
  sprite : null,
  
  didInsertElement : function() {
      
    
  },

  setCurrentSpriteModel : function() {
    App.paintController.setCurrentSpriteModel(this.get("sprite"));
  },
  
});