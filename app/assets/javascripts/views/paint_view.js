var PaintView = Ember.View.extend({
  
  templateName: 'templates/paint_template',
  canvas: null,
  
  didInsertElement : function() {  
    //paint_main();
    //App.paintController.initView();
  },

  showTypeSelection : function() {
    $("#paint-wrapper").hide();
    $("#paint-size-wrapper").show();
  }

});