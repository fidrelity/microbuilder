// ----------------------------------------
// ColorPalette CLASS
// ----------------------------------------
var ColorPalette = {
  domWrapper  : $('#palette'),
  domColorDiv : $('.colorBlock'),
  colors      : [ '000000', 'FFFFFF', '333333', '8A662D', 'FFEA05', 'FF1A00', 'CC0000', 'FF7400', 'C79810', '73880A', '008C00', '006E2E', '4096EE', '356AA0', '3F4C6B', 'FF0084' ],
  activeClass : 'activeColor',
  currentColor : null,

  init : function() {
    console.log("init", ColorPalette.domWrapper);
    ColorPalette.create();
    ColorPalette.domColorDiv.live('click', $.proxy(ColorPalette.clickColor, this));
    ColorPalette.setColor(ColorPalette.colors[0]);
  },

  create : function() {
    ColorPalette.domWrapper.html('');
    for (var i = ColorPalette.colors.length - 1; i >= 0; i--) {
      var color = ColorPalette.colors[i];
      ColorPalette.domWrapper.append('<div class="colorBlock" id="'+color+'" style="background:#'+color+'"></div>');
    };
    ColorPalette.domColorDiv = $('.colorBlock');
    console.log(ColorPalette.domWrapper);
  },

  clickColor : function(e) {
    var colorId = e.currentTarget.id;
    ColorPalette.setColor(colorId);
  },

  setColor : function(_color) {
    if(!_color || ColorPalette.colors.indexOf(_color) < 0) return false;
    ColorPalette.currentColor = _color.substr(1) != '#' ? '#' + _color : _color;

    ColorPalette.domColorDiv.removeClass(ColorPalette.activeClass);
    $(ColorPalette.currentColor).addClass(ColorPalette.activeClass);
  },
};