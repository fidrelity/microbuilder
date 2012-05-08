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
    //this.pixelDrawer = _pixelDrawer;
    this.sprite = _options.sprite;

    this.isActive = true;
    this.draw(_options.x, _options.y, _options.x, _options.y);
    //
    this.startX = _options.x;
    this.startY = _options.y;

    // /////////// //
    /*
    Paint.showSketchCanvas();
    this.isActive = true;
    this.startX = _options.coordinates.x;
    this.startY = _options.coordinates.y;

    this.sourceCanvas = Paint.canvasToDraw[0];
    this.sourceContext = this.sourceCanvas.getContext("2d");
    this.drawCanvas = Paint.getCurrentCanvasDom()[0];
    this.drawContext = this.drawCanvas.getContext("2d");
    */
  },

  mousemove : function(_options) {
    if(!this.isActive) return false;
    this.draw(this.startX, this.startY, _options.x, _options.y);

    this.endX = _options.x;
    this.endY = _options.y;
  },

  mouseup : function(_options) {
    this.isActive = false;
    _options.sprite.pushState();
  },

  draw : function(_x, _y, _endX, _endY) {
    this.pixelDrawer.popImageData();
    this.pixelDrawer.drawLine(_x, _y, _endX, _endY, '#000000', 2);
    this.pixelDrawer.pushImageData();
  },

  showTempCanvas : function() {
    this.currentSprite = App.paintController.getCurrentSpriteModel().canvas;
    this.pixelDrawer.setCanvasContext(this.currentSprite);
    
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

});

