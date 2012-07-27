var ColorPipetteModel = Ember.Object.extend({

  isSelectable : true,
  isActive : false,
  pixelDrawer : null,
  
  init : function () {

    this.pixelDrawer = App.paintController.pixelDrawer;
    
  },

  initDomReady : function() {

    // this.colorPicker = App.paintController.colorPicker;

  },
  
  click : function() {

    App.paintController.hideTempCanvas();

  },

  mousedown : function(_options) {

    this.isActive = true;
    var rgbColor = this.pixelDrawer.getPixelColor(_options.x, _options.y);    
    //this.colorPicker.colorPicked(null, this.RGBtoHex(rgbColor), null);

  },

  mousemove : function(_options) {
  },

  mouseup : function(_options) {

    this.isActive = false;
    
  },

  RGBtoHex : function(rgb) {

    var hex = [
      rgb[0].toString(16),
      rgb[1].toString(16),
      rgb[2].toString(16)
    ];

    $.each(hex, function (nr, val) {
      if (val.length == 1) {
        hex[nr] = '0' + val;
      }
    });

    return hex.join('');

  }

});