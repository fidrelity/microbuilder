var SelectToolModel = Ember.Object.extend({

  isSelectable : true,
  startX : 0,
  startY : 0,
  endX : 0,
  endY : 0,
  isActive : false,
  pixelDrawer : null,
  tempCanvas : null,

  initAfter : function () {
    this.pixelDrawer = App.paintController.pixelDrawer;

    this.tempCanvas = App.paintController.finalCanvas;
    this.tempCtx = this.tempCanvas[0].getContext("2d");
    console.log(this.tempCanvas[0]);


    var canvas = this.tempCanvas[0];

    this.wrapper = $("#zoom-canvas-area"); // to know the offset coord

    this.selectDiv = $('#selectToolDiv');
    this.selectDiv.draggable({
      start : function(event, ui) {
        that = App.selectTool;
        dragWidth =that.endX - that.startX;
        dragHeight = that.endY - that.startY;

        var coord = that.getCoord(that.startX, that.startY);

        //App.paintController.zoomContext.clearRect(coord.x, coord.y, dragWidth, dragHeight);
        //App.paintController.zoomContext.clearRect(that.finalX, that.finalY, that.finalWidth, that.finalHeight);
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

  },
  
  click : function() {
    App.paintController.hideTempCanvas();
  },

  mousedown : function(_options) {
    this.reset();

    this.isActive = true;
    this.selectDiv.show();

    console.log(_options.x, _options.y);

    var coord = this.getCoord(_options.x, _options.y);
    this.startX = coord.x - 2; //(_options.x * App.paintController.zoom ) + offset.x - 2;
    this.startY = coord.y - 2; //(_options.y * App.paintController.zoom ) + offset.y - 2;

    App.paintController.zoomContext.fillStyle = '#3ac6e5';
    App.paintController.zoomContext.fillRect(_options.x, _options.y, 1, 1);

    var w = 0;
    var h = 0;

    this.selectDiv.css({ left: this.startX, top: this.startY, width: w, height: h });
  },

  mousemove : function(_options) {
    if(!this.isActive) return false;

    var coord = this.getCoord(_options.x, _options.y);
    this.endX = coord.x - 2; //(_options.x * App.paintController.zoom ) + offset.x - 2;
    this.endY = coord.y - 2 ; //(_options.y * App.paintController.zoom ) + offset.y - 2;

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

    this.finalWidth = (endX - startX) / App.paintController.zoom;
    this.finalHeight = (endY - startY) / App.paintController.zoom;

    this.finalX = (startX- offset.x) / App.paintController.zoom ;
    this.finalY = (startY- offset.y) / App.paintController.zoom ;

    this.tempCanvas[0].width = this.finalWidth;
    this.tempCanvas[0].height = this.finalHeight;
    this.tempCanvas[0].style.width = this.finalWidth;
    this.tempCanvas[0].style.height = this.finalHeight;

    // copy
    var imageData = App.paintController.zoomContext.getImageData(this.finalX, this.finalY, this.finalWidth, this.finalHeight);
    this.tempCtx.putImageData(imageData, 0, 0);

    // Draw temp image
    var img_data = this.tempCanvas[0].toDataURL("image/png");
    var img = new Image();
    img.src = img_data;
    img.width = (endX - startX);
    img.height = (endY - startY);

    img.onload = function() {
      $('#selectToolDiv').html(img);
    };
  },

  reset : function() {
    this.startX = 0;
    this.startY = 0;
    this.endX = 0;
    this.endY = 0;
    this.selectDiv.hide();
    $('#selectToolDiv').html("");    
    this.tempCanvas[0].width = App.paintController.spriteSize.width;
    this.tempCanvas[0].height = App.paintController.spriteSize.height;
  },

  getOffset : function() {

    var canvasObject = $("#zoomCanvas");  
    var scrollArea = $("#zoom-canvas-area")[0];
 
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