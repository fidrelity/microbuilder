/*
  ToolBoxController
  
  - Manages paint tools
*/
var ToolBoxController = Ember.Object.extend({

  tools : null,
  currentTool : null,
  activeClass : 'active-tool',

  init : function () {
    console.log("init toolbox")
    this.set('currentTool', App.PencilTool);
  },
  
  click : function(toolModel) {
    this.set('currentTool', toolModel);
  },

  setCurrentTool : function(_tool) {
    //console.log(_tool);
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
    this.pixelDrawer = new PixelDrawer();
  },

  initAfter : function () {
    this.tempCanvas = $('#canvas-sketch');
    this.tempContext = this.tempCanvas[0].getContext("2d");
    //console.log("tempcanvas", $('#canvas-sketch'));

    this.zoomCanvas = document.getElementById("zoomCanvas");
    this.zoomContext = this.zoomCanvas.getContext("2d");
  },
  
  click : function(_options) {
    this.showTempCanvas();
  },

  mousedown : function(_options, _pixelDrawer) {
    this.sprite = _options.sprite;
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
    this.tempContext.clearRect(0, 0, this.currentSprite.width, this.currentSprite.height);

    // Draw on pixelDrawer current canvas => tempCanvas
    this.draw(this.startX, this.startY, _options.x, _options.y);
  },

  mouseup : function(_options) {
    this.isActive = false;

    // Set pixelDrawer canvas to draw to current sprite canvas
    this.pixelDrawer.setCanvasContext(App.paintController.getCurrentSpriteModel().canvas);
    // Draw on current sprite canvas
    this.draw();
    // Push state
    _options.sprite.pushState();

    // Change back to tempCanvas
    this.pixelDrawer.setCanvasContext(this.tempCanvas[0]);
    this.pixelDrawer.context.clearRect(0, 0, this.currentSprite.width, this.currentSprite.height);

    this.endX = this.startX;
    this.endY = this.startY;
  },

  draw : function(_x, _y, _endX, _endY) {
    var x = _x || this.startX;
    var y = _y || this.startY;
    var endX = _endX || this.endX;
    var endY = _endY || this.endY;

    this.pixelDrawer.popImageData();
    this.drawFunction(x, y, endX, endY, App.paintController.color, App.paintController.size);
    this.pixelDrawer.pushImageData();

    // Update ZoomCanvas
    App.paintController.clearZoomCanvas();
    App.paintController.zoomImageData(this.currentContext.getImageData(0, 0, this.currentSprite.width, this.currentSprite.height));
    App.paintController.zoomImageData(this.tempContext.getImageData(0, 0, this.currentSprite.width, this.currentSprite.height));
    
  },

  // Show temp canvas over current canvas (sprite)
  showTempCanvas : function() {
    this.currentSprite  = App.paintController.getCurrentSpriteModel().canvas;
    this.currentContext = this.currentSprite.getContext("2d");

    // Set temp canvas as canvas to draw in pixelDrawer and zoomTool
    this.pixelDrawer.setCanvasContext(this.tempCanvas[0]);
    
    // Set position of temp canvas
    var canvasObject = $("#" + this.currentSprite.id);
    this.tempCanvas.css({     
                            left: canvasObject.position().left,
                            top: canvasObject.position().top,
                            width: canvasObject.width(),
                            height: canvasObject.height()
                        }).show();
  },

  hideSketchCanvas : function() {
    Paint.tempCanvas.hide();
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

