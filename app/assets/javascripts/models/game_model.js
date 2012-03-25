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
    
    var data = {},
        graphics = [],
        i;
    
    if ( this.background ) {
      
      data.background = this.background.imagePath;
      
    }
    
    if ( this.gameObjects.length ) {
      
      data.gameObjects = [];
    
      for ( i = 0; i < this.gameObjects.length; i++ ) {
    
        data.gameObjects.push( this.gameObjects[i].getData( graphics ) );
    
      }
    
    }
    
    data.behaviours = [this.startBehaviour.getData()];
  
    for ( i = 0; i < this.behaviours.length; i++ ) {
  
      data.behaviours.push( this.behaviours[i].getData( graphics ) );
  
    }
    
    data.graphics = graphics;
    
    return data;
    
  }
  
});
