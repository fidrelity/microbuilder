/*
  ToolBoxController
  
  - Manages paint tools
*/
var ToolBoxController = Ember.Object.extend({

  tools : null,
  currentTool : null,
  activeClass : 'active-tool',

  init : function () {
    this.set('currentTool', App.pencilTool);
  },
  
  click : function(toolModel) {
    this.set('currentTool', toolModel);
  },

  setCurrentTool : function(_tool) {
    if(!_tool) return false;
    this.set('currentTool', _tool);
  },

  getCurrentTool : function() {
    return this.get('currentTool');
  },

  highLightTool : function(_tool) {

  },

});


// -----------------------------------------

var DrawToolModel = Ember.Object.extend({

  isSelectable : true,
  isActive : false,
  drawFunction : null,
  //
  tempCanvas : null,

  init : function () {

    this.pixelDrawer = App.paintController.pixelDrawer;

  },

  initAfter : function () {

    /*
    this.tempCanvas = App.paintController.tempCanvas;
    this.tempContext = App.paintController.tempContext;

    this.zoomCanvas = App.paintController.zoomCanvas;
    this.zoomContext = App.paintController.zoomContext;
    */
    this.tempCanvasModel = TempCanvasModel.create();  
    this.tempCanvasModel.initDomReady();  

    this.tempCanvas = this.tempCanvasModel.canvas;
    this.tempContext = this.tempCanvasModel.context;

    this.zoomCanvas = App.paintController.zoomModel.canvas;
    this.zoomContext = App.paintController.zoomModel.context;

    this.colorPicker = App.paintController.colorPicker;
    
  },
  
  click : function(_options) {

    this.setTempCanvas();

  },

  mousedown : function(_options) {

    this.isActive = true;
    //
    this.startX = _options.x;
    this.startY = _options.y;

    // Draw on pixelDrawer current canvas => tempCanvas
    this.draw(_options.x, _options.y, _options.x, _options.y);

  },

  mousemove : function(_options) {

    if(!this.isActive) return false;

    this.endX = _options.x;
    this.endY = _options.y;

    // Clear tempCanvas
    this.tempContext.clearRect(0, 0, this.zoomCanvas.width, this.zoomCanvas.height);

    // Draw on pixelDrawer current canvas => tempCanvas
    this.draw(this.startX, this.startY, _options.x, _options.y);

  },

  mouseup : function(_options) {

    if(!this.isActive) return false;
    this.isActive = false;
      
    // Set pixelDrawer canvas to zoom canvas
    this.pixelDrawer.setCanvasContext(this.zoomCanvas);

    // Draw on zoom canvas
    this.draw();

    // Draw on sprite canvas
    App.paintController.drawToSprite();

    // Change back to tempCanvas
    this.pixelDrawer.setCanvasContext(this.tempCanvas);
    this.pixelDrawer.context.clearRect(0, 0, this.zoomCanvas.width, this.zoomCanvas.height);

    this.endX = this.startX;
    this.endY = this.startY;
    
  },

  draw : function(_x, _y, _endX, _endY) {

    var x = _x || this.startX;
    var y = _y || this.startY;
    var endX = _endX || this.endX;
    var endY = _endY || this.endY;

    this.pixelDrawer.popImageData();
    this.drawFunction(x, y, endX, endY, this.colorPicker.color, App.paintController.toolSize);
    this.pixelDrawer.pushImageData();

  },

  // Show temp canvas over current canvas (sprite)
  setTempCanvas : function() {

    // Set temp canvas as canvas to draw in pixelDrawer
    this.pixelDrawer.setCanvasContext(this.tempCanvas);    
    
    this.tempCanvasModel.showTempCanvas();

  },

  setDrawFunction : function(_fnc) {

    var drawFnc = null;
    switch (_fnc) {

      case("rect") : this.drawFunction = this.pixelDrawer.drawRect.bind(this.pixelDrawer); break;

      case("fillrect") : this.drawFunction = this.pixelDrawer.fillRect.bind(this.pixelDrawer); break;

      case("circle") : this.drawFunction = this.pixelDrawer.drawCircle.bind(this.pixelDrawer); break;

      case("fillcircle") : this.drawFunction = this.pixelDrawer.fillCircle.bind(this.pixelDrawer); break;

      case("line") : this.drawFunction = this.pixelDrawer.drawLine.bind(this.pixelDrawer); break;

    }

  }

});


// -----------------------
var FillToolModel = Ember.Object.extend({

  initAfter : function () {

    this.zoomCanvas = App.paintController.zoomModel.canvas;
    this.zoomContext = App.paintController.zoomModel.context;
    this.pixelDrawer = App.paintController.pixelDrawer;

  },
  
  click : function(_options) {

    App.paintController.hideTempCanvas();

  },

  mousedown : function(_options, _pixelDrawer) {
    // Draw on pixelDrawer current canvas => tempCanvas
    this.draw(_options.x, _options.y);
  },

  mousemove : function(_options) {
  },

  mouseup : function(_options) {   
  },

  draw : function(_x, _y) {

    this.pixelDrawer.popImageData();
    var oldColor = this.pixelDrawer.getPixelColor(_x, _y);
    this.pixelDrawer.floodFill(_x, _y, App.paintController.getColor(), oldColor);
    this.pixelDrawer.pushImageData();

    App.paintController.drawToSprite();

  }

});