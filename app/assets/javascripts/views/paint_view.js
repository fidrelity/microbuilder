var PaintView = Ember.View.extend({
  
  templateName: 'templates/paint_template',
  canvas: null,

  
  didInsertElement : function() {  
    paint_main();
  },

  mousedown : function() {
    App.paintController.initView();

    // OnMouse on zoomed canvas
    this.$('#zoomCanvas').mousedown(function(e){
      App.paintController.mousedown(e);
    });

  },
  
});

var SpriteView = Ember.View.extend({
  
  templateName: 'templates_sprite_template',
  sprite : null,
  
  didInsertElement : function() {
      
    this.$('#zoomCanvas').mousemove(function(e){
      App.paintController.mousemove(e);
    });

    // Onclick sprite area
    this.$('.canvas').live('click', function(e) {      
      var index = parseInt($(this).attr("data-index"));
      var spriteModel = App.paintController.getCurrentSpriteModelByIndex(index);      
      App.paintController.setCurrentSpriteModel(spriteModel);
    });

    // Slider for pencil size
    this.$("#sizeSlider").slider({
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
  }
  
});