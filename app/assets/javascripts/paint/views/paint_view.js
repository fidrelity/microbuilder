var PaintView = Ember.View.extend({
  
  templateName: 'paint/templates/paint_template',
  canvas: null,
  
  didInsertElement : function() {

    App.paintController.initView();

    App.toolBoxController.setCurrentTool(App.pencilTool);
    App.drawTool.initAfter();
    App.fillTool.initAfter();
    App.selectTool.initAfter();

  },

  showTypeSelection : function() {

    $("#paint-wrapper").hide();
    $("#paint-size-wrapper").show();
    
  }

});