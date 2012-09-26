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
  function toggleLayer(_layer, _buttonObj, _evt) {
    highlightTab( _buttonObj, _evt || null );
        
    $('.layer').hide();

    if ( _layer) {

      _layer.show();        

    } 

  }

  function highlightTab(_obj, _evt) {
    $(".tabButton").removeClass('active');
    $("#shareButtons .btn").removeClass('active');
    
    if ( _obj ) {
      _obj.addClass('active');

      if ( _obj.length && _evt)
        $.scrollTo( _obj, { axies : 'y', duration : 700, offset : -20 } );
    }    
  }

  /* Share Button */
  $('.shareButton').click(function(e) {    
    toggleLayer($('#shareLayer'), $(this), e);
  });

  /* Embed Button */
  $('.embedButton').click(function(e) {
    toggleLayer($('#embedLayer'), $(this), e);   
  });

  /* Report Button */
  $('.reportButton').click(function(e) {
    toggleLayer($('#reportLayer'), $(this), e);
  });

  // Close layers
  $('.closeLayer').click(function(e) {
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
  $('.gamesButton').click(function(e) {
    toggleLayer($('#gamesLayer'), $(this), e);
  });  

  $('.graphicsButton').click(function(e) {
    toggleLayer($('#graphicsLayer'), $(this), e);     
  });  

  $('.backgroundsButton').click(function(e) {
    toggleLayer($('#backgroundsLayer'), $(this), e);     
  }); 


  // ---------------------------------------
  // Custom scroll bars
  // http://jscrollpane.kelvinluck.com/#download
  var pane = $('.scroll-pane')
  pane.jScrollPane({ showArrows: true });
  var jspane_api = pane.data('jsp');
    
  // ---------------------------------------
  // Stream resize
  var messageWrapper = $("#messages");
  
  messageWrapper.resizable({ 
    alsoResize: ".activity-list", 
    maxWidth: messageWrapper.width(),
    minWidth: messageWrapper.width(),
    stop : function() {
      jspane_api.reinitialise();
    }
  });

  $('.stream-popup').popover({ placement: 'right', trigger: 'hover' });
 
  // ---------------------------------------

  // param injection for ordering games list 
  $('.game-select .btn-group a').click(function(e) {
    e.target.href += "?order=" + $('.btn-group.order .active')[0]['value'];
  });
  
  highlight_current_order();
  
  $('.btn-group.order button').click(function(e) {
    var url = window.location.href.split('?')[0];
    window.location.href = url + "?order=" + e.target.value;
  });
  
});


function highlight_current_order() {
  $('.btn-group .order button').removeClass('active');
  var current_order = getURLParameter('order');
  if (current_order == "null") current_order = 'desc';
  $('.btn-group.order button[value=' + current_order + ']').addClass('active');
}