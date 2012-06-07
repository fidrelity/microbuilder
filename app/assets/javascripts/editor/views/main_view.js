var MainView = Ember.View.extend({
  
  templateName : 'editor/templates/main_template',
  
  gameBinding : 'App.game',
  
  player : null,
  
  overlayView : null,
  
  show : function( viewClass ) {
    
    var overlay;
    
    if ( this.overlayView ) {
      
      this.hideOverlay();
      
    }
    
    overlay = OverlayView.create({
      heading: viewClass.create().heading,
      viewClass : viewClass
    });
    
    overlay.appendTo( '#overlayView' );
    
    this.set( 'overlayView', overlay );
    
  },
  
  hideOverlay : function() {
    
    if ( this.overlayView ) {
    
      this.overlayView.remove();
      this.set( 'overlayView', null );
      this.updatePlayer();
      
    }
    
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

var OverlayView = Ember.View.extend({
  templateName : 'editor/templates/overlay_template',
  viewClass : null,
  heading : 'Overlay'
});
    
var ObjectsView = Ember.View.extend({
  heading : 'Objects & Behaviour',
  templateName : 'editor/templates/objects_template'
});

var PublishView = Ember.View.extend({
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
