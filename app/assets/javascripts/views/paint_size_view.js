var PaintSizeView = Ember.View.extend({
  
  templateName: 'templates/paint_size_template',
  size : null,
  
  didInsertElement : function() {
    $('#canvas-size').resizable({
      grid: 16,
      maxWidth : 128,
      maxHeight : 128
    });
  },

  start : function() {
    
    var size_sprite = $('#canvas-size');
    var w = size_sprite.width();
    var h = size_sprite.height();

    $("#paint-size-wrapper").hide();
    App.paintView.appendTo('#content');
    App.paintController.setSpriteSize({width: w, height:h});
    
  }
  
});