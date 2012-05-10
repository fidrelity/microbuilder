var ColorPaletteView = Ember.View.extend({
  
  //templateName: 'templates_sprite_template',
  color : null,
  
  didInsertElement : function() {
    $('.colorBlock').click(function() {
      var color = $(this).attr('data-color');
      App.paintController.setColor(color);

      $('.colorBlock').removeClass('activeColor');
      $(this).addClass('activeColor');
    });
  } 
});