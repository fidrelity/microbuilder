var PaintSizeView = Ember.View.extend({
  
  templateName: 'paint/templates/paint_size_template',
  size : null,
  
  width : 128,
  height : 128,
  
  didInsertElement : function() {

    var self = this;

    // Resize object
    $('#canvas-size').resizable({
      grid: 1,
      minWidth: 32,
      minHeight: 32,
      maxWidth : 256,
      maxHeight : 256,

      handles : 'se',

      resize : function(event, ui) {
        $(".objWidth").val(ui.size.width);
        $(".objHeight").val(ui.size.height);
        
        self.set( 'width', ui.size.width );
        self.set( 'height', ui.size.height );
      },

      stop: function(event, ui) {
        App.paintSizeView.setPaintType(ui.helper.parent());
      }

    });

    $('#canvas-size .ui-icon').css({
      'background': 'url("/assets/paint/handle.png")',
      width : '30px', height: '30px'
    });

    $('.sizeInput').change( function() {

      var w = Math.min( parseInt($(".objWidth").val()), 256);
      var h = Math.min( parseInt($(".objHeight").val()), 256) ;
      
      $('#canvas-size').css({ width: w  + "px", height: h + "px" });
      
      $(".objWidth").val(w);
      $(".objHeight").val(h);
        
    });

    // Click on object type
    $('.paint-type').click(function() {

      App.paintSizeView.setPaintType( $(this) );

    });

    // Init tooltips
    $('.ttip').tooltip();
    $('.ttipBottom').tooltip({ placement: 'bottom' });
    $('.pop').popover();
    $('.popBottom').popover({ placement: 'bottom' });

  },
  
  setPaintType : function(_obj) {
    
    var button = this.$("#startPainting"),
      msg = "Start painting ";
      
    this.$('.paint-type').removeClass('type-selected');
    
    _obj.addClass('type-selected');
    
    if ( _obj.attr('data-type') === 'background' ) {
      
      msg += "background";
      
    } else {
      
      msg += "graphic";
      
    }
    
    button.html(msg);
    button.css({ display : 'block' });
    
  },

  start : function() {

    var type = this.$(".type-selected").attr('data-type'),
      w, h, size, isBackground = false;

    if ( type === 'object' ) {

      size = $('#canvas-size');
      w = size.width();
      h = size.height();

    } else {

      w = 640;
      h = 390;
      
      isBackground = true;
      
    }
    
    App.paintSizeView.remove();
    
    App.paintController.initType( isBackground, w, h );
    
    App.paintView.appendTo( '#content' );
    
  }
  
});