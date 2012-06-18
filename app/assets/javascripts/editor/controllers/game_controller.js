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
    
    App.libraryController.set( 'showBackground', false );
    App.libraryController.set( 'selectFunction', this.selectGraphic );
    
    App.mainView.show( 'libraryView', true );
    this.set( 'cancelView', 'objectsView' );
    
  },
  
  selectGraphic : function( graphic ) {
    
    App.gameObjectsController.createObject( graphic );
    
    App.mainView.show( 'objectsView' );
    
  },
  
  searchArtGraphic : function() {
    
    App.libraryController.set( 'showBackground', false );
    App.libraryController.set( 'selectFunction', this.selectArtGraphic );
    
    App.mainView.show( 'libraryView', true );
    this.set( 'cancelView', 'actionView' );
    
  },
  
  selectArtGraphic : function( graphic ) {
    
    App.actionController.selectGraphic( graphic );
    
    App.mainView.show( 'actionView' );
    this.set( 'cancelView', 'objectsView' );
    
  },
  
  searchBackground : function() {
    
    App.libraryController.set( 'showBackground', true );
    App.libraryController.set( 'selectFunction', this.selectBackground );
    
    App.mainView.show( 'libraryView', true );
    this.set( 'cancelView', null );
    
  },
  
  selectBackground : function( graphic ) {
    
    this.game.setBackground( graphic );
    
    this.cancel();
    
  },
  
  searchChangeGraphic : function() {
    
    App.libraryController.set( 'showBackground', false );
    App.libraryController.set( 'selectFunction', this.selectChangeGraphic );
    
    App.mainView.show( 'libraryView', true );
    this.set( 'cancelView', 'objectsView' );
    
  },
  
  selectChangeGraphic : function( graphic ) {
    
    App.gameObjectsController.current.set( 'graphic', graphic );
    
    App.mainView.show( 'objectsView' );
    this.set( 'cancelView', null );
    
  },
  
  addTrigger : function() {
    
    App.actionController.reset( 'Trigger' );
    
    App.mainView.show( 'actionView', true );
    this.set( 'cancelView', 'objectsView' );
    
  },
  
  addAction : function() {
    
    App.actionController.reset( 'Action' );
    
    App.mainView.show( 'actionView', true );
    this.set( 'cancelView', 'objectsView' );
    
  },
  
  editAction : function( action ) {
    
    App.actionController.reset( null, action );
    
    App.mainView.show( 'actionView', true );
    this.set( 'cancelView', 'objectsView' );
    
  },
  
  finalize : function() {
    
    App.mainView.show( 'publishView', true ); 
    
  },
  
  publishGame : function() {    
   
    var game = this.game.getData(),
      win = this.game.checkWin( game ),
      graphicIDs = game.graphics.map( function(i){ return i.ID; } ),
      thumb = this.getSelectedSnapshotData();
    
    console.log(
      game.title,
      game.instructions,
      JSON.stringify( game ),
      JSON.stringify( graphicIDs ),
      win,
      thumb
    );
    
    if ( !game.title.length ) {
      
      alert( 'insert title' );
      return;
      
    } else if ( !game.instructions.length ) {
      
      alert( 'insert instructions' );
      return;
      
    } else if ( !win ) {
      
      alert( 'game has no win action' );
      return;
      
    }
    
    Notifier.showLoader("Creating game! Please wait a few seconds ...");
    
    $.ajax({
      url : 'games/',
      type : 'POST',
      data : {
        
        game: {
          title : game.title,
          instruction: game.instructions,
          data : JSON.stringify( game ),
          preview_image_data : thumb,
        },
        
        graphic_ids: graphicIDs
        
      },
      
      statusCode: {
        
        200: function( data ) {
        
          console.log(data);
        
          // alert( 'sucess: ' + data.responseText );
          
          if ( window.localStorage ) {
          
            window.localStorage.setItem( 'game', null );
          
          }
          
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
  
  loadGame : function( data ) {
    
    var game = App.game, i, g;
    
    game.set( 'title', data.title );
    game.set( 'instructions', data.instructions );
    
    if ( data.duration ) {
    
      App.mainView.$( '#slider' ).slider( 'value', [data.duration] );
      game.set( 'duration', data.duration );
    
    }
    
    if ( data.graphics ) {
      
      for ( i = 0; i < data.graphics.length; i++ ) {
        
        g = data.graphics[i];
        
        App.libraryController.loadGraphic( g.ID, g.url, g.frameCount );
        
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
        
        App.gameObjectsController.parseBehaviour( data.gameObjects[i] );
        
      }
      
      App.game.gameObjectCounter = App.gameObjectsController.getMaxID() + 1;
      
    }
    
    App.mainView.updatePlayer();
    
  },
  
  clear : function() {
    
    App.game.setProperties({
     gameObjects : [],
     gameObjectCounter : 1,
     title : '',
     instructions : '',
     duration : 5,
     background : null
    });
    
  },

  takePreviewSnapshot : function() {
    var canvas = document.getElementById("testCanvas");

    var listElements = $('#snapshots').find("li");
 
    var img_data = canvas.toDataURL("image/png");
    var num = listElements.length;
    var screenshot = '<li class="thumbnail"><img src="'+img_data+'" width="210" height="130" class="thumb"><br><span class="label"><input type="radio" value="" name="previewImage"> Screen '+num+'</span></li>';
    
    $('#snapshots').append(screenshot);
    //    
    this.setActiveSnapshot($('#snapshots').find("li").last());
  },

  // highlight selected snapshot element
  setActiveSnapshot : function(_obj) {

    _obj.find('input[type="radio"]').attr("checked", "checked");

    $('#snapshots').find('li').removeClass('active');
    _obj.addClass('active');

  },

  // Returns Base64 encoded data of img
  getSelectedSnapshotData : function() {
    var selectedRadio = $('#snapshots').find('li.active');

    // Take automatic snapshot, if user didnt
    if(!selectedRadio.length) {
      this.takePreviewSnapshot();
      selectedRadio = $('#snapshots').find('li').first();
    }

    var selectedImg = selectedRadio.find('img');    
    return selectedImg.attr("src");
  }
  
});
