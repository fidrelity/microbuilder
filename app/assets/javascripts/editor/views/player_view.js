var PlayerView = Ember.View.extend({

  templateName : 'editor/templates/player_template',
  
  player : null,
  type : 'stage',
  
  showHTML : false,
  
  didInsertElement : function() {
    
    var player;
    
    if ( this.type === 'stage' ) {
      
      player = new Stage();
      player.init( $( '#stage' ) );
      
      player.selectedObjectCallback = bind( App.gameObjectsController, App.gameObjectsController.selectID );
      
    } else {
      
      player = new Player();
      player.init( this.$( '#player' ) );
      
    }
    
    player.startRunloop();
    
    player.parse( App.game.getData(), null, this.corsSave );
    
    this.set( 'player', player );
    
  },
  
  destroy : function() {
    
    this.player.terminate = true;
    
    this._super();
    
  }

});