var StageView = Ember.View.extend({
  
  templateName: 'templates/stage_template',
  
  player: null,
  
  gameObject: null,
  
  didInsertElement : function() {
    
    var self = this;
    
    this.$( '#slider' ).slider({
      
      slide: function( event, ui ) {
        
        App.game.setDuration( ui.value );
        
      },
      
      change: function( event, ui ) {
        
        self.updatePlayer();
        
      }
      
    });
    
  },
  
  updatePlayer : function() {
    
    this.player.parse( App.game.getData().game );
    
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
  
  changeArt: function() {
    
    App.mainView.stageView.set( 'gameObject', this.content );
    App.gameController.searchChangeGraphic();
    
  },
  
  toTop: function() {
    
    alert( 'TODO' );
    
  }
  
});