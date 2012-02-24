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
    
    // Editor Tabs 
    $('#tabs').tabs();

    /*// Overlay
    $('.overlay_button').click(function(e) {
        
        var overlay = $(this).data('overlay');
        
        $('#'+overlay).lightbox_me({
            centered: true, 
            onLoad: function() { 
                //$('#sign_up').find('input:first').focus()
            }
        });
        e.preventDefault();
    }); */
    
    if ( $('#playercanvas').length ) {
      
      initPlayer();
    
    }
    
});

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