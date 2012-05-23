var PaintView = Ember.View.extend({
  
  templateName: 'templates/paint_template',
  canvas: null,
  
  didInsertElement : function() {  
    //paint_main();
    App.paintController.initView();

    // OnMouse on zoomed canvas
    this.$('#zoomCanvas').mousedown(function(e){
      App.paintController.mousedown(e);
    });

    this.$('#zoomCanvas').mousemove(function(e){
      App.paintController.mousemove(e);
    });

    this.$('#zoomCanvas').mouseup(function(e){
      App.paintController.mouseup(e);
    });

    // Onclick sprite area
    this.$('.canvas').live('click', function(e) {
      var index = parseInt($(this).attr("data-index"));
      var spriteModel = App.paintController.getCurrentSpriteModelByIndex(index);      
      App.paintController.setCurrentSpriteModel(spriteModel);
    });

    // Slider for pencil size
    this.$("#sizeSlider").slider({
      value: 2, 
      min: 1,
      max: 10, 
      step: 1,
      change: function( event, ui ) {
        App.paintController.setSize(ui.value);
      }
    });
  },

});