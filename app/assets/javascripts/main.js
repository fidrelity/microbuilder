function editor_main() {

  window.App = Ember.Application.create();

  App.game = GameModel.create();
  App.gameController = GameController.create();
  
  App.libraryController = LibraryController.create();

  App.gameObjectsController = GameObjectsController.create();
  App.behaviourController = BehaviourController.create();
  
  App.actionController = ActionController.create();

  App.mainView = MainView.create();
  App.mainView.appendTo('#content');
  
  setTimeout( function() {
  
    // App.gameController.selectGraphic( App.libraryController.get( 'content' )[0] );
    App.gameController.selectGraphic( App.libraryController.get( 'content' )[1] );
    App.gameController.selectGraphic( App.libraryController.get( 'content' )[3] );
    
    App.mainView.hideOverlay();
    
    App.mainView.stageView.player.parse( App.game.getData().game );
  
  }, 100 );

};

function paint_main() {
  
  window.App = Ember.Application.create();

  App.paintController = PaintController.create();  
  App.pencilTool = PencilToolModel.create();
  
  App.toolBoxController = ToolBoxController.create();
  App.drawTool = DrawToolModel.create();
  App.fillTool = FillToolModel.create();

  App.paintView = PaintView.create();
  App.paintSizeView = PaintSizeView.create();
  
  App.paintSizeView.appendTo('#content');
  
};

function player_main( data, game_id ) {
  var game_id = game_id || 0;
  
  window.player = new Player();  
  
  // console.log( JSON.stringify( data ) );
  
  if ( $( '#playerCanvas' ) && $( '#playerCanvas' )[0] ) {
  
    player.setCanvas( $( '#playerCanvas' )[0] );
    //player.debug();
  
    if ( data ) {
  
      player.parse( data );
      player.game_id = game_id;
  
    }
    
  }
  
};

function pusher_main() {

  /* Pusher Events*/
  var pusher = new Pusher('a4bc39aab42024a54d27');

  // -----------------------------------------------
  // New Game
  var channel = pusher.subscribe('game_channel');

  channel.bind('newgame', function(data) {
    var gameObj = $('#game-li-template').clone().removeAttr("id").hide();
    var content = gameObj.find('.thumbnail');
    content.prepend('<a href="/users/'+data.author_id+'">by '+data.author+'</a>');
    content.prepend('<h4>'+data.name+' <span class="badge badge-important">New</span></h4>');
    content.prepend('<a href="/play/'+data.game_id+'"><img src="/assets/game.png" alt="Game"></a>');

    $(".thumbnails").prepend(gameObj);
    gameObj.fadeIn(1000);
    $(".thumbnails").find('.span2').last().remove()
  });

  // -----------------------------------------------
};