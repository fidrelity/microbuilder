var ToolView = Ember.View.extend({
    
  tool : null,
  
  didInsertElement : function() { 
  },

  setCurrentTool : function() {
    App.toolBoxController.setCurrentTool(this.get("tool"));
  },

  addSprite : function() {
    App.paintController.add();
  },
  
});