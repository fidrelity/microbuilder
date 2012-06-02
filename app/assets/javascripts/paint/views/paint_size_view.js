var PaintSizeView = Ember.View.extend({
  
  templateName: 'paint/templates/paint_size_template',
  size : null,
  
  didInsertElement : function() {
    // Resize object
    $('#canvas-size').resizable({
      grid: 16,
      minWidth: 32,
      minHeight: 32,
      maxWidth : 256,
      maxHeight : 256,
      stop: function(event, ui) { 
        $(".objWidth").html(ui.size.width);
        $(".objHeight").html(ui.size.height);
        App.paintSizeView.setPaintType(ui.helper);
      }

    });

    // Click on object type
    $('.paint-type').click(function() {
      App.paintSizeView.setPaintType($(this));
    });

  },


  setPaintType : function(_obj) {
    $('.paint-type').removeClass('type-selected');

    _obj.addClass('type-selected');
    var _type = _obj.attr('data-type');

    var button = $("#startPainting");
    var msg = "Start painting ";
    if(_type === 'background') {
      msg += "a background image";
    } else {
      msg += "a new object";
    }
    button.html(msg);
  },

  start : function() {

    var type = $(".type-selected").attr('data-type') || 'object';
    var w, h = 0;

    if(type === 'object') {
      var size_sprite = $('#canvas-size');
      w = size_sprite.width();
      h = size_sprite.height();
    } else {
      w = 640;
      h = 390;
    }
 
    App.paintSizeView.remove();

    App.paintController.initType(type, w, h);

    App.paintView.appendTo('#content');
  }
  
});