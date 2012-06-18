var StageView = Ember.View.extend({
  
  templateName: 'editor/templates/stage_template',
  
  player: null,
  
  gameObject: null,
  
  didInsertElement : function() {
    
    this.$( '#slider' ).slider({
      
      min: 5,
      max: 30,
      step: 5,
      value: App.game.duration,
      
      slide: function( event, ui ) {
        
        App.game.setDuration( ui.value );
        
      },
      
      change: function( event, ui ) {
        
        App.mainView.updatePlayer();
        
      }
      
    });
    
  },
  
  play : function() {

    this.player.fsm.start();
    
  },
  
  stop : function() {
    
    this.player.fsm.reset();
    
  },
  
  trash : function() {
    
    if ( confirm( 'Throw the game away?' ) ) {
    
      App.gameController.clear();
    
      App.gameObjectsController.set( 'current', null );
      App.behaviourController.set( 'current', null );
    
      App.mainView.updatePlayer();
      this.$( '#slider' ).slider( 'value', [5] );
    
      if ( window.localStorage ) {
    
        window.localStorage.setItem( 'game', null );
    
      }
    
    }
    
  },
  
  debug : function() {
    
    this.player.debug();
    
  },
  
  selectedObjectCallback : function( gameObjectID ) {
    
    this.set( 'gameObject', App.gameObjectsController.getObject( gameObjectID ) );
    
  }
  
});
