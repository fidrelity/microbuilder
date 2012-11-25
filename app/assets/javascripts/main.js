function editor_main( data, username ) {

  window.App = Ember.Application.create();

  App.username = username;

  App.game = GameModel.create();
  App.gameController = GameController.create();

  App.libraryController = LibraryController.create();

  App.gameObjectsController = GameObjectsController.create();
  App.behaviourController = BehaviourController.create();
  
  App.set( 'actionController', ActionController.create() );
  App.actionController.start();

  App.mainView = MainView.create();
  App.mainView.appendTo('#editor');
  
  if ( !data ) {
    
    data = JSON.parse( Storage.read( 'game' ) );
    
  }
  
  if ( !username ) {
    
    Notifier.add( 'Your are not signed in. You can\'t publish your game.', 'error' ).notify();
    
  }
  
  if ( data ) {
    
    Ember.run.end();
    
    console.log( data );
    
    if ( App.gameController.loadGame( data ) ) {
      
      Notifier.add( 'An unfinished game was found in your browser', 'info' ).notify();
      
    }
    
  } else {
    
    Notifier.add( 'Your game will be stored in the browser until you publish it.', 'info' ).notify();
    
  }
  
  App.updateHelp = function() {
    
    if ( App.showhelp ) {
      
      $('.ttip').tooltip();
      $('.pop').popover({ trigger: 'hover'});
      
      Storage.write( 'showhelp', 'yes' );
      
    } else {
      
      $('.ttip').tooltip( 'destroy' );
      $('.pop').popover( 'destroy' );
      
      Storage.write( 'showhelp', 'no' );
      
    }
    
  };
  
  App.hideHelp = function() {
    
    if ( App.get( 'showhelp' ) ) {
    
      $('.ttip').tooltip( 'hide' );
      $('.pop').popover( 'hide' );
    
    }
    
  };
  
  App.addObserver( 'showhelp', function() {
    
    App.updateHelp();
    
  });
  
  $('.helpButton').popover({trigger: "hover"});
  
  var showhelp = Storage.read( 'showhelp' );
  
  showhelp = !(showhelp && showhelp === 'no');
  
  App.set( 'showhelp', showhelp );
  
  $('#player').addTouch();
  $('.topbar').addTouch();
  $('.bar').addTouch();
  
};

function paint_main( data ) {
  
  window.App = Ember.Application.create();
  
  App.paintController = PaintController.create();

  App.paintView = PaintView.create();
  App.paintSizeView = PaintSizeView.create();
 
  App.pencilTool = PencilToolModel.create();
  App.eraserTool = EraserToolModel.create();
  App.drawTool = DrawToolModel.create();
  App.selectTool = SelectToolModel.create();
  App.fillTool = FillToolModel.create();
  App.pipetteTool = PipetteToolModel.create();
  
  App.spritePlayer = SpritePlayerController.create();
  
  App.pixelDrawer = new PixelDrawer();
  
  if ( !data ) {
  
    data = JSON.parse( Storage.read( 'graphic' ) );
  
  }
  
  if ( data ) {
    
    // Ember.run.end();
    
    console.log( data );
    
    if ( App.paintController.loadGraphic( data ) ) {
      
      Notifier.add( 'An unfinished graphic was found in your browser.', 'info' ).notify();
      return;
      
    }
    
  }
  
  App.paintController.initSize();
  
  // App.paintController.initType( true, 640, 390 );
  // App.paintController.initType( false, 128, 128 );
  
  // App.paintView.appendTo( '#content' );
  
};

function player_main( data, game_id ) {
  
  game_id = game_id || 0;
  
  function increaseCounter( _isWin ) {
    
    $.ajax({
      url : '/games/' + game_id + '/played',
      data : { win : _isWin },
      type : 'PUT',
      success : function() {}
    });
    
  };
  
  window.player = new Player();  
  
  console.log( JSON.stringify( data ) );
  
  if ( $( '#player' ) ) {
  
    player.init( $( '#player' ) );
    player.startRunloop();
    
    // player.debug();
  
    if ( data ) {
  
      player.parse( data );
  
    }
    
    if ( game_id ) {
      
      player.onWin = function() { increaseCounter( true ); };
      player.onLose = function() { increaseCounter( false ); };
      
      // player.onRestart = function() { player.parse( data ); return false; };
      
    }
    
  }
  
};

function getURLParameter(name) {
  return decodeURI(
    (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
  );
}


// Realtime events with pusher.com
function pusher_main() {

  /* Pusher Events*/
  var pusher = new Pusher('a4bc39aab42024a54d27');

  // -----------------------------------------------
  // New Game *DEPRECATED ELEMENTS*
  var channel = pusher.subscribe('game_channel');

  channel.bind('newgame', function(data) {

    var gameObj = $('#gamesList').find("li").first().clone().removeAttr("id").hide();
    var content = gameObj.find('.thumbnail');
    
    content.prepend('<a href="/users/'+data.author_id+'">by '+data.author+'</a>');
    content.prepend('<h4>'+data.name+' <span class="badge badge-important">New</span></h4>');
    content.prepend('<a href="/play/'+data.game_id+'"><img src="/assets/game.png" alt="Game"></a>');

    $(".thumbnails").prepend(gameObj);
    gameObj.fadeIn(1000);
    $(".thumbnails").find('.span2').last().remove()

  });


  // Stream
  var channel = pusher.subscribe('game_public_stream');

  channel.bind('new_activity', function(data) {

    var streamList = $(".activity-list");
    var streamEle = streamList.find("li").first().clone;

    var user_image = data.user_image;
    var user_id    = data.user_id;
    var user_name  = data.user_image;
    
    var verb = data.verb; // liked, created, commented ...

    var game_author_name = data.game_author_name;
    var game_author_id = data.game_author_id;
    var game_id = data.game_id;

    // ----
      
      var avatar = streamEle.find(".avatar_stream");
      avatar.find("a").attr("href", "/users/" + user_id); //Todo: if anonymous
      avatar.find(".stream-image").attr("src", user_image);

      // <div class="avatar_stream">
      // <a href="/users/1">
      // <img class="stream-image" src="http://www.gravatar.com/avatar/921acfa60558d9f7051d64e8d7940f85?s=180" alt="921acfa60558d9f7051d64e8d7940f85?s=180">
      // </a>
      // </div>
      // <a href="/users/1">Zeus</a>
      // liked
      // <a href="/users/1">Zeus</a>
      // 's
      // <a href="/play/26">Homer Iron Beach</a>


    // ----

    streamList.prepend(streamEle);

  });

  // -----------------------------------------------
};

(function($){
    $.fn.disableSelection = function() {
        return this
                 .attr('unselectable', 'on')
                 .css('user-select', 'none')
                 .on('selectstart', false);
    };
})(jQuery);
