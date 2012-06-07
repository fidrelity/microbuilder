var StageView = Ember.View.extend({
  
  templateName: 'editor/templates/stage_template',
  
  player: null,
  
  gameObject: null,
  
  didInsertElement : function() {
    
    this.$( '#slider' ).slider({
      
      min: 5,
      max: 30,
      step: 5,
      
      slide: function( event, ui ) {
        
        App.game.setDuration( ui.value );
        
      },
      
      change: function( event, ui ) {
        
        App.mainView.updatePlayer();
        
      }
      
    });
    
  },
  
  play : function() {

    this.player.fsm.try();
    
  },
  
  stop : function() {
    
    this.player.stop();
    
  },
  
  trash : function() {
    
    App.gameController.clear();
    
    App.gameObjectsController.set( 'current', null );
    App.behaviourController.set( 'current', null );
    
    App.mainView.updatePlayer();
    
    if ( window.localStorage ) {
    
      window.localStorage.setItem( 'game', null );
    
    }
    
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
    App.mainView.updatePlayer();
    
    this.set( 'content', null );
    
  },
  
  duplicate : function() {
    
    App.gameObjectsController.duplicateObject( this.content );
    App.mainView.updatePlayer();
    
  },
  
  changeArt: function() {
    
    App.gameController.searchChangeGraphic();
    App.mainView.updatePlayer();
    
  },
  
  toTop: function() {
    
    App.gameObjectsController.moveToTop( this.content );
    App.mainView.updatePlayer();
    
  }
  
});