var PaintView = Ember.View.extend({
  
  templateName: 'templates/paint_template',
  
  didInsertElement : function() {
    
    paint_main();
    
  }
  
});