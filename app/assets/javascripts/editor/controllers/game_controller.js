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
    
    App.mainView.show( ObjectsView );
    
  },
  
  searchGraphic : function() {
    
    App.libraryController.set( 'showBackground', false );
    App.libraryController.set( 'selectFunction', this.selectGraphic );
    
    App.mainView.show( LibraryView );
    this.set( 'cancelView', ObjectsView );
    
  },
  
  selectGraphic : function( graphic ) {
    
    App.gameObjectsController.createObject( graphic );
    
    App.mainView.show( ObjectsView );
    
  },
  
  searchArtGraphic : function() {
    
    App.libraryController.set( 'showBackground', false );
    App.libraryController.set( 'selectFunction', this.selectArtGraphic );
    
    App.mainView.show( LibraryView );
    this.set( 'cancelView', ActionView );
    
  },
  
  selectArtGraphic : function( graphic ) {
    
    App.actionController.action.selectGraphic( graphic );
    
    App.mainView.show( ActionView );
    this.set( 'cancelView', ObjectsView );
    
    var action = App.actionController.action;
    
    App.actionController.reset( 'Action' );
    
    App.actionController.set( 'action', action );
    App.actionController.set( 'showSaveButton', true );
    
  },
  
  searchBackground : function() {
    
    App.libraryController.set( 'showBackground', true );
    App.libraryController.set( 'selectFunction', this.selectBackground );
    
    App.mainView.show( LibraryView );
    this.set( 'cancelView', null );
    
  },
  
  selectBackground : function( graphic ) {
    
    this.game.setBackground( graphic );
    
    this.cancel();
    
  },
  
  searchChangeGraphic : function() {
    
    App.libraryController.set( 'showBackground', false );
    App.libraryController.set( 'selectFunction', this.selectChangeGraphic );
    
    App.mainView.show( LibraryView );
    this.set( 'cancelView', ObjectsView );
    
  },
  
  selectChangeGraphic : function( graphic ) {
    
    App.gameObjectsController.current.set( 'graphic', graphic );
    
    App.mainView.show( ObjectsView );
    this.set( 'cancelView', null );
    
  },
  
  addTrigger : function() {
    
    App.mainView.show( ActionView );
    App.actionController.reset( 'Trigger' );
    
    this.set( 'cancelView', ObjectsView );
    
  },
  
  addAction : function() {
    
    App.mainView.show( ActionView );
    App.actionController.reset( 'Action' );
    
    this.set( 'cancelView', ObjectsView );
    
  },
  
  finalize : function() {
    
    App.mainView.show( PublishView ); 
    
  },
  
  publishGame : function() {    
   
    var data = this.game.getData();
    
    console.log(
      this.game.title,
      this.game.instructions,
      JSON.stringify( data.game ),
      JSON.stringify( data.graphicIDs ),
      data.win,
      this.getSelectedSnapshotData()
    );

    if ( !this.game.title ) {
        
        alert( 'insert title' );
        return;
        
    } else if ( !this.game.instructions ) {
        
        alert( 'insert instructions' );
        return;
        
    } else if ( !data.win ) {
        
        alert( 'game has no win action' );
        return;
        
    }
        
    Notifier.showLoader("Creating game! Please wait a few seconds ...");

    $.ajax({
      url : 'games/',
      type : 'POST',
      data : {
        
        game: {
          title : this.game.title || '',
          instruction: this.game.instructions || '',
          data : JSON.stringify( data.game ),
          preview_image_data : this.getSelectedSnapshotData(),
        },
        
        graphic_ids: data.graphicIDs
        
      },
      
      statusCode: {
        
        200: function( data ) {
        
          console.log(data);
        
          // alert( 'sucess: ' + data.responseText );
          
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
    
    // window.localStorage.setItem( 'game', JSON.stringify( this.game.getData() ) );
  
  },
  
  loadGame : function( data ) {
    
    var game = App.game, i;
    
    if ( data.duration ) {
    
      App.mainView.$( '#slider' ).slider( 'value', [data.duration] );
      game.set( 'duration', data.duration );
    
    }
    
    if ( data.graphics ) {
      
      for ( i = 0; i < data.graphics.length; i++ ) {
        
        App.libraryController.loadGraphic( data.graphics[i].ID, data.graphics[i].url );
        
      }
      
    }
    
    if ( data.backgroundID ) {
      
      game.setBackground( App.libraryController.getGraphic( data.backgroundID ) );
      
    }
    
    if ( data.gameObjects ) {
      
      for ( i = 0; i < data.gameObjects.length; i++ ) {
        
        App.gameObjectsController.parseObject( data.gameObjects[i] );
        
      }
      
      for ( i = 0; i < data.gameObjects.length; i++ ) {
        
        App.gameObjectsController.parseBehaviour( data.gameObjects[i] );
        
      }
      
    }
    
    App.game.gameObjectCounter = App.gameObjectsController.getMaxID() + 1;
    App.mainView.updatePlayer();
    
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
