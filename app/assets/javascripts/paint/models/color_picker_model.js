var ColorPickerModel = Ember.Object.extend({

  domObj : null,
  color : "FF0000",
  
  init : function () {
   
  },

  initDomReady : function() {

    this.domObj = $('#colorPicker');

    this.colorChooser = $('#colorChooser');

    this.domObj.ColorPicker({

      onShow: function (colpkr) {

        $(colpkr).fadeIn(500);
        return false;

      },

      onHide: function (colpkr) {

        $(colpkr).fadeOut(500);
        return false;

      },

      onChange : function(hsb, hex, rgb){

        App.paintController.colorPicker.colorPicked(hsb, hex, rgb);

      }

    });

    this.domObj.ColorPickerSetColor(this.color);

  },

  reset : function() {

    this.color = "#FF0000";

  },

  toggleColorPalette : function(_visible) {

    if(_visible)
      this.colorChooser.show();
    else
      this.colorChooser.hide();

  },
  
  colorPicked : function (hsb, hex, rgb) {

      this.domObj.css('background-color', '#'+hex);
      this.domObj.css('background-image', 'none');
      this.domObj.ColorPickerSetColor(hex);
      
      this.color = hex;
  },

  setColor : function(_color) {

    var color = _color || "#000000";
    this.color = color.substr(0,1) != '#' ? '#' + color : color;

  },
  
 
});