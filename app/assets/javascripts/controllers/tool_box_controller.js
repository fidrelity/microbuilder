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

  setCurrentTool : function(tool) {
    this.set('currentTool', tool);
  },

  getCurrentTool : function() {
    return this.get('currentTool');
  },

});