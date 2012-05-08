var PencilToolModel = Ember.Object.extend({

  isSelectable : true,
  oldX : 0,
  oldY : 0,
  isActive : false,
  
  init : function () {
    
  },
  
  click : function(toolModel) {
  
  },

  mousedown : function(_options) {
    this.isActive = true;   
  },

  mousemove : function(_options) {
    if(!this.isActive) return false;   
  },

  mouseup : function() {
    this.isActive = false;
    _options.sprite.pushState();
  },

  draw : function(_x, _y, _endX, _endY) {
    if(this.get('isErasing') == true) {
      this.sprite.erase(_x, _y, 10 );
    } else {
      this.pixelDrawer.popImageData();
      this.pixelDrawer.drawLine(_x, _y, _endX, _endY, App.paintController.color, 2);
      this.pixelDrawer.pushImageData();
    }

  },

});