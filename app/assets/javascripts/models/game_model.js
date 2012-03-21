var GameModel = Ember.Object.extend({
  
  title : null,
  instructions : null,
  
  background : null,
  
  gameObjects : [],
  gameObjectCounter : 0,
  
  behaviours : [],
  
  setBackground : function( graphic ) {
    
    this.set( 'background', graphic );
    
  },
  
  getData : function() {
    
    var data = {},
        i;
    
    if ( this.background ) {
      
      data.background = this.background.imagePath;
      
    }
    
    if ( this.gameObjects.length ) {
      
      data.gameObjects = [];
    
      for ( i = 0; i < this.gameObjects.length; i++ ) {
    
        data.gameObjects.push( this.gameObjects[i].getData() );
    
      }
    
    }
    
    if ( this.behaviours.length ) {
      
      data.behaviours = [];
    
      for ( i = 0; i < this.behaviours.length; i++ ) {
    
        data.behaviours.push( this.behaviours[i].getData() );
    
      }
    
    }
    
    return data;
    
  },
  
});
