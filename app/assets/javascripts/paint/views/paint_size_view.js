var PaintSizeView = Ember.View.extend({
  
  templateName: 'paint/templates/paint_size_template',
  size : null,
  
  width : 128,
  height : 128,
  
  didInsertElement : function() {

    var self = this;
    
    this.set( 'width', 128 );
    this.set( 'height', 128 );

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
    
    $('#canvas-size').addTouch(); // size selector compatible for touch events

    $('#canvas-size .ui-icon').css({
      'background': 'url("/assets/paint/handle.png")',
      width : '30px', height: '30px'
    });

    $('.sizeInput').change( function() {

      var w = clamp( parseInt($(".objWidth").val()), 32, 256 );
      var h = clamp( parseInt($(".objHeight").val()), 32, 256 );
      
      $('#canvas-size').css({ width: w  + "px", height: h + "px" });
      
      $(".objWidth").val(w);
      $(".objHeight").val(h);

      self.set( 'width', w );
      self.set( 'height', h );
        
    });

    // Click on object type
    $('.paint-type').click(function() {

      App.paintSizeView.setPaintType( $(this) );

    });

    // Init tooltips
    $('.ttip').tooltip();
    $('.ttipBottom').tooltip({ placement: 'bottom' });
    $('.pop').popover({trigger: "hover"});
    $('.popBottom').popover({ placement: 'bottom', trigger: "hover" });

  },
  
  setPaintType : function(_obj) {
    
    var button = this.$("#startPainting"),
      msg = "start painting ";
      
    this.$('.paint-type').removeClass('type-selected');
    
    _obj.addClass('type-selected');
    
    if ( _obj.attr('data-type') === 'background' ) {
      
      msg += "background";
      
    } else {
      
      msg += "graphic (" + this.width + 'x' + this.height + ')';
      
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
    
    App.paintController.initPaint( isBackground, w, h );
    Notifier.add( 'Your image will be stored in the browser until you publish it to your profile.', 'info' ).notify();
    
  }
  
});