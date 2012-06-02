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
      
      App.mainView.show( 'overlayContent', this.cancelView );
    
    } else {
    
      App.mainView.hideOverlay();
    
    }
    
  },
  
  showObjects : function() {
    
    App.mainView.show( 'overlayContent', 'objectsView' );
    
  },
  
  searchGraphic : function() {
    
    App.libraryController.set( 'showBackground', false );
    App.libraryController.set( 'selectFunction', this.selectGraphic );
    
    App.mainView.show( 'overlayContent', 'libraryView' );
    this.set( 'cancelView', 'objectsView' );
    
  },
  
  selectGraphic : function( graphic ) {
    
    App.gameObjectsController.addObject( GameObjectModel.create({
      
      name : graphic.name,
      graphic : graphic,
      position : new Vector( Math.floor( Math.random() * 540 ), Math.floor( Math.random() * 290 ) )
      
    }) );
    
    App.mainView.show( 'overlayContent', 'objectsView' );
    
  },
  
  searchArtGraphic : function() {
    
    App.libraryController.set( 'showBackground', false );
    App.libraryController.set( 'selectFunction', this.selectArtGraphic );
    
    App.mainView.show( 'overlayContent', 'libraryView' );
    this.set( 'cancelView', 'actionView' );
    
  },
  
  selectArtGraphic : function( graphic ) {
    
    App.actionController.action.selectGraphic( graphic );
    
    App.mainView.show( 'overlayContent', 'actionView' );
    this.set( 'cancelView', 'objectsView' );
    
  },
  
  searchBackground : function() {
    
    App.libraryController.set( 'showBackground', true );
    App.libraryController.set( 'selectFunction', this.selectBackground );
    
    App.mainView.show( 'overlayContent', 'libraryView' );
    this.set( 'cancelView', null );
    
  },
  
  selectBackground : function( graphic ) {
    
    this.game.setBackground( graphic );
    
    this.cancel();
    
  },
  
  searchChangeGraphic : function() {
    
    App.libraryController.set( 'showBackground', false );
    App.libraryController.set( 'selectFunction', this.selectChangeGraphic );
    
    App.mainView.show( 'overlayContent', 'libraryView' );
    this.set( 'cancelView', 'objectsView' );
    
  },
  
  selectChangeGraphic : function( graphic ) {
    
    App.gameObjectsController.current.set( 'graphic', graphic );
    
    App.mainView.show( 'overlayContent', 'objectsView' );
    this.set( 'cancelView', null );
    
  },
  
  addTrigger : function() {
    
    App.mainView.show( 'overlayContent', 'actionView' );
    App.actionController.reset( 'Trigger' );
    
  },
  
  addAction : function() {
    
    App.mainView.show( 'overlayContent', 'actionView' );
    App.actionController.reset( 'Action' );
    
  },
  
  finalize : function() {
    
    App.mainView.show( 'overlayContent', 'publishView' ); 
    
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
        
    // } else if ( !data.win ) {
    //     
    //     alert( 'game has no win action' );
    //     return;
        
    }
    
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
        
        },
        
        400: function( data ) {
          
          console.log(data);
          
          alert( data.responseText );
          
        },

        401: function( data ) {
          
          console.log(data);
          
          alert( 'not logged in: ' + data.responseText );
          
        },
        
        500: function( data ) {
          
          console.log(data);
          
          alert( 'internal server error: ' + data.responseText );
          
        }
        
      }
      
    });
    
    // window.localStorage.setItem( 'game', JSON.stringify( this.game.getData() ) );
  
  },
  
  loadGame : function() {
    
    
    
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
    var selectedRadio = $('#snapshots').find('li').find('input[type="radio"]:checked');

    // Take automatic snapshot, if user didnt
    if(!selectedRadio.length) {
      this.takePreviewSnapshot();
      selectedRadio = $('#snapshots').find('li').find('input[type="radio"]').first().prop("checked", true);
    }

    var selectedImg = selectedRadio.parent().find('img');
    return selectedImg.attr("src");
  }
  
});
