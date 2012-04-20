var StageView = Ember.View.extend({
  
  templateName: 'templates_stage_template',
  
  player: null,
  
  gameObject: null,
  
  didInsertElement : function() {
    
    var player, game, canvas = this.$( '#stageCanvas' )[0];
    
    if ( canvas ) {
    
      player = new Player(),
      game = App.game;
    
      player.edit = true;
    
      // player.debug = true;
      player.objectsMoveable = true;
      player.areaSelectable = true;
    
      player.selectedObjectCallback = bind( this, this.selectedObjectCallback );
      player.selectedObjectDragCallback = bind( game, game.gameObjectPositionChanged );
    
      player.setCanvas( canvas );
      player.parse( game.getData().game );
    
      this.player = player;
    
    }
  
  },
  
  updatePlayer : function() {
    
    this.player.parse( App.game.getData().game );
    
  },
  
  play : function() {
    
    alert( 'TODO' );
    
  },
  
  stop : function() {
    
    alert( 'TODO' );
    
  },
  
  selectedObjectCallback : function( gameObjectID ) {
    
    this.set( 'gameObject', App.game.getGameObjectWithID( gameObjectID ) );
    
  }
  
});

var GameObjectView = Ember.View.extend({
  
  content: null,
  
  remove: function() {
    
    App.gameObjectsController.removeObject( this.content );
    
    App.mainView.stageView.updatePlayer();
    
    this.set( 'content', null );
    
  },
  
  changeArt: function() {
    
    alert( 'TODO' );
    
  },
  
  toTop: function() {
    
    alert( 'TODO' );
    
  }
  
});