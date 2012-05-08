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
      
    this.$('#zoomCanvas').mousemove(function(e){
      App.paintController.mousemove(e);
    });

    // Slider for pencil size
    $("#sizeSlider").slider({
      value: Paint.lineWidth, 
      min: 1,
      max: 10, 
      step: 1,
      change: function( event, ui ) {
        App.paintController.setSize(ui.value);
      }
    });
  },

  setCurrentSpriteModel : function() {
    App.paintController.setCurrentSpriteModel(this.get("sprite"));
  },
  
});