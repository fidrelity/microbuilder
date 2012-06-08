var MainView = Ember.View.extend({
  
  templateName : 'editor/templates/main_template',
  
  gameBinding : 'App.game',
  
  player : null,
  
  overlayView : null,
  overlayView2 : null,
  
  show : function( viewClass ) {
    
    var self = this, overlay;
    
    overlay = OverlayView.create({
      heading: viewClass.create().heading,
      viewClass : viewClass
    });
    
    overlay.appendTo( '#overlayView' );
    
    if ( this.overlayView ) {
      
      overlay.fadeIn = false;
      self.set( 'overlayView2', overlay );
      
      this.hideOverlay();
      
    } else {
      
      self.set( 'overlayView', overlay );
      
    }
    
  },
  
  hideOverlay : function() {
    
    var self = this;
    
    if ( this.overlayView ) {
    
      this.overlayView.$( '#overlayWrapper' ).fadeOut( 100, function() {
        
        self.overlayView.remove();
        
        if ( self.overlayView2 ) {
          
          self.set( 'overlayView', self.overlayView2 );
          self.set( 'overlayView2', null );
          
          self.overlayView.$( '#overlayWrapper' ).fadeIn( 100 );
          
        } else {
          
          self.set( 'overlayView', null );
          
        }
        
      });
      
      this.updatePlayer();
      
    }
    
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
    
    if ( this.fadeIn ) {
    
      this.$( '#overlayWrapper' ).fadeIn( 100 );
    
    }
    
  }
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
