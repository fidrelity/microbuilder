var MainView = Ember.View.extend({
  
  templateName : 'editor/templates/main_template',
  
  gameBinding : 'App.game',
  
  player : null,
  
  overlayView : null,
  
  init : function() {
    
    this._super();
    
    this.libraryView = LibraryView.create({ widthBinding: 'App.libraryController.width' });
    this.objectsView = ObjectsView.create({ heading : 'objects & behaviour', width: 863 });
    this.actionView = ActionView.create({ width: 595 });
    this.publishView = PublishView.create({ heading : 'publish', width: 910 });
    this.boundingView = BoundingView.create({ heading : 'bounding shape', width: 645 });
    this.placingView = PlacingView.create({ heading : 'placing & name', width: 450 });
    
  },
  
  didInsertElement : function() {

    // $.scrollTo( $(".topbar"), { axies : 'y', duration : 700, offset : -30 } );
    
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
  
  show : function( name, push ) {
    
    var view = this.get( name );
    
    if ( name === 'libraryView' && view === this.overlayView.showView ) {
      
      view.didInsertElement();
      
    }
    
    if ( name === 'objectsView' ) {
      
      this.save();
      
    }

    if ( name === 'publishView') {
      
      view.handleFork();
      
    }
    
    App.hideHelp();
    
    this.overlayView.setWidth( view.width );
    this.overlayView.set( 'showView', view );
    
    // if ( push ) {
      
      this.overlayView.pushHeading( view.get( 'heading' ) );
      
    // } else {
    //   
    //   this.overlayView.popHeading();
    //   
    // }
    
    this.overlayView.set( 'isVisible', true );
    
    $.scrollTo( $( '.overlayhead' ), { axies : 'y', duration : 500, offset : -30 } );
    
  },
  
  hideOverlay : function() {
    
    this.overlayView.set( 'isVisible', false );
    this.overlayView.set( 'headings', [] );
    
    this.updatePlayer();
    
    App.hideHelp();
    
  },
  
  updatePlayer : function() {
    
    var player = this.player,
      data = App.game.getData();
    
    Storage.write( 'game', JSON.stringify( data ) );
    
    player.parse( data, function() {
      
      if ( App.gameObjectsController.current ) {
      
        player.selectObject = player.game.getGameObjectWithID( App.gameObjectsController.current.ID );
      
      }
    
    });
    
  },
  
  save : function() {
    
    Storage.write( 'game', JSON.stringify( App.game.getData() ) );
    
  },
  
  play : function() {
    
    this.player.fsm.start();
    
  },
  
  stop : function() {
    
    this.player.fsm.reset();
    
  },
  
  trash : function( e, _noConfirm ) {
    
    if ( _noConfirm || confirm( 'Throw the game away?' ) ) {
      
      App.gameController.clear();
      
      App.gameObjectsController.set( 'current', null );
      App.behaviourController.set( 'current', null );
      
      this.$( '#slider' ).slider( 'value', [App.game.duration] );
      
      Storage.write( 'game', null );
      
    }
    
  },
  
  debug : function() {
    
    this.player.debug();
    
  }
  
});

var OverlayView = Ember.View.extend({
  
  templateName : 'editor/templates/overlay_template',
  
  isVisible : false,
  
  headings : [],
  
  showView : null,
  
  didInsertElement : function() {
    
    var self = this;
    
    this.addObserver( 'showView.width', function() {
      
      self.setWidth( self.showView.width );
      
    });
    
    App.mainView.set( 'overlayView', this );
    
  },
  
  pushHeading : function( heading ) {
    
    this.headings.clear();
    
    this.headings.pushObject( heading );
    
  },
  
  popHeading : function() {
    
    this.headings.popObject();
    
  },
  
  heading : function() {
    
    return this.headings.join( ' > ' );
    
  }.property( 'headings.length' ),
  
  currentHeading : function() {
    
    return this.headings.objectAt( this.headings.length - 1 );
    
  }.property( 'headings.length' ),
  
  setWidth : function( width ) {
    
    this.$( '.overlay' ).css({ width : width + 'px' });
    
  }
  
});


var BoundingView = Ember.View.extend({
  
  templateName : 'editor/templates/bounding_template',
  
  gameObjectBinding : 'App.gameObjectsController.current',
  
  type : 'rect', // rect, circle
  area : null,
  
  didInsertElement : function() {
    
    if ( this.gameObject.boundingArea ) {
      
      if ( this.gameObject.boundingArea.radius ) {
        
        this.$( '#circleButton' ).addClass( 'active' );
        this.useCircle();
        
      } else {
        
        this.$( '#rectButton' ).addClass( 'active' );
        this.useBox();
        
      }
      
    } else if ( this.type === 'rect' ) {
    
      this.$( '#rectButton' ).addClass( 'active' );
    
    } else {
      
      this.$( '#circleButton' ).addClass( 'active' );
      
    }
    
    App.updateHelp();
    
  },
  
  useBox : function() {
    
    this.set( 'type', 'rect' );
    
  },
  
  useCircle : function() {
    
    this.set( 'type', 'circle' );
    
  },
  
  setArea : function( area ) {
    
    this.set( 'area', ( area.width || area.radius ) ? area : null );
    
  },
  
  message : function() {
    
    if ( this.area ) {
      
      if ( this.area.radius ) {
        
        return 'circle: ' + this.area.string();
        
      }
      
      return 'box: ' + this.area.string();
      
    }
    
    return 'use area of graphic';
    
  }.property( 'area' ),
  
  save : function() {
    
    this.gameObject.setBoundingArea( this.area );
    
    App.gameController.cancel();
    
    this.set( 'area', null );
    
  }
  
});

var PlacingView = Ember.View.extend({
  
  templateName : 'editor/templates/placing_template',
  
  graphic : null,
  position : null,
  name : null,
  
  didInsertElement : function() {
    
    this.set( 'position', new Vector( 320, 195 ) );
    this.set( 'name', this.graphic.name );
    
    App.updateHelp();
    
  },
  
  save : function() {
    
    App.gameController.createObject( this.graphic, this.position, this.name );
    
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
