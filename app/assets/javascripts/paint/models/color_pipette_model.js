var ColorPipetteModel = Ember.Object.extend({

  isSelectable : true,

  init : function () {},

  click : function() {

    App.paintController.hideTempCanvas();

  },

  mousedown : function( _options ) {

    var rgbColor = App.paintController.pixelDrawer.getPixelColor(_options.x, _options.y);
    App.paintController.set( 'color', rgbToHex( rgbColor[0], rgbColor[1], rgbColor[2] ) )

  },

  mousemove : function( _options ) {},

  mouseup : function( _options ) {}

});