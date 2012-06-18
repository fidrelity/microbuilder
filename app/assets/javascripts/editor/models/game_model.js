var GameModel = Ember.Object.extend({
  
  title : '',
  instructions : '',
  
  background : null,
  
  gameObjects : [],
  gameObjectCounter : 1,
  
  duration : 5,
  
  setBackground : function( graphic ) {
    
    this.set( 'background', graphic );
    
  },
  
  setDuration : function( value ) {
    
    this.set( 'duration', value );
    
  },
  
  getData : function() {
    
    var game = { version : 1 }, graphics = [], i;
    
    game.title = this.title;
    game.instructions = this.instructions;
    game.duration = this.duration;
    
    if ( this.background ) {
      
      game.backgroundID = this.background.ID;
      graphics.push( this.background );
      
    }
    
    if ( this.gameObjects.length ) {
      
      game.gameObjects = [];
      
      for ( i = this.gameObjects.length - 1; i >= 0; i-- ) {
        
        game.gameObjects.push( this.gameObjects[i].getData( graphics ) );
        
      }
      
    }
    
    if ( graphics.length ) {
      
      graphics = graphics.uniq();
      game.graphics = [];
      
      for ( i = 0; i < graphics.length; i++ ) {
        
        game.graphics.push( graphics[i].getData() );
        
      }
      
    }
    
    return game;
    
  },
  
  checkWin : function( game ) {
    
    var g, b, i, j, k;
    
    if ( game.gameObjects ) {
      
      for ( k = 0; k < game.gameObjects.length; k++ ) {
    
        g = game.gameObjects[k];
    
        for ( i = 0; i < g.behaviours.length; i++ ) {
      
          b = g.behaviours[i];
        
          for ( j = 0; j < b.actions.length; j++ ) {
          
            if ( b.actions[j].ID === 'gameWin' ) {
            
              return true;
            
            }
          
          }
      
        }
      
      }
    
    }
    
    return false;
    
  }
  
});
