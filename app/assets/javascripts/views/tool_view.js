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
    var pixelDrawer = new PixelDrawer();
    App.drawTool.drawFunction = pixelDrawer.drawRect;
    App.drawTool.click();
    this.setCurrentTool();
  },

  addSprite : function() {
    App.paintController.add();
  },
  
});