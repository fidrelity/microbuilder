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
  
  duplicate : function() {
    
    App.game.duplicateGameObject( this.content );
    App.mainView.stageView.updatePlayer();
    
  },
  
  changeArt: function() {
    
    App.gameController.searchChangeGraphic();
    App.mainView.stageView.updatePlayer();
    
  },

  divStyle : function() {
  
    if ( !this.content ) {
      
      return "";
      
    }
  
    return "background-image:url(" + this.content.graphic.imagePath + ");background-size:" + this.content.graphic.resizeWidth + "px 64px;";
  
  }.property( 'content' ),
  
  toTop: function() {
    
    App.gameObjectsController.moveToTop( this.content );
    App.mainView.stageView.updatePlayer();
    
  }
  
});