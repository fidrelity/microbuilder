var PlayerView = Ember.View.extend({

  templateName : 'editor/templates/player_template',
  
  canvasID : 'playerCanvas',
  
  player : null,
  type : 'stage',
  
  showHTML : false,
  
  didInsertElement : function() {
    
    var player, callback, type = this.type;
    
    player = new Player();
    
    this.set( 'player', player );
    
    if ( type === 'stage' ) {
      
      player.edit = true;
      
      player.selectedObjectCallback = bind( App.gameObjectsController, App.gameObjectsController.selectID );
      player.selectedObjectDragCallback = bind( App.gameObjectsController, App.gameObjectsController.positionChanged );
      
    }
    
    player.setCanvas( $('#' + this.canvasID)[0] );
    
    player.parse( App.game.getData().game, null, this.corsSave );
    
  },
  
  destroy : function() {
    
    this.player.terminate = true;
    
    this._super();
    
  }

});