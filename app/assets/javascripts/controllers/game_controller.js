/*
  GameController
  
  - manages the different states
  - owns the game
*/

var GameController = Ember.Object.extend({

  game : null,

  init : function() {
    
    this.game = GameModel.create();;
    
  },
  
  getGameData : function() {
    
    return this.game.getData().game;
    
  },
  
  getGameObjectsData : function() {
    
    return this.game.getGameObjectsData();
    
  },
  
  cancel : function() {
    
    App.mainView.show( 'stageContent', 'stageView' );
    App.mainView.show( 'behaviourContent', 'behaviourView' );
    
  },
  
  searchGraphic : function() {
    
    App.libraryController.setMode( 'graphic' );
    
    App.mainView.show( 'stageContent', 'libraryView' );
    
  },
  
  drawGraphic : function() {
    
    App.mainView.show( 'stageContent', 'paintView' );
    
  },
  
  selectGraphic : function( graphic ) {
    
    App.gameObjectsController.addObject( GameObjectModel.create({
      
      'name' : graphic.name,
      'graphic' : graphic,
      'position' : new Vector( Math.floor( Math.random() * 540 ), Math.floor( Math.random() * 290 ) )
      
    }) );
    
    this.cancel();
    
  },
  
  searchBackground : function() {
    
    App.libraryController.setMode( 'background' );
    
    App.mainView.show( 'stageContent', 'libraryView' );
    
  },
  
  selectBackground : function( graphic ) {
    
    this.game.setBackground( graphic );
    
    this.cancel();
    
  },
  
  addBehaviour : function() {
    
    App.behaviourController.createBehaviour();
    
  },
  
  addTrigger : function() {
    
    App.triggerController.reset();
    App.mainView.show( 'behaviourContent', 'triggerView' );
    
  },
  
  addAction : function() {
    
    App.actionController.reset();
    App.mainView.show( 'behaviourContent', 'actionView' );
    
  },
  
  publishGame : function() {
    
    var data = this.game.getData();
    
    console.log(
      this.game.title,
      this.game.instructions,
      JSON.stringify( data.game ),
      JSON.stringify( data.graphicIDs ),
      data.win
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
    
    $.ajax({
      url : 'games/',
      type : 'POST',
      data : {
        
        game: {
          title : this.game.title || '',
          instruction: this.game.instructions || '',
          data : JSON.stringify( data.game )
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
    
    
    
  }
  
});
