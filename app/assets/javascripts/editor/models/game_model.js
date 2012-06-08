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
  
  setDuration : function( value ) {
    
    this.set( 'duration', value );
    
  }
  
  getData : function() {
    
    var game = { duration: this.duration, graphics : [] },
        graphicIDs = [], i;
    
    game.title = this.title;
    game.instructions = this.instructions;
    
    if ( this.background ) {
      
      game.backgroundID = this.background.ID;
      graphicIDs.push( this.background.ID );
      
    }
    
    if ( this.gameObjects.length ) {
      
      game.gameObjects = [];
    
      for ( i = this.gameObjects.length - 1; i >= 0; i-- ) {
    
        game.gameObjects.push( this.gameObjects[i].getData( graphicIDs ) );
    
      }
    
    }
    
    graphicIDs = graphicIDs.uniq();
    
    for ( i = 0; i < graphicIDs.length; i++ ) {
      
      game.graphics.push( App.libraryController.getGraphic( graphicIDs[i] ).getData() );
      
    }
    
    return {
      game : game,
      graphicIDs : graphicIDs,
      win : this.checkWin( game )
    };
    
  },
  
  getGameObjectsData : function() {
  
    return this.getData().game;
  
    // var game = { graphics : [], gameObjects : [] }, i;
    // 
    // if ( this.background ) {
    //   
    //   game.background = this.background.imagePath;
    //   
    // }
    // 
    // if ( this.gameObjects.length ) {
    // 
    //   for ( i = this.gameObjects.length - 1; i >= 0; i-- ) {
    // 
    //     game.gameObjects.push( this.gameObjects[i].getData( game.graphics ) );
    // 
    //   }
    // 
    // }
    // 
    // return game;
  
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
    
  }
  
});
