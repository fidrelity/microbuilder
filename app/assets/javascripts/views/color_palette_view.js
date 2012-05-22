var ColorPaletteView = Ember.View.extend({
  
  //templateName: 'templates_sprite_template',
  color : null,
  
  didInsertElement : function() {
    $('#colorChooser').css("background-color", App.paintController.color);
    $('#colorChooser').click(function() {
      var palette = $("#palette");
      if(palette.is(':visible')) {
        $("#palette").hide();
      }
      else {
        var newLeft = $(this).position().left;
        var newTop = parseInt($(this).position().top) + parseInt($(this).height());
        $("#palette").css({'left' : newLeft, 'top' : newTop}).show();
      }
    });

    $('.colorBlock').click(function() {
      var color = $(this).attr('data-color');
      App.paintController.setColor(color);

      $('.colorBlock').removeClass('activeColor');
      $(this).addClass('activeColor');
      $('#colorChooser').css("background-color", color);
      $("#palette").hide();
    });
  } 
});