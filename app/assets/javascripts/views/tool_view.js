var ToolView = Ember.View.extend({
    
  tool : null,
  
  didInsertElement : function() {
    App.toolBoxController.setCurrentTool(App.pencilTool);
    App.drawTool.initAfter();
  },

  setCurrentTool : function() {
    App.toolBoxController.setCurrentTool(this.get("tool"));
  },

  drawRect : function() {    
    App.drawTool.setDrawFunction("rect");
    App.drawTool.click();
    this.setCurrentTool();
  },

  drawRectFill : function() {    
    App.drawTool.setDrawFunction("fillrect");
    App.drawTool.click();
    this.setCurrentTool();
  },

  drawCircle : function() {    
    App.drawTool.setDrawFunction("circle");
    App.drawTool.click();
    this.setCurrentTool();
  },

  drawCircleFill : function() {    
    App.drawTool.setDrawFunction("fillcircle");
    App.drawTool.click();
    this.setCurrentTool();
  },

  drawLine : function() {    
    App.drawTool.setDrawFunction("line");
    App.drawTool.click();
    this.setCurrentTool();
  },

  addSprite : function() {
    App.paintController.add();
  },
  
});