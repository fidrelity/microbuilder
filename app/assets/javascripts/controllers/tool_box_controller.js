/*
  ToolBoxController
  
  - Manages paint tools
*/
var ToolBoxController = Ember.Object.extend({

  tools : null,
  currentTool : null,
  activeClass : 'active-tool',

  init : function () {
    this.set('currentTool', App.PencilTool);
  },
  
  click : function(toolModel) {
    this.set('currentTool', toolModel);
  },

  setCurrentTool : function(_tool) {
    console.log(_tool);
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
    console.log("tempcanvas", $('#canvas-sketch'));
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
    this.draw(_options.x, _options.y, _options.x, _options.y);
  },

  mousemove : function(_options) {
    if(!this.isActive) return false;
    this.pixelDrawer.context.clearRect(0, 0, this.currentSprite.width, this.currentSprite.height);

    this.endX = _options.x;
    this.endY = _options.y;

    this.draw(this.startX, this.startY, _options.x, _options.y);


  },

  mouseup : function(_options) {
    this.isActive = false;

    // Draw on sprite
    this.pixelDrawer.setCanvasContext(this.currentSprite);
    this.draw();
    _options.sprite.pushState();

    // Change back to tempCanvas
    this.pixelDrawer.setCanvasContext(this.tempCanvas[0]);
    this.pixelDrawer.context.clearRect(0, 0, this.currentSprite.width, this.currentSprite.height);
  },

  draw : function(_x, _y, _endX, _endY) {
    var x = _x || this.startX;
    var y = _y || this.startY;
    var endX = _endX || this.endX;
    var endY = _endY || this.endY;
    this.pixelDrawer.popImageData();
    this.drawFunction(x, y, endX, endY, App.paintController.color, 2);
    this.pixelDrawer.pushImageData();
  },

  showTempCanvas : function() {
    this.currentSprite = App.paintController.getCurrentSpriteModel().canvas;
    this.currentContext = this.currentSprite.getContext("2d");

    this.pixelDrawer.setCanvasContext(this.tempCanvas[0]);
    
    var canvasObject = $("#" + this.currentSprite.id);
    // Set position of canvasSketch
    this.tempCanvas.css({     
                            left: canvasObject.position().left,
                            top: canvasObject.position().top,
                            width: canvasObject.width(),
                            height: canvasObject.height()
                        }).show();

    //var g = document.getElementById(Paint.canvasToDraw.attr('id'));
    //Paint.canvasSketchContext.drawImage(g, 0, 0);
    //Paint.setCurrentCanvas(Paint.canvasSketch.attr("id"));
  },

  hideSketchCanvas : function() {
    //Paint.canvasSketchContext.clearRect(0, 0, Paint.pixelDrawer.canvas.width, Paint.pixelDrawer.canvas.height);
    Paint.setCurrentCanvas(Paint.canvasToDraw.attr("id"));
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

