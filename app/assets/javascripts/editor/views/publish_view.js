
var PublishView = Ember.View.extend({

  templateName : 'editor/templates/publish_template',
  
  player : null,
  values : null,
  checklist : null,
  
  snapshot : null,

  publish_game_caption : 'publish game',
  fork_of : '',
  
  didInsertElement : function() {

    var self = this, name, className, checked, message;
    
    // onClick on li element -> set this as active snapshot
    $('#snapshots li').live( 'click', function() {
      
      self.setActiveSnapshot( $( this ) );
      
    });

    if( !App.isSignedIn ) {
      $('.ptn-success').addClass("disabled");
    }

    // KeyEvents
    $(document).keydown(function(e) {

      if( !$("input, textarea").is(":focus")) {

        switch(e.keyCode) {

          // Key S
          case(83) : self.takeSnapshot(); break;

        }

      }

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
    
    App.updateHelp();
    
  },

  handleFork : function() {

    var forkId = App.gameController.game.getData().fork_id;

    if (forkId) {

      var self = this;

      App.gameController.loadGameById(forkId, function(fork) {

        self.set('fork_of', ' new version of "' + fork.title + '"');
        self.set('publish_game_caption', 'publish new version of "' + fork.title + '"');
      
      });

    } else {

      this.set('fork_of', '');
      this.set('publish_game_caption', 'publish game');
    
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
    
    if ( !App.isSignedIn ) {
      
      if ( confirm( 'You can\'t publish your game, because you are not signed in.\n\nDo you want to sign in?\n(Your game will wait here)' ) ) {
      
        document.location.href = '/users/sign_in'; 
      
      }      
      
      return;
      
    }
    
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
    
    if ( !this.player || !this.player.hasLoaded ) {
      
      return;
      
    }
    
    var img = new Image,
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
    
    img.src = this.player.canvas.toDataURL( "image/png" );
    
  },
  
  setActiveSnapshot : function(_obj) {
    
    _obj.find( 'input[type="radio"]' ).attr( "checked", "checked" );
    
    this.$( '#snapshots li' ).removeClass( 'active' );
    _obj.addClass( 'active' );
    
    this.set( 'snapshot', _obj.find( 'img').attr( 'src' ) );
    
  }

});