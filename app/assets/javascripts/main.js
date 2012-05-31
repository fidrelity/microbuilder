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
  
}