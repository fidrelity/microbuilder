var StageView = Ember.View.extend({
  
  templateName: 'editor/templates/stage_template',
  
  player: null,
  
  gameObject: null,
  
  didInsertElement : function() {
    
    var self = this;
    
    this.$( '#slider' ).slider({
      
      min: 5,
      max: 30,
      step: 5,
      
      slide: function( event, ui ) {
        
        App.game.setDuration( ui.value );
        
      },
      
      change: function( event, ui ) {
        
        self.updatePlayer();
        
      }
      
    });
    
  },
  
  updatePlayer : function() {
    
    var player = this.player;
    
    player.parse( App.game.getData().game, function() {
      
      if ( App.gameObjectsController.current ) {
      
        player.selectObject = player.game.getGameObjectWithID( App.gameObjectsController.current.ID );
      
      }
    
    });
    
  },
  
  play : function() {

    this.player.fsm.try();
    
  },
  
  stop : function() {
    
    this.player.stop();
    
  },
  
  debug : function() {
    
    this.player.debug();
    
  },
  
  selectedObjectCallback : function( gameObjectID ) {
    
    this.set( 'gameObject', App.game.getGameObjectWithID( gameObjectID ) );
    
  }
  
});

var GameObjectView = Ember.View.extend({
  
  content: null,
  
  remove: function() {
    
    App.game.removeGameObject( this.content );
    App.mainView.stageView.updatePlayer();
    
    this.set( 'content', null );
    
  },
  
  duplicate : function() {
    
    App.gameObjectsController.duplicateObject( this.content );
    App.mainView.stageView.updatePlayer();
    
  },
  
  changeArt: function() {
    
    App.gameController.searchChangeGraphic();
    App.mainView.stageView.updatePlayer();
    
  },
  
  toTop: function() {
    
    App.gameObjectsController.moveToTop( this.content );
    App.mainView.stageView.updatePlayer();
    
  }
  
});