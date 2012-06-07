var MainView = Ember.View.extend({
  
  templateName : 'editor/templates/main_template',
  
  gameBinding : 'App.game',
  
  overlayContent : null,
  
  player : null,
  
  init : function() {
    
    this._super();
    
    this.libraryView = LibraryView.create();
    
    this.objectsView = Ember.View.create({
      heading : 'Objects & Behaviour',
      templateName : 'editor/templates/objects_template'
    });
    
    this.actionView = ActionView.create();
    
    this.publishView = Ember.View.create({
      heading : 'Publish',
      templateName : 'editor/templates/publish_template',

      didInsertElement : function() {
        // *** Snapshot of preview game ***
        // onClick on li element
        $('#snapshots').find('li').live('click', function() {
          App.gameController.setActiveSnapshot($(this));
        });
      }

    });
    
  },
  
  show : function( locationName, viewName ) {
    
    if ( !this.get( viewName ) ) {
      
      console.error( 'no view named ' + viewName );
      return;
      
    }
    
    if ( this.get( viewName ) !== this.get( locationName ) ) {
    
      this.set( locationName, this.get( viewName ) );
    
    }
    
  },
  
  hideOverlay : function() {
    
    this.set( 'overlayContent', null );
    this.updatePlayer();
    
  },
  
  updatePlayer : function() {
    
    var player = this.player;
    
    player.parse( App.game.getData().game, function() {
      
      if ( App.gameObjectsController.current ) {
      
        player.selectObject = player.game.getGameObjectWithID( App.gameObjectsController.current.ID );
      
      }
    
    });
    
  }
  
});

var RemoveView = Ember.View.extend({

  content : null,
  controller : null,
  
  remove : function() {
    
    this.get( 'controller' ).removeObject( this.get( 'content' ) );
    
  },

});

var SelectView = RemoveView.extend({
  
  selectFunction : null,
  
  collection : null,
  
  select : function() {
    
    this.selectFunction.call( this.controller, this.content );
    
  }
  
});

var BehaviourView = SelectView.extend({
  
  addTrigger : function() {
    
    App.behaviourController.set( 'current', this.get( 'content' ) );
    App.gameController.addTrigger();
    
  },
  
  addAction : function() {
    
    App.behaviourController.set( 'current', this.get( 'content' ) );
    App.gameController.addAction();
    
  },
  
  duplicate : function() {
    
    App.behaviourController.duplicateBehaviour( this.content );
    App.mainView.updatePlayer();
    
  }
  
});
