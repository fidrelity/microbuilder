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
      $('#flipvButton').live("click", $.proxy(Paint.flipV, Paint));
      $('#undoButton').live("click", $.proxy(Paint.undo, Paint));  
      $('#outlineButton').click(function(){Paint.getCurrentSpriteAreaInstance().outlinePoints();});
      $('#selectToolButton').click(function(){Paint.deactivateTools();Paint.selectTool = true;});
    */
    ToolBar.toolsDomObjects.live('click', $.proxy(ToolBar.clickTool, this));
    ToolBar.tools.push(new PencilTool());
    ToolBar.tools.push(new LineTool());
    ToolBar.tools.push(new EraserTool());    
    ToolBar.setCurrentTool("pencilToolButton");
  },

  clickTool : function(e) {
    ToolBar.setCurrentTool(e.currentTarget.id);
    ToolBar.currentTool.clickEvent();
  },

  setCurrentTool : function(_id) {
    ToolBar.currentToolId = _id;
    ToolBar.currentTool = ToolBar.getToolInstanceById(_id);
    console.log('currentTOol', ToolBar.currentTool, _id);
    ToolBar.highlightTool(_id);
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
// Tool CLASSes
// ----------------------------------------
var PencilTool = function() {
  this.id = "pencilToolButton";
  this.isActive = false;
  this.domObject = $('#' + this.id);
};
//
PencilTool.prototype.clickEvent = function() {
};
//
PencilTool.prototype.mousedown = function(_options) {
  this.isActive = true;
  Paint.getCurrentSpriteAreaInstance().addClick(_options.coordinates.x, _options.coordinates.y, false);
};
//
PencilTool.prototype.mousemove = function(_options) {
  if(!this.isActive) return false;
  Paint.getCurrentSpriteAreaInstance().addClick(_options.coordinates.x, _options.coordinates.y, true);
};
//
PencilTool.prototype.mouseup = function() {
  this.isActive = false;
};

// ----------------------------------------
var LineTool = function() {
  this.id = "lineToolButton";
  this.domObject = $('#' + this.id);
  this.isActive = true;
  this.startX = 0;
  this.startY = 0;
  this.endX = 0;
  this.endY = 0;
};
//
LineTool.prototype.clickEvent = function() {
};
//
LineTool.prototype.mousedown = function(_options) {
  this.isActive = true;
  this.startX = _options.coordinates.x;
  this.startY = _options.coordinates.y;
};
//
LineTool.prototype.mousemove = function(_options) {
  if(!this.isActive) return false;
  this.endX = _options.coordinates.x;
  this.endY = _options.coordinates.y;

  Paint.pixelDrawer.context.clearRect(0, 0, Paint.pixelDrawer.canvas.width, Paint.pixelDrawer.canvas.height);
  Paint.pixelDrawer.popImageData();
  Paint.pixelDrawer.drawLine(this.startX, this.startY, this.endX, this.endY, ColorPalette.currentColor);
  Paint.pixelDrawer.pushImageData();
};
//
LineTool.prototype.mouseup = function() {
  this.isActive = false;
  Paint.getCurrentSpriteAreaInstance().addLine(this.startX, this.startY, this.endX, this.endY);
};

// ----------------------------------------
var EraserTool = function() {
  this.id = "eraserToolButton";
  this.domObject = $('#' + this.id);
  this.isActive = true;
  this.x = 0;
  this.y = 0;
};
//
EraserTool.prototype.clickEvent = function() {
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