var SelectToolModel = Ember.Object.extend({

  isSelectable : true,
  startX : 0,
  startY : 0,
  endX : 0,
  endY : 0,
  isActive : false,
  pixelDrawer : null,
  tempCanvas : null,
  marginToMouse : 2,

  initAfter : function () {
    this.pixelDrawer = App.paintController.pixelDrawer;

    this.tempCanvas = App.paintController.finalCanvas;
    this.tempCtx = this.tempCanvas[0].getContext("2d");

    this.wrapper = $("#zoom-canvas-area"); // to know the offset coord

    this.selectDiv = $('#selectToolDiv');
    this.selectDiv.draggable({
      start : function(event, ui) {
        that = App.selectTool;
        dragWidth =that.endX - that.startX;
        dragHeight = that.endY - that.startY;

        App.paintController.erase(that.finalX, that.finalY, that.finalWidth, that.finalHeight);
        App.paintController.updateZoom();
      },

      drag : function() {},

      stop : function(event, ui) {
        event.stopPropagation();

        var data =  App.selectTool.tempCtx.getImageData(0, 0,  App.selectTool.tempCanvas[0].width, App.selectTool.tempCanvas[0].height);

        var coord = App.selectTool.getCoord(ui.position.left, ui.position.top);
        var offset = App.selectTool.getOffset();
        var x = (ui.position.left - offset.x) / App.paintController.zoom;
        var y = (ui.position.top - offset.y) / App.paintController.zoom;

        App.paintController.zoomContext.putImageData(data, x, y);
        App.paintController.drawToSprite();

        App.selectTool.reset();
      }
    });

    $(document).keydown(function(e) {
        /*
        if(!App.selectTool.selectDiv.is(":visible")) return false;
        console.log(e.keyCode);

        switch(e.keyCode) {
          case(46) : App.selectTool.clearSelected(); break;
        }
        */
    });

  },
  
  click : function() {
    App.paintController.hideTempCanvas();
  },

  mousedown : function(_options) {
    this.reset();

    this.isActive = true;
    this.selectDiv.show();

    var coord = this.getCoord(_options.x, _options.y);
    this.startX = coord.x - this.marginToMouse;
    this.startY = coord.y - this.marginToMouse;
   
    this.selectDiv.css({ left: this.startX, top: this.startY, width: 0, height: 0 });
  },

  mousemove : function(_options) {
    if(!this.isActive) return false;

    var coord = this.getCoord(_options.x, _options.y);
    this.endX = coord.x - this.marginToMouse;
    this.endY = coord.y - this.marginToMouse;

    var w = this.endX - this.startX;
    var h = this.endY - this.startY;

    this.selectDiv.css({ width: w, height: h });
  },

  mouseup : function(_options) {
    if(!this.isActive) return false;
    this.isActive = false;
    this.copyToCanvas(this.startX + 1, this.startY + 1, this.endX, this.endY);
  },

  copyToCanvas : function(startX, startY, endX, endY) {
    var offset = this.getOffset();

    this.finalWidth = (endX  - startX) / App.paintController.zoom;
    this.finalHeight = (endY - startY) / App.paintController.zoom;

    this.finalX = (startX - offset.x) / App.paintController.zoom ;
    this.finalY = (startY - offset.y) / App.paintController.zoom ;

    this.tempCanvas[0].width = this.finalWidth;
    this.tempCanvas[0].height = this.finalHeight;
    this.tempCanvas[0].style.width = this.finalWidth;
    this.tempCanvas[0].style.height = this.finalHeight;

    // copy
    var imageData = App.paintController.zoomContext.getImageData(this.finalX, this.finalY, this.finalWidth, this.finalHeight);
    this.tempCtx.putImageData(imageData, 0, 0);

    // Draw temp image into selectToolDiv
    var img_data = this.tempCanvas[0].toDataURL("image/png");
    var img = new Image();
    img.src = img_data;
    img.width = (endX - startX) - 1;
    img.height = (endY - startY) -1;

    img.onload = function() {
      App.selectTool.selectDiv.html(img);
    };
  },

  clearSelected : function() {
    App.paintController.erase(this.finalX, this.finalY, this.finalWidth, this.finalHeight);
    App.paintController.updateZoom();
    this.reset();
  },

  reset : function() {
    this.startX = 0;
    this.startY = 0;
    this.endX = 0;
    this.endY = 0;
    this.selectDiv.hide().html("");
    this.tempCanvas[0].width = App.paintController.spriteSize.width;
    this.tempCanvas[0].height = App.paintController.spriteSize.height;
  },

  getOffset : function() {

    var canvasObject = $("#" + App.paintController.zoomCanvas.id); //"#zoomCanvas"
    var scrollArea = this.wrapper[0];
 
    var newLeft = scrollArea.scrollLeft + canvasObject.position().left,
        newTop  = scrollArea.scrollTop + canvasObject.position().top;
    return {x: newLeft, y: newTop};
  },

  getCoord : function(_x, _y) {
    var offset = this.getOffset();
    var coordX = (_x * App.paintController.zoom ) + offset.x;
    var coordY = (_y * App.paintController.zoom ) + offset.y;

    return {x: coordX, y: coordY };
  }

});