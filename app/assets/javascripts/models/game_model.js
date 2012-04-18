var GameModel = Ember.Object.extend({
  
  title : null,
  instructions : null,
  
  background : null,
  
  gameObjects : [],
  gameObjectCounter : 0,
  
  behaviours : [],
  startBehaviour : null,
  
  init : function() {
    
    this.startBehaviour = BehaviourModel.create();
    this.startBehaviour.addTrigger( StartTriggerModel.create() );
    
  },
  
  setBackground : function( graphic ) {
    
    this.set( 'background', graphic );
    
  },
  
  getData : function() {
    
    var game = {},
        graphics = [],
        graphicIDs = [],
        win = false,
        b, i;
    
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
    
    
    game.behaviours = [];
    
    b = this.startBehaviour.getData( graphics );
    
    if ( b ) {

      game.behaviours.push( b );

    }
  
    for ( i = 0; i < this.behaviours.length; i++ ) {
  
      b = this.behaviours[i].getData( graphics );
  
      if ( b ) {
        
        game.behaviours.push( b );
  
        if ( b.actions ) {

          for ( i = 0; i < b.actions.length; i++ ) {
        
            if ( b.actions[i].type === 'win' ) {
            
                win = true;
            
            }
        
          }
      
        }
      
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
  
  gameObjectPositionChanged : function( gameObjectID, pos ) {
    
    var gameObjects = this.gameObjects.filterProperty( 'ID', gameObjectID );
    
    if ( gameObjects.length ) {
      
      gameObjects[0].position.copy( pos );
      
    }
    
  }
  
});
