// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
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
//= require_tree .

$(document).ready(function() {
        
    // Flash Messages
    $('.flash_message').each(function() {
        $(this).fadeOut(5000);
    })
    
    // Dirty hack for ipad scroll-disabling
    //$(document).bind('touchmove', false);
    
    spaceCheck(false);
    
    // Center Content vertically in Sections
    centerContent(height);
    
    placeNav(height, width);
    placeSections(height, width);
    
    $(window).resize(function() {
        spaceCheck(true);
    });

    //$('section#home').css({top: '0px', left: '0px'});
    
    $('li#nav_right').click(function() {
        minimizeSection();
        $('#pages .profile').stop().animate({left: '0px'}, 250, function() {
            $(this).attr('active', 1)
        });
    });
    
    $('li#nav_left').click(function() {
        minimizeSection();
        $('#pages .editor').stop().animate({left: '0px'}, 250, function() {
            $(this).attr('active', 1)
        });
    });
    
    $('li#nav_bottom').click(function() {
        minimizeSection();
        $('#pages .gallery').stop().animate({top: '0px'}, 250, function() {
            $(this).attr('active', 1)
        });
    });
    
    $('li#nav_top').click(function() {
        minimizeSection();
        $('#pages .about').stop().animate({top: '0px'}, 250, function() {
            $(this).attr('active', 1)
        });
    });
    
    // Editor Tabs 
    $('#tabs').tabs();

    if ( $('#playercanvas').length ) {
      
      initPlayer();
    
    }
    
});

function spaceCheck(timer){
    height = $(window).height();
    width = $(window).width();
    
    placeNav(height, width);
    placeSections(height, width);
    centerContent(height);
    if(!timer) setTimeout("spaceCheck()", 3000);
}

function placeNav(height, width) {
    $('#nav_top').css({left: width/2-15});
    $('#nav_bottom').css({left: width/2-15});
    $('#nav_left').css({top: height/2-5});
    $('#nav_right').css({top: height/2-5});
}

function placeSections(height, width) {
    if($('#pages .profile').attr('active') != 1) $('#pages .profile').css({left: width+1, top: '0px'});
    if($('#pages .editor').attr('active') != 1) $('#pages .editor').css({left: -width-1, top: '0px'});
    if($('#pages .gallery').attr('active') != 1) $('#pages .gallery').css({top: height+1, left: '0px'});
    if($('#pages .about').attr('active') != 1) $('#pages .about').css({top: -height-1, left: '0px'});
    $('#pages > div').css({width: width, height: height});
}

function centerContent(height) {
    $('.centered_content').each(function() {
        contentHeight = $(this).height();
        newHeight = height/2-contentHeight/2;
        $(this).css({top: newHeight});
    });
}

function minimizeSection(section) {
    $('#pages > div').each(function() {
        if($(this).attr('active') == 1) {
            $(this).stop().animate({height: '0px', width: '0px', top: '50%', left: '50%'}, 250, function() {
                $(this).attr('active', 0);
                $(this).css({width: width, height: height});
                placeSections(height, width);
            });
        }
    });
    //$('#'+section).animate({opacity: 0}, 500);
    //$('#'+section).animate({height: '0px', width: '0px', top: '50%', left: '50%'});
    //$('#'+section).css({height: '0px', width: '0px', top: '50%', left: '50%'});
}

function initPlayer( canvas ) {
  
  var player,
      stats,
      data = {
        
        background : '/assets/paper.jpeg',
        
        gameObjects : [
          { x : 320, y : 195, oX : 150,  oY : 0,    image : '/assets/logo.png' },
          { x : 320, y : 195, oX : -150, oY : 0,    image : '/assets/logo.png' },
          { x : 320, y : 195, oX : 0,    oY : 150,  image : '/assets/logo.png' },
          { x : 320, y : 195, oX : 0,    oY : -150, image : '/assets/logo.png' },
          
          { x : 320, y : 195, oX : 100,  oY : 100,  image : '/assets/logo.png' },
          { x : 320, y : 195, oX : 100,  oY : -100, image : '/assets/logo.png' },
          { x : 320, y : 195, oX : -100, oY : -100, image : '/assets/logo.png' },
          { x : 320, y : 195, oX : -100, oY : 100,  image : '/assets/logo.png' }
        ]
  };
  
  player = new Player( $('#playercanvas')[0] );
  player.parse( data );
  
  stats = new Stats();
  stats.hide();
  
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  
  document.body.appendChild( stats.domElement );
  
  player.stats = stats;
  
  $('#playercanvas').click( function() {
    
    player.start();
    
  });
  
}