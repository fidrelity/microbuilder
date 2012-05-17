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
//= require_tree ./templates
//= require_tree .

var Feedback = {

  wrapper : null,
  textarea : null,

  init : function() {
    Feedback.wrapper = $("#feedback");
    $('.showFeedback').click(function() { Feedback.show(); });
    $('.closeFeedback').click(function() { Feedback.close(); });
    $('.sendFeedback').click(function() { Feedback.send(); });
    Feedback.textarea = Feedback.wrapper.find("#feedbackBody");
  },

  show : function() {
    if(Feedback.wrapper.is(":visible")) {
      Feedback.close();
    } else {
      var newX = ($(document).width() / 2) - (Feedback.wrapper.width() / 2);
      var newY = 200;
      Feedback.wrapper.css({left: newX, top: newY}).fadeIn(800);
      Feedback.textarea.focus();
    }
  },

  close : function(_time) {
    var _time = _time || 0;
    Feedback.textarea.val("");
    Feedback.wrapper.hide(_time);
    Feedback.textarea.removeClass("errorForm");
  },

  send : function() {
    var text = Feedback.textarea.val();
    if(!text) {
      Feedback.textarea.addClass("errorForm");
      return false;
    }
    /*
      $.ajax({
        url : '/feedback'
        type: 'post',
        data : { comment : text },
        success : function( data ) {   
          $("#feedbackSideButton").fadeOut(800).html("T<br>h<br>a<br>n<br>k<br>s").addClass("alert").addClass("alert-success").fadeIn(400);      
        }
      });
    */    
    Feedback.close(500);
  }
};


var deactivateLikeButtons = function() {
  $('.likeButton').addClass("disabled").attr("disabled", "disabled");
};

var do_like = function(_isDislike, _id) {
  if(!_id) return false;
  var path = _isDislike ? 'dislike' : 'like';

  $.ajax({
    url : '/games/' + _id + '/' + path,
    type : 'PUT',
    success : function() {        
      var newVal = parseInt($('.' + path + 'Value').html()) + 1;
      $('.' + path + 'Value').html(newVal);
      deactivateLikeButtons();
    }
  });
};

$(document).ready(function() {

  $('.likeButton').click(function() {
    if($(this).hasClass('disabled')) return false;
    do_like($(this).hasClass("dislikeButton"), $(this).attr("data-id"));
  });

  $( ".searchbox" ).autocomplete({
      source: "/games/auto_search",
      minLength: 2
  });

  Feedback.init();

});

function application_main() {
    /*
    // Dirty hack for ipad scroll-disabling
    $(document).bind('touchmove', false);
    
    height = $(window).height();
    width = $(window).width();
    
    spaceCheck(false);
    
    centerContent(height);
    
    placeNav(height, width);
    placeSections(height, width);
    
    $(window).resize(function() {
        spaceCheck(true);
    });
    
    //$('section#home').css({top: '0px', left: '0px'});
    
    $('li#nav_right').click(function() {
        if($('.popout').length) {
          $('.popout').animate({'right': '0px'}, 250);
          console.log('found');
        }
        else {
          minimizeSection();
          $('#pages .profile').attr('active', 1).css({display:'block'}).stop().animate({left: '0px'}, 500, function() {

          });
        }
    });
    
    $('li#nav_left').click(function() {
        minimizeSection();
        $('#pages .gallery').attr('active', 1).css({display:'block'}).stop().animate({left: '0px'}, 500, function() {

        });
    });
    
    $('li#nav_bottom').click(function() {
        minimizeSection();
        $('#pages .editor').attr('active', 1).css({display:'block'}).stop().animate({top: '0px'}, 500, function() {

        });
    });
    
    $('li#nav_top').click(function() {
        /* minimizeSection();
        $('#pages .about').stop().animate({top: '0px'}, 250, function() {
            $(this).attr('active', 1)
        }); 
        minimizeSection();
    });
    */
};
/*
function placeNav(height, width) {
    $('#nav_top').css({left: width/2-90});
    $('#nav_bottom').css({left: width/2-90});
    $('#nav_left').css({top: height/2-60});
    $('#nav_right').css({top: height/2-60});
    $('.popout').css({top: height/2-100});
}

function placeSections(height, width) {
    if($('#pages .profile').attr('active') != 1) $('#pages .profile').css({left: width, top: '0px'});
    if($('#pages .editor').attr('active') != 1) $('#pages .editor').css({top: height, left: '0px'});
    if($('#pages .gallery').attr('active') != 1) $('#pages .gallery').css({left: -width, top: '0px'});
    if($('#pages .about').attr('active') != 1) $('#pages .about').css({top: -height, left: '0px'});
    $('#pages > div').css({width: width, height: height});
}

function centerContent(height) {
    $('.centered_content').each(function() {
        contentHeight = $(this).height();
        newHeight = height/2-contentHeight/2;
        $(this).css({top: newHeight});
    });
}

function spaceCheck(timer){
    height = $(window).height();
    width = $(window).width();
    console.log('check');
    placeNav(height, width);
    placeSections(height, width);
    centerContent(height);
    if(!timer) setTimeout("spaceCheck(false)", 3000);
}

function minimizeSection(section) {
    $('#pages > div').each(function() {
        if($(this).attr('active') == 1) {
            $(this).animate({height: '0px', width: '0px', top: '50%', left: '50%'}, 250, function() {
                $(this).attr('active', 0);
                $(this).css({width: width, height: height});
                placeSections(height, width);
            });
        }
        $(this).css({display:'none'});
    });
    //$('#'+section).animate({opacity: 0}, 500);
    //$('#'+section).animate({height: '0px', width: '0px', top: '50%', left: '50%'});
    //$('#'+section).css({height: '0px', width: '0px', top: '50%', left: '50%'});
}

// iPad / iPhone specific
function orientationChanged() {
    placeSections(height, width);
}

function isiPad(){
    return (navigator.platform.indexOf("iPad") != -1);
}
*/