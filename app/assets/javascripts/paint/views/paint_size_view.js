var PaintSizeView = Ember.View.extend({
  
  templateName: 'paint/templates/paint_size_template',
  size : null,
  
  didInsertElement : function() {

    // Resize object
    $('#canvas-size').resizable({
      grid: 1,
      minWidth: 32,
      minHeight: 32,
      maxWidth : 256,
      maxHeight : 256,

      resize : function(event, ui) { 
        $(".objWidth").val(ui.size.width);
        $(".objHeight").val(ui.size.height);
      },

      stop: function(event, ui) {       
        App.paintSizeView.setPaintType(ui.helper.parent());
      }

    });

    $('.sizeInput').change(function() {

        var w = Math.min( parseInt($(".objWidth").val()), 256);
        var h = Math.min( parseInt($(".objHeight").val()), 256) ;
        //
        $('#canvas-size').css({ width: w  + "px", height: h + "px" });
        //
        $(".objWidth").val(w);
        $(".objHeight").val(h);
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