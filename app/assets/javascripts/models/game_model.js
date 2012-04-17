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
        i;
    
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
    
    game.behaviours = [this.startBehaviour.getData( graphics )];
  
    for ( i = 0; i < this.behaviours.length; i++ ) {
  
      game.behaviours.push( this.behaviours[i].getData( graphics ) );
  
    }
    
    for ( i = 0; i < graphics.length; i++ ) {
  
      graphicIDs.push( graphics[i].ID );
  
    }
    
    game.graphics = graphics;
    
    return {
        game: game,
        graphicIDs: graphicIDs
    };
    
  }
  
});
