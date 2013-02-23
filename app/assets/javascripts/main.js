function editor_main( data, username, fork_id ) {

  window.App = Ember.Application.create();

  App.username = username;
  App.isSignedIn = username !== '';

  App.game = GameModel.create();
  App.gameController = GameController.create();

  App.libraryController = LibraryController.create({ showOwn : App.isSignedIn });

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
    
    if ( App.gameController.loadGame( data, fork_id )) {

      if (!fork_id) {
        Notifier.add( 'An unfinished game was found in your browser', 'info' ).notify();
      }
      
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

function paint_main( data, username ) {
  
  window.App = Ember.Application.create();
  
  App.username = username;
  App.isSignedIn = username !== '';
  
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

function playsite_main(game_id) {

  jQuery('#loadGameToEditor').on('click', function(e) {
    
    var hasGameInLocalStorage = JSON.parse( Storage.read( 'game' ) );

    if (hasGameInLocalStorage) {
      
      e.preventDefault();

      var overwriteGame = confirm('We saw that you have an unfinished game in the editor. Do you want to overwrite it?');

      if (!overwriteGame) {
        return false;
      } else {
        location.href = '/fork/' + game_id;
      } 

    }

  });

}

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

  if(!window.App)  {
    window.App = Ember.Application.create(); 
  }

  var pusher = new Pusher('a4bc39aab42024a54d27');

  App.streamContainer = StreamContainerView.create({
    pusher : pusher
  });

  App.streamContainer.appendTo(".activity-list");

};

(function($){
    $.fn.disableSelection = function() {
        return this
                 .attr('unselectable', 'on')
                 .css('user-select', 'none')
                 .on('selectstart', false);
    };
})(jQuery);
