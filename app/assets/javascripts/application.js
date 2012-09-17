// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascridpts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery
//= require jquery_ujs
//= require jquery-ui
//= require ember
//= require_tree ./editor/templates
//= require_tree ./paint/templates
//= require_tree .

$(document).ready(function() {

  // Init Autocomplete for games
  $( ".searchbox" ).autocomplete({

      source: "/games/auto_search",

      minLength: 2

  });

  //
  
  Feedback.init();
  //
  Notifier.init().notify();
  //
  FramePlayer.init();

  // ---------------------------------------
  // Init slides in guide pages
  if($('#guide-slide-container').length) {

    var slider = new SliderDiv({ containerSelector : '#guide-slide-container'});
    slider.autoPlay(5000);
    
    var elements = $('#guideSteps').find('li');
    elements.first().addClass('activeElement');

    elements.click(function() {

      var pos = $(this).index();
      slider.moveTo(pos).stopPlay();

    });

    slider.afterMove = function() {

      var index = this.currentSlideIndex;
      elements.removeClass('activeElement');
      elements.eq(index).addClass('activeElement');

    };
  }
  // ---------------------------------------
  // Game View Buttons 
  function toggleLayer(_layer, _buttonObj) {
    highlightTab( _buttonObj );
    
    $('.layer').hide();
    
    if ( _layer ) {
      _layer.show();
    }
  }

  function highlightTab(_obj) {
    $(".tabButton").removeClass('active');
    $("#shareButtons .btn").removeClass('active');
    
    if ( _obj ) {
      _obj.addClass('active');
    }
  }

  /* Share Button */
  $('.shareButton').click(function() {
    toggleLayer($('#shareLayer'), $(this));
  });

  /* Embed Button */
  $('.embedButton').click(function() {
    toggleLayer($('#embedLayer'), $(this));   
  });

  /* Report Button */
  $('.reportButton').click(function() {
    toggleLayer($('#reportLayer'), $(this));
  });

  // Close layers
  $('.closeLayer').click(function() {
    toggleLayer();
  });


  // ------ Profile -------

  // Profile edit form toggle
  var toggleProfileEdit = function(_linkObj) {

    var profileWrapper = $("#profilewrap");

    var formEle = profileWrapper.find("#display_name_form");
    formEle.slideToggle().toggleClass("editMode");    

    profileWrapper.find("#display_name").slideToggle();

    if( formEle.hasClass("editMode") ) {

      var inputEle = profileWrapper.find("#user_display_name");

      // Set focus and force cursor to be set to the end of the input
      var tempVal = inputEle.val();
      inputEle.focus().val("").val( tempVal );
      
      _linkObj.html("Cancel");

    } else {

      _linkObj.html("Edit");

    }
  };

  // 
  $("#profilewrap").find(".edit").live("click", function(e) {
    toggleProfileEdit( $(this) );    
  });  
  
  var current_tab = getURLParameter('current');
  if (current_tab == 'null') current_tab = 'games';
  var current_layer = $('#' + current_tab + 'Layer');
  var current_button = $('.' + current_tab + 'Button');

  toggleLayer(current_layer, current_button);
  
  // Tabs
  $('.gamesButton').click(function() {
    toggleLayer($('#gamesLayer'), $(this));
  });  

  $('.graphicsButton').click(function() {
    toggleLayer($('#graphicsLayer'), $(this));     
  });  

  $('.backgroundsButton').click(function() {
    toggleLayer($('#backgroundsLayer'), $(this));     
  }); 

  // Stream resize
  var messageWrapper = $("#messages");
  
  messageWrapper.resizable({ 
    alsoResize: ".activity-list", 
    maxWidth: messageWrapper.width()
  });
 
  $('.stream-popup').popover({ placement: 'right' });
  // ---------------------------------------

  // param injection for ordering games list 
  $('.btn-group.game-select a').click(function(e) {
    e.target.href += "?order=" + $('.btn-group.order .active')[0]['value'];
  });
  
  highlight_current_order();
});


function highlight_current_order() {
  $('.btn-group .order button').removeClass('active');
  var current_order = getURLParameter('order');
  if (current_order == "null") current_order = 'desc';
  $('.btn-group.order button[value=' + current_order + ']').addClass('active');
}