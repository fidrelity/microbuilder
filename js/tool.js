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
    ToolBar.toolsDomObjects.live('click', $.proxy(ToolBar.clickTool, this));

    ToolBar.tools.push(new PencilTool());
    ToolBar.tools.push(new LineTool());
    ToolBar.setCurrentTool("pencilToolButton");

    /*
    $("#pencilToolBarButton").click(function(){Paint.activatePaintToolBar();});
    $("#lineToolBarButton").click(function(){Paint.activateLineToolBar();});
    $('#eraserToolBarButton').click(function(){Paint.activateEraserToolBar();});
    $('#flipvButton').click(function(){ Paint.flipV()});
    $('#undoButton').click(function(){ Paint.undo()});
    $('#switchViewButton').click(function(){Paint.switchView();});
    $('#addCanvasButton').click(function(){Paint.addCanvas();});
    $('#copyCanvasButton').click(function(){Paint.addCanvas(true);});
    $('#clearCanvasButton').click(function(){Paint.clearCanvas(true);});
    $('#removeCanvasButton').click(function(){Paint.removeCanvas();});    
    $('#outlineButton').click(function(){Paint.getCurrentSpriteAreaInstance().outlinePoints();});
    $('#selectToolBarButton').click(function(){Paint.deactivateToolBars();Paint.selectToolBar = true;});
    */
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
  this.isActive = true;
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
};
//
LineTool.prototype.clickEvent = function() {
  Paint.addCanvas();
};
//
LineTool.prototype.mousedown = function(_options) {
  this.isActive = true;
  Paint.getCurrentSpriteAreaInstance().addClick(_options.coordinates.x, _options.coordinates.y, false);
};
//
LineTool.prototype.mousemove = function(_options) {
  if(!this.isActive) return false;
  Paint.getCurrentSpriteAreaInstance().addClick(_options.coordinates.x, _options.coordinates.y, true);
};
//
LineTool.prototype.mouseup = function() {
  this.isActive = false;
};