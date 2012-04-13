// ----------------------------------------
// ToolBar CLASS
// ----------------------------------------
var ToolBar = {
  domWrapper : $('#ToolBars'),
  tools : new Array(),
  toolsDomObjects : $('.tool'), 
  activeClass : 'active-tool',
  currentTool : null,
  currentToolId : '',

  init : function() {
    /*
      $('#outlineButton').click(function(){Paint.getCurrentSpriteAreaInstance().outlinePoints();});
    */
    ToolBar.toolsDomObjects.live('click', $.proxy(ToolBar.clickTool, this));
    ToolBar.tools.push(new PencilTool());
    ToolBar.tools.push(new DragableTool(Paint.pixelDrawer.drawLine.bind(Paint.pixelDrawer),"lineToolButton"));
    ToolBar.tools.push(new DragableTool(Paint.pixelDrawer.drawCircle.bind(Paint.pixelDrawer),"circleToolButton"));
    ToolBar.tools.push(new DragableTool(Paint.pixelDrawer.fillCircle.bind(Paint.pixelDrawer),"fillCircleToolButton"));
    ToolBar.tools.push(new DragableTool(Paint.pixelDrawer.drawRect.bind(Paint.pixelDrawer),"rectToolButton"));
    ToolBar.tools.push(new DragableTool(Paint.pixelDrawer.fillRect.bind(Paint.pixelDrawer),"fillRectToolButton"));
    
    ToolBar.tools.push(new EraserTool());    
    ToolBar.tools.push(new SelectTool());    
    ToolBar.tools.push(new FlipTool());
    ToolBar.tools.push(new UndoTool());
    ToolBar.tools.push(new SaveTool());

    ToolBar.setCurrentTool("pencilToolButton");
  },

  clickTool : function(e) {
    console.log("omg");
    var tool = ToolBar.getToolInstanceById(e.currentTarget.id);
    if(tool.isSelectable) {
      ToolBar.setCurrentTool(e.currentTarget.id);
      ToolBar.reset();
    }
    tool.clickEvent();
  },

  setCurrentTool : function(_id) {
    ToolBar.currentToolId = _id;
    ToolBar.currentTool = ToolBar.getToolInstanceById(_id);
    ToolBar.highlightTool(_id);
  },

  reset : function() {
    Paint.hideCursorRect();
  },

  highlightTool : function(id) {
    ToolBar.toolsDomObjects.removeClass(ToolBar.activeClass);
    $("#" + ToolBar.currentToolId).addClass(ToolBar.activeClass);
  },

  getCurrentToolBarAsDom : function() {
    return $('.' + ToolBar.activeClass);
  },

  getToolInstanceById : function(_id) {
    for (var i = 0; i < ToolBar.tools.length; i++) {
      var tool = ToolBar.tools[i];
      if(tool.id == _id) {
        return tool;
      }
    };
    return null;
  },

  // --------------------------------------
  // Canvas Actions
  mousedown : function(_options) {
    this.currentTool.mousedown(_options);
  },

  mousemove : function(_options) {
    this.currentTool.mousemove(_options);
  },

  mouseup : function() {
    this.currentTool.mouseup();
  },

};

// ----------------------------------------
// Tool Classes
// ----------------------------------------
var PencilTool = function() {
  this.id = "pencilToolButton";
  this.isActive = false;
  this.domObject = $('#' + this.id);
  this.isSelectable = true;
  this.oldX = null;
  this.oldY = null;
  this.currentSpriteAreaInstance = null;
};
//
PencilTool.prototype.clickEvent = function() {
  Paint.showCursorRect();
};
//
PencilTool.prototype.mousedown = function(_options) {
  this.isActive = true;
  this.currentSpriteAreaInstance = Paint.getCurrentSpriteAreaInstance();
  // Draw Line
  this.draw(_options.coordinates.x, _options.coordinates.y,_options.coordinates.x, _options.coordinates.y);
  //
  this.oldX = _options.coordinates.x;
  this.oldY = _options.coordinates.y;
};
//
PencilTool.prototype.mousemove = function(_options) {
  if(this.oldX == _options.coordinates.x && this.oldY == _options.coordinates.y) return false;
  if(!this.isActive) return false;

  this.draw(this.oldX, this.oldY ,_options.coordinates.x, _options.coordinates.y);

  this.oldX = _options.coordinates.x;
  this.oldY = _options.coordinates.y;
};
//
PencilTool.prototype.mouseup = function() {
  this.isActive = false;
};
//
PencilTool.prototype.draw = function(_x, _y, _endX, _endY) {
  Paint.pixelDrawer.popImageData();
  Paint.pixelDrawer.drawLine(_x, _y, _endX, _endY, ColorPalette.currentColor, Paint.lineWidth);
  Paint.pixelDrawer.pushImageData();
};


// ----------------------------------------
var DragableTool = function( _drawFunction,_id) {
  this.id = _id;
  this.drawFunction = _drawFunction;
  this.domObject = $('#' + this.id);
  this.isActive = false;
  this.isSelectable = true;
  this.startX = 0;
  this.startY = 0;
  this.endX = 0;
  this.endY = 0;
  //
  this.sourceCanvas  = null;
  this.sourceContext = null;
  this.drawCanvas    =  null;
  this.drawContext   = null;
};
//
DragableTool.prototype.clickEvent = function() {

};
//
DragableTool.prototype.mousedown = function(_options) {
  Paint.showSketchCanvas();
  this.isActive = true;
  this.startX = _options.coordinates.x;
  this.startY = _options.coordinates.y;

  this.sourceCanvas = Paint.canvasToDraw[0];
  this.sourceContext = this.sourceCanvas.getContext("2d");
  this.drawCanvas = Paint.getCurrentCanvasDom()[0];
  this.drawContext = this.drawCanvas.getContext("2d");
};
//
DragableTool.prototype.mousemove = function(_options) {
  if(!this.isActive) return false;
  this.endX = _options.coordinates.x;
  this.endY = _options.coordinates.y;
  
  this.drawContext.clearRect(0, 0, this.drawCanvas.width, this.drawCanvas.height);
    
  var imageData = this.sourceContext.getImageData(0, 0, this.sourceCanvas.width, this.sourceCanvas.height);
  this.drawContext.putImageData(imageData, 0, 0);

  Paint.pixelDrawer.popImageData();
  this.drawFunction(this.startX, this.startY, this.endX, this.endY, ColorPalette.currentColor, Paint.lineWidth);
  Paint.pixelDrawer.pushImageData();
};
//
DragableTool.prototype.mouseup = function() {
  this.isActive = false;
  Paint.hideSketchCanvas();
  //Paint.getCurrentSpriteAreaInstance().addLine(this.startX, this.startY, this.endX, this.endY);
  Paint.pixelDrawer.popImageData();
  this.drawFunction(this.startX, this.startY, this.endX, this.endY, ColorPalette.currentColor, Paint.lineWidth);
  Paint.pixelDrawer.pushImageData();
  
};


// ----------------------------------------
var EraserTool = function() {
  this.id = "eraserToolButton";
  this.domObject = $('#' + this.id);
  this.isActive = false;
  this.isSelectable = true;
  this.x = 0;
  this.y = 0;
};
//
EraserTool.prototype.clickEvent = function() {
  Paint.showCursorRect();
};
//
EraserTool.prototype.mousedown = function(_options) {
  this.isActive = true;
  Paint.getCurrentSpriteAreaInstance().eraseArea(_options.coordinates.x, _options.coordinates.y);
};
//
EraserTool.prototype.mousemove = function(_options) {
  if(!this.isActive) return false;
  Paint.getCurrentSpriteAreaInstance().eraseArea(_options.coordinates.x, _options.coordinates.y);
};
//
EraserTool.prototype.mouseup = function() {
  this.isActive = false;
};

// ----------------------------------------
var SelectTool = function() {
  this.id = "selectToolButton";
  this.domObject = $('#' + this.id);
  this.isActive = false;
  this.isSelectable = true;
};
//
SelectTool.prototype.clickEvent = function() {
};
//
SelectTool.prototype.mousedown = function(_options) {
};
//
SelectTool.prototype.mousemove = function(_options) {
};
//
SelectTool.prototype.mouseup = function() {
};


// ----------------------------------------
var FlipTool = function() {
  this.id = "flipvButton";
  this.domObject = $('#' + this.id);
  this.isActive = false;
  this.isSelectable = false;
};
//
FlipTool.prototype.clickEvent = function() {
  Paint.getCurrentSpriteAreaInstance().flip();
};
//
FlipTool.prototype.mousedown = function(_options) {
};
//
FlipTool.prototype.mousemove = function(_options) {
};
//
FlipTool.prototype.mouseup = function() {
};


// ----------------------------------------
var UndoTool = function() {
  this.id = "undoButton";
  this.domObject = $('#' + this.id);
  this.isActive = false;
  this.isSelectable = false;
};
//
UndoTool.prototype.clickEvent = function() {
  Paint.getCurrentSpriteAreaInstance().undo();
};
//
UndoTool.prototype.mousedown = function(_options) {
};
//
UndoTool.prototype.mousemove = function(_options) {
};
//
UndoTool.prototype.mouseup = function() {
};


// ----------------------------------------
var SaveTool = function() {
  this.id = "saveButton";
  this.domObject = $('#' + this.id);
  this.isActive = false;
  this.isSelectable = false;
};
//
SaveTool.prototype.clickEvent = function() {
  Paint.saveImage();
};
//
SaveTool.prototype.mousedown = function(_options) {
};
//
SaveTool.prototype.mousemove = function(_options) {
};
//
SaveTool.prototype.mouseup = function() {
};
