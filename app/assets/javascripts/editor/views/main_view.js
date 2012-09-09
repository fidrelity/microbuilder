var MainView = Ember.View.extend({
  
  templateName : 'editor/templates/main_template',
  
  gameBinding : 'App.game',
  
  player : null,
  
  overlayView : null,
  
  init : function() {
    
    this._super();
    
    this.libraryView = LibraryView.create({ heading: 'Library', widthBinding: 'App.libraryController.width' });
    this.objectsView = ObjectsView.create({ heading : 'Objects & Behaviour', width: 740 });
    this.actionView = ActionView.create({ width: 520 });
    this.publishView = PublishView.create({ heading : 'Publish', width: 910 });
    this.boundingView = BoundingView.create({ heading : 'Bounding Area', width: 645 });
    
  },
  
  didInsertElement : function() {

    $.scrollTo( $(".stageControls"), { axies : 'y', duration : 700} );
    
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
  
  trash : function( e, _noConfirm ) {
    
    if ( _noConfirm || confirm( 'Throw the game away?' ) ) {
      
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

    var self = this;

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

    this.checkValue( App.gameController.game.title.length, { fail: "Game has no title", success: "Game has a title" }, "hasTitle");
    this.addObserver( 'App.gameController.game.title', function() {
      
      var hasTitle = App.gameController.game.title.length;
      self.checkValue( hasTitle, { fail: "Game has no title", success: "Game has a title" }, "hasTitle");
      
    });

    this.checkValue( App.gameController.game.instructions.length, { fail: "Game has no instructions", success: "Game has instructions" }, "hasInstructions");
    this.addObserver( 'App.gameController.game.instructions', function() {
      
      var hasInstr = App.gameController.game.instructions.length;
      self.checkValue( hasInstr, { fail: "Game has no instructions", success: "Game has instructions" }, "hasInstructions");
      
    });
  },

  checkValue : function(status, message, className) {    

    var className = className || "";
    var msg = status ? message.success : message.fail;
    var addClassName = status ? "label-success" : "label-important";
    var removeClassName = status ? "label-important" : "label-success";    

    var noClass = true;
    try {

      noClass = this.checkList.find("." + className).length > 0 ? false : true;

    } catch(e) {}

    if( noClass ) {

      this.checkList.append('<li class="label ' + addClassName + ' ' + className + '">'+ msg +'</li>');

    } else {

      this.checkList.find("." + className).removeClass(removeClassName).addClass(addClassName).html(msg);

    }

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
