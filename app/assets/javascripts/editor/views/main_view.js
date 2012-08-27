var MainView = Ember.View.extend({
  
  templateName : 'editor/templates/main_template',
  
  gameBinding : 'App.game',
  
  player : null,
  
  overlayView : null,
  
  init : function() {
    
    this._super();
    
    this.libraryView = LibraryView.create({ heading: 'Library', widthBinding: 'App.libraryController.width' });
    this.objectsView = ObjectsView.create({ heading : 'Objects & Behaviour', width: 940 });
    this.actionView = ActionView.create({ width: 520 });
    this.publishView = PublishView.create({ heading : 'Publish', width: 910 });
    this.boundingView = BoundingView.create({ heading : 'Bounding Area', width: 645 });
    
  },
  
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
  
  show : function( name, push ) {
    
    var view = this.get( name );
    
    this.overlayView.setWidth( view.width );
    this.overlayView.set( 'showView', view );
    
    if ( push ) {
      
      this.overlayView.pushHeading( view.get( 'heading' ) );
      
    } else {
      
      this.overlayView.popHeading();
      
    }
    
    this.overlayView.set( 'isVisible', true );
    
  },
  
  hideOverlay : function() {
    
    this.overlayView.set( 'isVisible', false );
    this.overlayView.set( 'headings', [] );
    
    this.updatePlayer();
    
  },
  
  updatePlayer : function() {
    
    var player = this.player,
      data = App.game.getData();
      
    if ( window.localStorage ) {
      
      window.localStorage.setItem( 'game', JSON.stringify( data ) );
      
    }
    
    player.parse( data, function() {
      
      if ( App.gameObjectsController.current ) {
      
        player.selectObject = player.game.getGameObjectWithID( App.gameObjectsController.current.ID );
      
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
      
      this.$( '#slider' ).slider( 'value', [5] );
      
      if ( window.localStorage ) {
      
        window.localStorage.setItem( 'game', null );
      
      }
      
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

var PublishView = Ember.View.extend({

  templateName : 'editor/templates/publish_template',

  didInsertElement : function() {

    // *** Snapshot of preview game ***
    // onClick on li element
    $('#snapshots').find('li').live('click', function() {
      App.gameController.setActiveSnapshot($(this));
    });

    // Tagging field: https://github.com/aehlke/tag-it
    $("#game-tags").tagit({

      itemName: "tags",

      singleField : true

    });

    // --- CHECK LIST ---
    this.checkList = $("#check-list");
    this.checkList.html("");

    var hasObjects = App.gameController.game.gameObjects.length > 0;
    this.checkValue( hasObjects, { fail: "Game has no objects", success: "Game has objects" });    

    var hasBackground = App.gameController.game.background !== null;
    this.checkValue( hasBackground, { fail: "Game has no background", success: "Game has a background" });    

    var hasWinAction = App.gameController.game.checkWin( App.gameController.game.getData() );
    this.checkValue( hasWinAction, { fail: "Game has no win action", success: "Game has win action" });
  },

  checkValue : function(status, message) {

    var msg = status ? message.success : message.fail;
    var addClassName = status ? "label-success" : "label-important";
    var removeClassName = status ? "label-important" : "label-success";

    this.checkList.append('<li class="label ' + addClassName + '">'+ msg +'</li>');

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
