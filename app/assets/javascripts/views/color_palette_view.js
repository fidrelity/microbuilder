var ColorPaletteView = Ember.View.extend({
  
  //templateName: 'templates_sprite_template',
  color : null,
  
  didInsertElement : function() {
    
    $('.colorBlock').click(function() {
      var color = $(this).attr('data-color');
      console.log("setColor", color);
      App.paintController.setColor(color);
    });
  }

 
});