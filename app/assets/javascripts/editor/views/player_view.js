var PlayerView = Ember.View.extend({

  templateName : 'editor/templates/player_template',
  
  canvasID : 'playerCanvas',
  
  player : null,
  type : 'stage',
  
  showHTML : false,
  
  didInsertElement : function() {
    
    var player, callback, type = this.type;
    
    if ( type === 'stage' ) {
      
      player = new Stage();
      
      player.selectedObjectCallback = bind( App.gameObjectsController, App.gameObjectsController.selectID );
      
    } else {
      
      player = new Player();
      
    }
    
    this.set( 'player', player );
    
    player.init( $('#' + this.canvasID)[0] );
    player.startRunloop();
    
    player.parse( App.game.getData().game, null, this.corsSave );
    
  },
  
  destroy : function() {
    
    this.player.terminate = true;
    
    this._super();
    
  }

});