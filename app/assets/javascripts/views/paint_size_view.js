var PaintSizeView = Ember.View.extend({
  
  templateName: 'templates/paint_size_template',
  size : null,
  
  didInsertElement : function() {
    $('#canvas-size').resizable({
      grid: 16,
      minWidth: 32,
      minHeight: 32,
      maxWidth : 256,
      maxHeight : 256,
      stop: function(event, ui) { 
        console.log(ui.size)
        //$('#zoomCanvas').css({ width: ui.width, height: ui.height}).attr('width', ui.width).attr('height', ui.height);
      }

    });

    $('.paint-type').click(function() {
      $('.paint-type').removeClass('type-selected');
      $(this).addClass('type-selected');

      App.paintSizeView.setPaintType($(this).attr('data-type'));
    });
  },


  setPaintType : function(_type) {
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

    //$("#paint-size-wrapper").hide();    
    App.paintSizeView.remove();

    App.paintController.initType(type, w, h);

    App.paintView.appendTo('#content');
  }
  
});