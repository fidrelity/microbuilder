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
    
    if ( this.background ) {
      
      game.background = this.background.imagePath;
      graphicIDs.push( this.background.ID );
      
    }
    
    if ( this.gameObjects.length ) {
      
      game.gameObjects = [];
    
      for ( i = 0; i < this.gameObjects.length; i++ ) {
    
        game.gameObjects.push( this.gameObjects[i].getData( graphics ) );
    
      }
    
    }
    
    for ( i = 0; i < graphics.length; i++ ) {
  
      graphicIDs.push( graphics[i].ID );
  
    }
    
    game.graphics = graphics;
    
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
    
      for ( i = 0; i < this.gameObjects.length; i++ ) {
    
        game.gameObjects.push( this.gameObjects[i].getData( game.graphics ) );
    
      }
    
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
  
  duplicateGameObject : function( gameObject ) {
    
    this.gameObjects.addObject( gameObject.clone() );
    
  },
  
  setDuration : function( value ) {
    
    this.set( 'duration', value );
    
  }
  
});
