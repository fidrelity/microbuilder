var PencilToolModel = Ember.Object.extend({

  isSelectable : true,
  oldX : 0,
  oldY : 0,
  isActive : false,
  
  init : function () {
    
    pixelDrawer : null,
    isErasing : false,

  },
  
  click : function(toolModel) {
  
  },

  mousedown : function(_options) {
    this.isActive = true;   
  },

  mousemove : function(_options) {
    if(!this.isActive) return false;   
  },

  mouseup : function(_options) {
    this.isActive = false;
    _options.sprite.pushState();
  },

  draw : function(_x, _y, _endX, _endY) {
    if(this.get('isErasing') == true) {
      var centered = App.paintController.size > 4 ? App.paintController.size / 2 : 0;
      this.sprite.erase(_x - centered, _y - centered, App.paintController.size);
    } else {
      this.pixelDrawer.popImageData();
      this.pixelDrawer.drawLine(_x, _y, _endX, _endY, App.paintController.color, App.paintController.size);
      this.pixelDrawer.pushImageData();
    }

    // Update ZoomCanvas
    App.paintController.clearZoomCanvas();
    App.paintController.zoomImageData(this.pixelDrawer.context.getImageData(0, 0, this.pixelDrawer.canvas.width, this.pixelDrawer.canvas.height));    
  },

});