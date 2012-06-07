var GameModel = Ember.Object.extend({
  
  title : null,
  instructions : null,
  
  background : null,
  
  gameObjects : [],
  gameObjectCounter : 1,
  
  duration : 5,
  
  setBackground : function( graphic ) {
    
    this.set( 'background', graphic );
    
  },
  
  getData : function() {
    
    var game = { duration: this.duration },
        graphics = [],
        graphicIDs = [],
        win = false,
        i, j;
    
    game.title = this.title;
    game.instructions = this.instructions;
    
    if ( this.background ) {
      
      game.backgroundID = this.background.ID;
      graphics.push( this.background.getData() );
      
    }
    
    if ( this.gameObjects.length ) {
      
      game.gameObjects = [];
    
      for ( i = this.gameObjects.length - 1; i >= 0; i-- ) {
    
        game.gameObjects.push( this.gameObjects[i].getData( graphics ) );
    
      }
    
    }
    
    for ( i = 0; i < graphics.length; i++ ) {
  
      graphicIDs.push( graphics[i].ID );
  
    }
    
    game.graphics = graphics;
    
    win = this.checkWin( game );
    
    return {
        game: game,
        graphicIDs: graphicIDs,
        win: win
    };
    
  },
  
  getGameObjectsData : function() {
  
    var game = { graphics : [], gameObjects : [] }, i;
    
    if ( this.background ) {
      
      game.background = this.background.imagePath;
      
    }
    
    if ( this.gameObjects.length ) {
    
      for ( i = this.gameObjects.length - 1; i >= 0; i-- ) {
    
        game.gameObjects.push( this.gameObjects[i].getData( game.graphics ) );
    
      }
    
    }
    
    return game;
  
  },
  
  getSingleData : function() {
  
    var game = { graphics : [], gameObjects : [] }, i;
    
    if ( this.background ) {
      
      game.background = this.background.imagePath;
      
    }
    
    game.gameObjects.push( App.gameObjectsController.current.getSimpleData( game.graphics ) );
    
    return game;
  
  },
  
  getEmptyData : function() {
  
    var game = {};
    
    if ( this.background ) {
      
      game.background = this.background.imagePath;
      
    }
    
    return game;
  
  },
  
  getGameObjectWithID : function( gameObjectID ) {
    
    var gameObjects = this.gameObjects.filterProperty( 'ID', gameObjectID );
    
    if ( gameObjects.length ) {
      
      return gameObjects[0];
      
    }
    
    return null;
    
  },
  
  gameObjectPositionChanged : function( gameObjectID, pos ) {
    
    this.getGameObjectWithID( gameObjectID ).position.copy( pos );
    
  },
  
  checkWin : function( game ) {
    
    var g, b, i, j, k;
    
    if ( game.gameObjects ) {
      
      for ( k = 0; k < game.gameObjects.length; k++ ) {
    
        g = game.gameObjects[k];
    
        for ( i = 0; i < g.behaviours.length; i++ ) {
      
          b = g.behaviours[i];
        
          for ( j = 0; j < b.actions.length; j++ ) {
          
            if ( b.actions[j].type === 'win' ) {
            
              return true;
            
            }
          
          }
      
        }
      
      }
    
    }
    
    return false;
    
  },
  
  removeGameObject : function( gameObject ) {
    
    var obj, i, j;
    
    for ( i = 0; i < this.gameObjects.length; i++ ) {
      
      obj = this.gameObjects[i];
      
      obj.startBehaviour.removeGameObject( gameObject );
      
      for ( j = 0; j < obj.behaviours.length; j++ ) {
      
        obj.behaviours[j].removeGameObject( gameObject );
      
      }
      
    }
    
    this.gameObjects.removeObject( gameObject );
    
  },
  
  setDuration : function( value ) {
    
    this.set( 'duration', value );
    
  }
  
});
