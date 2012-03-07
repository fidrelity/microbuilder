var PaintView = Ember.View.extend({
  
  templateName: 'templates_paint_template',
  
  didInsertElement : function() {
    
    paint_main();
    
  }
  
});