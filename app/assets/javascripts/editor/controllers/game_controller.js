/*
  GameController
  
  - manages the different states
  - owns the game
*/

var GameController = Ember.Object.extend({

  gameBinding : 'App.game',
  
  cancelView : null,
  
  cancel : function() {
    
    if ( this.cancelView ) {
      
      App.mainView.show( this.cancelView );
    
    } else {
    
      App.mainView.hideOverlay();
    
    }
    
  },
  
  showObjects : function() {
    
    App.mainView.show( 'objectsView', true );
    
  },
  
  searchGraphic : function() {
    
    App.libraryController.reset( false, this.selectGraphic );
    
    App.mainView.show( 'libraryView', true );
    this.set( 'cancelView', 'objectsView' );
    
  },
  
  selectGraphic : function( graphic ) {
    
    App.mainView.placingView.set( 'graphic', graphic );
    
    App.mainView.show( 'placingView', true );
    // this.set( 'cancelView', 'libraryView' );
    
  },
  
  createObject : function( graphic, position, name ) {
    
    App.gameObjectsController.createObject( graphic, position, name );
    
    App.mainView.show( 'objectsView' );
    
  },
  
  searchArtGraphic : function() {
    
    App.libraryController.reset( false, this.selectArtGraphic );
    
    App.mainView.show( 'libraryView', true );
    this.set( 'cancelView', 'actionView' );
    
  },
  
  selectArtGraphic : function( graphic ) {
    
    App.actionController.selectGraphic( graphic );
    
    App.mainView.show( 'actionView' );
    this.set( 'cancelView', 'objectsView' );
    
  },
  
  searchBackground : function() {
    
    App.libraryController.reset( true, this.selectBackground );
    
    App.mainView.show( 'libraryView', true );
    this.set( 'cancelView', null );
    
  },
  
  selectBackground : function( graphic ) {
    
    this.game.setBackground( graphic );
    
    this.cancel();
    
  },
  
  searchChangeGraphic : function() {
    
    App.libraryController.reset( false, this.selectChangeGraphic );
    
    App.mainView.show( 'libraryView', true );
    this.set( 'cancelView', 'objectsView' );
    
  },
  
  selectChangeGraphic : function( graphic ) {
    
    App.gameObjectsController.current.set( 'graphic', graphic );
    
    App.mainView.show( 'objectsView' );
    this.set( 'cancelView', null );
    
  },
  
  addTrigger : function() {
    
    App.actionController.reset( 'trigger' );
    
    App.mainView.show( 'actionView', true );
    this.set( 'cancelView', 'objectsView' );
    
  },
  
  addAction : function() {
    
    App.actionController.reset( 'action' );
    
    App.mainView.show( 'actionView', true );
    this.set( 'cancelView', 'objectsView' );
    
  },
  
  editAction : function( action ) {
    
    App.actionController.reset( null, action );
    
    App.mainView.show( 'actionView', true );
    this.set( 'cancelView', 'objectsView' );
    
  },
  
  setBoundingArea : function() {
    
    App.mainView.show( 'boundingView', true );
    this.set( 'cancelView', 'objectsView' );
    
  },
  
  finalize : function() {
    
    App.mainView.show( 'publishView', true ); 
    
  },
  
  publishGame : function( _thumb ) {
   
    var game = this.game.getData(),
      graphicIDs = game.graphics.map( function(i){ return i.ID; } );
    
    console.log(
      game.title,
      game.instructions,
      game.version,
      JSON.stringify( game ),
      JSON.stringify( graphicIDs ),
      $("#game-tags").tagit('assignedTags').join(","),
      game.fork_id
      // thumb
    );

    Notifier.showLoader("Creating game! Please wait a few seconds ...");
    
    $.ajax({
      url : 'games/',
      type : 'POST',
      data : {
        
        game: {
          title : game.title,
          instruction : game.instructions,
          version : game.version,
          data : JSON.stringify( game ),
          preview_image_data : _thumb,
          tags : $("#game-tags").tagit('assignedTags').join(" ")
        },
        
        graphic_ids: graphicIDs
        
      },
      
      statusCode: {
        
        200: function( data ) {
        
          console.log(data);
        
          // alert( 'sucess: ' + data.responseText );
          
          Storage.write( 'game', null );
          
          window.location = data.responseText;
          Notifier.hideLoader();
        
        },
        
        400: function( data ) {
          
          console.log(data);
          Notifier.hideLoader();
          alert( data.responseText );
          
        },

        401: function( data ) {
          
          console.log(data);
          Notifier.hideLoader();
          alert( 'not logged in: ' + data.responseText );
          
        },
        
        500: function( data ) {
          
          console.log(data);
          Notifier.hideLoader();
          alert( 'internal server error: ' + data.responseText );
          
        }
        
      }
      
    });
  
  },
  
  loadGame : function( data, fork_id ) {
    
    var game = App.game, i, ret;
    
    if ( !data.gameObjects || !data.gameObjects.length ) {
      
      return false;
      
    }
    
    game.set( 'title', data.title );
    game.set( 'instructions', data.instructions );

    // Either set fork_id from already saved game or
    // by param fork_id
    if(data.fork_id) {
      game.set( 'fork_id', data.fork_id);
    } else if(fork_id) {
      game.set( 'fork_id', fork_id);
    }
    
    if ( data.duration ) {
    
      game.set( 'duration', data.duration );
    
    }
    
    if ( data.graphics ) {
      
      for ( i = 0; i < data.graphics.length; i++ ) {
        
        App.libraryController.loadGraphic( data.graphics[i] );
        
      }
      
    }
    
    if ( data.backgroundID ) {
      
      game.setBackground( App.libraryController.getGraphic( data.backgroundID ) );
      
    }
    
    if ( data.gameObjects ) {
      
      for ( i = data.gameObjects.length - 1; i >= 0; i-- ) {
        
        App.gameObjectsController.parseObject( data.gameObjects[i] );
        
      }
      
      for ( i = 0; i < data.gameObjects.length; i++ ) {
        
        if ( !App.gameObjectsController.parseBehaviour( data.gameObjects[i] ) ) {
          
          App.mainView.trash( null, true );
          
          Notifier.add( 'Your unfinished game could not be loaded due to compatibility issues with our new version', 'error' ).notify();
          
          return false;
          
        }
        
      }
      
      App.game.gameObjectCounter = App.gameObjectsController.getMaxID() + 1;
      
    }
    
    App.mainView.$( '#slider' ).slider( 'value', [game.duration] );
    
    if ( game.version !== data.version ) {
      
      Notifier.add( 'Your unfinished game has an older version, some parts might be broken', 'error' ).notify();
      
    }
    
    return true;
    
  },

  loadGameById : function(id, callback) {

    $.ajax({
      url : '/games/' + id + '/get_json',
      type : 'GET',
      //data : { id : id },  
      statusCode: {
        
        200: function( data ) {
        
          callback(data);
        
        },
        
        400: function( data ) {
          
          console.log(data);
          Notifier.hideLoader();
          
        },

        401: function( data ) {
          
          console.log(data);
          Notifier.hideLoader();
          
        },
        
        500: function( data ) {
          
          console.log(data);
          Notifier.hideLoader();
          
        }
        
      }
      
    });

  },
  
  clear : function() {
    
    App.game.setProperties({
     gameObjects : [],
     gameObjectCounter : 1,
     title : '',
     instructions : '',
     duration : 15,
     background : null,
     fork_id : null
    });
  }
  
});
