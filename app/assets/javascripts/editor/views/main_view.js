var MainView = Ember.View.extend({
  
  templateName : 'editor/templates/main_template',
  
  gameBinding : 'App.game',
  
  player : null,
  
  overlayView : null,
  
  init : function() {
    
    this._super();
    
    this.libraryView = LibraryView.create({ widthBinding: 'App.libraryController.width' });
    this.objectsView = ObjectsView.create({ heading : 'objects & behaviour', width: 750 });
    this.actionView = ActionView.create({ width: 520 });
    this.publishView = PublishView.create({ heading : 'publish', width: 910 });
    this.boundingView = BoundingView.create({ heading : 'bounding shape', width: 645 });
    this.placingView = PlacingView.create({ heading : 'placing & name', width: 450 });
    
  },
  
  didInsertElement : function() {

    $.scrollTo( $(".stageControls"), { axies : 'y', duration : 700, offset : -30 } );
    
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
    
    if ( App.showhelp ) {
      
      Ember.run.end();
      
      $('.ttip').tooltip();
      $('.pop').popover({ trigger: 'hover'});
      
    }
    
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
  
  save : function() {
    
    if ( window.localStorage ) {
      
      window.localStorage.setItem( 'game', JSON.stringify( App.game.getData() ) );
      
    }
    
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

var PublishView = Ember.View.extend({

  templateName : 'editor/templates/publish_template',
  
  player : null,
  values : null,
  checklist : null,
  
  snapshot : null,
  
  didInsertElement : function() {

    var self = this, name, className, checked, message;

    // *** Snapshot of preview game ***
    // onClick on li element
    $('#snapshots li').live( 'click', function() {
      
      self.setActiveSnapshot( $( this ) );
      
    });

    // Tagging field: https://github.com/aehlke/tag-it
    $("#game-tags").tagit({

      itemName: "tags",

      singleField : true

    });

    this.set( 'snapshot', null );

    // --- CHECK LIST ---
    this.checklist = this.$( '#check-list' );
    this.checklist.html( '' );
    
    this.values = {
      hasObjects : {
        status : App.gameController.game.gameObjects.length > 0,
        fail : "Game has no objects",
        success : "Game has objects"
      },
      hasBackground : {
        status : App.gameController.game.background !== null,
        fail : "Game has no background",
        success: "Game has a background"
      },
      hasTitle : {
        status : App.gameController.game.title.length,
        fail : "Game has no title",
        success : "Game has a title"
      },
      hasInstructions : {
        status : App.gameController.game.instructions.length,
        fail : "Game has no instructions",
        success : "Game has instructions"
      },
      hasWinAction : {
        status : App.gameController.game.checkWin( App.gameController.game.getData() ),
        fail: "Game has no win action", 
        success: "Game has win action"
      },
      wasWon : {
        status : false,
        fail: "Game was not won", 
        success: "Game was won"
      },
      hasSnapshot : {
        status : false,
        fail: "Game has no snapshot",
        success: "Game has a snapshot"
      }
    };
    
    this.addObserver( 'App.gameController.game.title', function() {
      
      self.checkValue( 'hasTitle', App.gameController.game.title.length > 0 );
      
    });
    
    this.addObserver( 'App.gameController.game.instructions', function() {
      
      self.checkValue( 'hasInstructions', App.gameController.game.instructions.length > 0 );
      
    });
    
    this.addObserver( 'snapshot', function() {
      
      self.checkValue( 'hasSnapshot', self.snapshot !== null );
      
    });
    
    this.addObserver( 'player', function() {
      
      self.player.onWin = function() {
        
        self.checkValue( 'wasWon', true );
        
      };
    
    });
    
    for ( name in this.values ) {
    
      if ( this.values.hasOwnProperty( name ) ) {
      
        checked = this.values[name].status;
        className = checked ? "label-success" : "label-important";
        message = checked ? this.values[name].success : this.values[name].fail;
      
        this.checklist.append( '<li id="' + name + '" class="label ' + className + '">' + message + '</li>');
      
      }
    
    }
    
  },
  
  checkValue : function( name, status ) {
    
    var value = this.values[name],
      node = this.checklist.find( '#' + name );
    
    value.status = status;
    
    node.removeClass( "label-important" ).removeClass( "label-success" );
    node.addClass( status ? "label-success" : "label-important" );
    node.html( status ? value.success : value.fail );
    
  },
  
  publish : function() {
    
    var message = 'You cannot publish your game because:\n', error = false, name;
    
    for ( name in this.values ) {
    
      if ( this.values.hasOwnProperty( name ) && !this.values[name].status ) {
      
        message += '- ' + this.values[name].fail + '\n';
        error = true;
      
      }
    
    }
    
    if ( error ) {
      
      alert( message );
      
    } else {
      
      App.gameController.publishGame( this.snapshot );
      
    }
    
  },
  
  takeSnapshot : function() {
    
    var canvas = this.$( '.testCanvas' )[0],
      img = new Image,
      snapshot, 
      self = this;
    
    img.onload = function() {
      
      var zoomCanvas = document.createElement( 'canvas' ),
        zoomCtx = zoomCanvas.getContext( '2d' ),
        num = self.$( '#snapshots li' ).length,
        snapshot;
        
      zoomCanvas.width = 210;
      zoomCanvas.height = 130;
      
      zoomCtx.translate( -0.5, -0.5 );
      zoomCtx.drawImage( img, 5, 0, 630, 390, 0, 0, 210, 130 );
      img = zoomCanvas.toDataURL( "image/png" );
      
      snapshot = '<li class="thumbnail"><img src="' + img + '" width="210" height="130" class="thumb"><br><span class="label"><input type="radio" value="" name="previewImage"> Screen ' + num + '</span></li>';
      
      self.$( '#snapshots' ).append( snapshot );
      
      self.setActiveSnapshot( self.$( '#snapshots' ).find( "li" ).last() );
      
    };
    
    img.src = canvas.toDataURL( "image/png" );
    
  },
  
  setActiveSnapshot : function(_obj) {
    
    _obj.find( 'input[type="radio"]' ).attr( "checked", "checked" );
    
    this.$( '#snapshots li' ).removeClass( 'active' );
    _obj.addClass( 'active' );
    
    this.set( 'snapshot', _obj.find( 'img').attr( 'src' ) );
    
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

var PlacingView = Ember.View.extend({
  
  templateName : 'editor/templates/placing_template',
  
  graphic : null,
  position : null,
  name : null,
  
  didInsertElement : function() {
    
    this.set( 'position', new Vector( 320, 195 ) );
    this.set( 'name', this.graphic.name );
    
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
