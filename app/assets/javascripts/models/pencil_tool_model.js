var PencilToolModel = Ember.Object.extend({

  isSelectable : true,
  oldX : 0,
  oldY : 0,
  isActive : false,
  pixelDrawer : null,
  isErasing : false,
  sprite : null,
  
  init : function () {
    this.pixelDrawer = App.paintController.pixelDrawer;
  },
  
  click : function() {
    App.paintController.hideTempCanvas();
  },

  mousedown : function(_options) {
    this.isActive = true;
    this.sprite = _options.sprite;
    this.draw(_options.x, _options.y, _options.x, _options.y);
    //
    this.oldX = _options.x;
    this.oldY = _options.y;
  },

  mousemove : function(_options) {
    if(!this.isActive) return false;
    this.draw(this.oldX, this.oldY, _options.x, _options.y);

    this.oldX = _options.x;
    this.oldY = _options.y;
  },

  mouseup : function(_options) {
    this.isActive = false;
    App.paintController.drawToSprite();
  },

  draw : function(_x, _y, _endX, _endY) {
    if(this.get('isErasing') == true) {
      var centered = App.paintController.size > 4 ? App.paintController.size / 2 : 0;
      this.sprite.erase(_x - centered, _y - centered, App.paintController.size);
    } else {
      this.pixelDrawer.popImageData();
      this.pixelDrawer.drawLine(_x, _y, _endX, _endY, App.paintController.color, App.paintController.size * App.paintController.zoom);
      this.pixelDrawer.pushImageData();
    }

    // Update ZoomCanvas
    //App.paintController.clearZoomCanvas();        
  },

  setEraser : function(_state) {
    this.set('isErasing', _state);
    App.paintController.toggleColorPalette(!_state);
  }

});