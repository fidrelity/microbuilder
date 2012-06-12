var MainView = Ember.View.extend({
  
  templateName : 'editor/templates/main_template',
  
  gameBinding : 'App.game',
  
  player : null,
  
  overlayView : null,
  overlay : null,
  
  init : function() {
    
    this._super();
    
    this.libraryView = LibraryView.create();
    this.objectsView = ObjectsView.create();
    this.actionView = ActionView.create();
    this.publishView = PublishView.create();
    
    this.overlayView = OverlayView.create();
    
  },
  
  show : function( name ) {
    
    var view = this.get( name );
    
    this.overlayView.set( 'showView', view );
    this.overlayView.set( 'heading', view.get( 'heading' ) );
    
    this.set( 'overlay', this.overlayView );
    
  },
  
  hideOverlay : function() {
    
    this.set( 'overlay', null );
    
    this.updatePlayer();
    
  },
  
  updatePlayer : function() {
    
    var player = this.player,
      data = App.game.getData().game;
      
    if ( window.localStorage ) {
      
      window.localStorage.setItem( 'game', JSON.stringify( data ) );
      
    }
    
    player.parse( data, function() {
      
      if ( App.gameObjectsController.current ) {
      
        player.selectObject = player.game.getGameObjectWithID( App.gameObjectsController.current.ID );
      
      }
    
    });
    
  }
  
});

var OverlayView = Ember.View.extend({
  templateName : 'editor/templates/overlay_template',
  viewClass : null,
  heading : 'Overlay',
  fadeIn : true,
  
  didInsertElement : function() {
    
    window.scrollTo( 0, 0 );
    
    // if ( this.fadeIn ) {
    // 
    //   this.$( '.overlayWrapper' ).fadeIn( 100 );
    // 
    // }
    
  }
});
    
var ObjectsView = Ember.View.extend({
  heading : 'Objects & Behaviour',
  templateName : 'editor/templates/objects_template',
  
  // didInsertElement : function() {
  //   
  //   $( '.actions' ).sortable({
  //     connectWith: '.actions',
  //     placeholder: 'ui-state-highlight',
  //     stop: function(event, ui) {
  //       console.log( event, ui );
  //     }
  //   }).disableSelection();
  //   
  //   $( '.triggers' ).sortable({
  //     connectWith: '.triggers',
  //     placeholder: 'ui-state-highlight',
  //     stop: function(event, ui) {
  //       console.log( event, ui );
  //     }
  //   }).disableSelection();
  //   
  // }
  
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
