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
    
    // Panel Management in #nav
    $('#nav > li').each(function() {
        $(this).click(function(e) {
            showPanel($(this).data('page'));
            e.preventDefault();
        })
    })
    
    // Editor Tabs 
    $('#tabs').tabs();
    
    // Set panels to height wof browser window
    $(window).resize(function(){
        	setPanelSize();
    });
    setPanelSize();

    if ( $('#playercanvas').length ) {
      
      initPlayer();
    
    }
    
});

function setPanelSize(){
    var windowHeight = $(window).height();
    var windowWidth = $(window).width();
    $('section').css({'height':windowHeight+'px'});
    //reset scrollspy
    //$('body').scrollSpy('refresh');
}

function showPanel(panel){
    $('section').each(function() {
        $(this).css({top: '-1000px'});
    })
    $('section:eq('+panel+')').css({top: '0px', position: 'absolute'});
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