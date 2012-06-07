var ToolView = Ember.View.extend({
    
  tool : null,
  
  didInsertElement : function() {
    $('.pencil').addClass("activeTool");

    // Highlight active tool
    $(".selectable").click(function() {
      $(".selectable").removeClass("activeTool");
      $(this).addClass("activeTool");
    });

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

  fill : function() {
    App.fillTool.click();
    this.setCurrentTool();
  },

  addSprite : function() {
    App.paintController.add();
  },

  copySprite : function() {
    App.paintController.add(true);
  },

  reset : function() {
    App.paintController.reset(true);
    App.paintController.add();
  },

  undo : function() {
    App.paintController.undo();
  },

  clear : function() {
    App.paintController.clearCurrentSprite();
  },

  pencil : function() {
    this.setCurrentTool();
    App.pencilTool.setEraser(false);
    App.paintController.click();
  },

  pipette : function() {
    this.setCurrentTool();
    App.paintController.click();
  },

  erase : function() {
    this.setCurrentTool();
    App.pencilTool.setEraser(true);
  },

  zoomIn : function() {
    App.paintController.zoomIn();
  },

  zoomOut : function() {
    App.paintController.zoomOut();
  },

  bgToggle : function() {
    App.paintController.toogleZoomCanvasBg();
  },

  save : function() {
    App.paintController.save();
  },

  play : function() {
    App.spritePlayer.play();
  },

  stop : function() {
    App.spritePlayer.stop();
  }

});