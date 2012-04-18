/*
  GameController
  
  - manages the different states
  - owns the game
*/

var GameController = Ember.Object.extend({

  game : null,

  player : null,

  init : function() {
    
    this.game = GameModel.create();
    
    var player = new Player();
    
    // player.edit = true;
    
    // player.debug = true;
    // player.moveObjects = true;
    // player.selectArea = true;
    
    this.player = player;
    
  },
  
  getGameData : function() {
    
    return this.game.getData().game;
    
  },
  
  cancel : function() {
    
    App.routeManager.goToLocation( '' );
    
  },
  
  setPlayerCanvas : function( canvas ) {
    
    this.player.setCanvas( canvas );
    
    this.updatePlayer();
    
  },
  
  updatePlayer : function() {
    
    this.player.parse( this.game.getData().game );
    
  },
  
  searchGraphic : function() {
    
    App.libraryController.setMode( 'graphic' );
    
    App.routeManager.goToLocation( 'library' );
    
  },
  
  drawGraphic : function() {
    
    App.routeManager.goToLocation( 'paint' );
    
  },
  
  selectGraphic : function( graphic ) {
    
    App.placementController.set( 'graphic', graphic );
    
    App.routeManager.goToLocation( 'placement' );
    
  },
  
  placeGraphic : function( graphic, position ) {
    
    App.gameObjectsController.addObject( GameObjectModel.create({
      
      'name' : graphic.name,
      'graphic' : graphic,
      'position' : position.clone()
      
    }) );
    
    App.routeManager.goToLocation( '' );
    
  },
  
  searchBackground : function() {
    
    App.libraryController.setMode( 'background' );
    
    App.routeManager.goToLocation( 'library' );
    
  },
  
  selectBackground : function( graphic ) {
    
    this.game.setBackground( graphic );
    
    App.routeManager.goToLocation( '' );
    
  },
  
  addBehaviour : function() {
    
    App.behaviourController.createBehaviour();
    
  },
  
  addTrigger : function() {
    
    App.triggerController.reset();
    App.routeManager.goToLocation( 'trigger' );
    
  },
  
  addAction : function() {
    
    App.actionController.reset();
    App.routeManager.goToLocation( 'action' );
    
  },
  
  saveBehaviour : function() {
    
    // App.behaviourController.saveCurrentBehaviour();
    
    App.routeManager.goToLocation( '' );
    
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
