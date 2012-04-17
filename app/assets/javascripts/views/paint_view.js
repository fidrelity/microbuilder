var PaintView = Ember.View.extend({
  
  templateName: 'templates_paint_template',
  canvas: null,

  
  didInsertElement : function() {
    
    paint_main();
    
  },

  mousedown : function() {

  },
  
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