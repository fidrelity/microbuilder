var StageView = Ember.View.extend({
  
  templateName: 'templates_stage_template',
  
  player: null,
  
  gameObject: null,
  
  updatePlayer : function() {
    
    this.player.parse( App.game.getData().game );
    
  },
  
  play : function() {
    
    // alert( 'TODO' );
    this.player.fsm.try();
    
  },
  
  stop : function() {
    
    // alert( 'TODO' );
    this.player.fsm.stop();
    
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