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
  
  if ( data ) {
    
    Ember.run.end();
    
    console.log( data );
    
    if ( App.gameController.loadGame( data ) ) {
      
      Notifier.add( 'An unfinished game was found and loaded', 'info' ).notify();
      
    }
    
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
    
    $('.ttip').tooltip( 'hide' );
    $('.pop').popover( 'hide' );
    
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

function paint_main() {
  
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
  
  App.paintSizeView.appendTo('#content');
  
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
      
    }
    
  }
  
};

function getURLParameter(name) {
  return decodeURI(
    (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
  );
}


// Realtime events with pusher.com
function pusher_main(jspane_api) {

  /* Pusher Events */
  var pusher = new Pusher('a4bc39aab42024a54d27');

  window.App = Ember.Application.create(); 

  App.streamContainer = StreamContainerView.create();
  App.streamContainer.appendTo(".jspPane");

  // Create Game Activity
  var stream_channel = pusher.subscribe('stream_channel');

  stream_channel.bind('game_create', function(data) {

    App.streamContainer.get('childViews').pushObject( GameActivityView.create({
          authorName : data.authorName,
          authorPath : data.authorPath,
          authorImage : data.authorImage,
          gameTitle : data.gameTitle,
          gamePath : data.gamePath,
          gameImage : data.gameImage
        }) );

    jspane_api.reinitialise();

  });

  // Graphic created
  stream_channel.bind('graphic_create', function(data) {    

    App.streamContainer.get('childViews').pushObject( GraphicActivityView.create({
          authorName : data.authorName,
          authorPath : data.authorPath,
          authorImage : data.authorImage,
          graphicTitle : data.graphicTitle,
          graphicPath : data.graphicPath,          
          graphicImage : data.graphicImage,
          imageType : data.imageType
        }) );

    jspane_api.reinitialise();

  });

  // Game action created - like, dislike, commented
  stream_channel.bind('game_action', function(data) {

    App.streamContainer.get('childViews').pushObject( UserOnGameView.create({
          userName : data.userName,
          userPath : data.userPath,
          userImage : data.userImage,
          authorName : data.authorName,
          authorPath : data.authorPath,          
          gameTitle : data.gameTitle,
          gamePath : data.gamePath,
          gameImage : data.gameImage,
          actionType : data.imageType // liked, disliked, commented on
        }) );

    jspane_api.reinitialise();

  });

};

(function($){
    $.fn.disableSelection = function() {
        return this
                 .attr('unselectable', 'on')
                 .css('user-select', 'none')
                 .on('selectstart', false);
    };
})(jQuery);
