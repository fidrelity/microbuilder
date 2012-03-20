var Game = function() {
  
  this.background = null;
  
  this.gameObjects = [];
  this.behaviours = [];
  
  this.startActions = [];
  
};

Game.prototype = {
  
  init : function() {},
  
  reset : function() {
    
    for ( var i = 0; i < this.gameObjects.length; i++ ) {
      
      this.gameObjects[i].reset();
      
    }
    
    for ( var i = 0; i < this.startActions.length; i++ ) {
      
      this.startActions[i].execute();
      
    }
    
  },
  
  update : function( dt ) {
    
    for ( var i = 0; i < this.gameObjects.length; i++ ) {
      
      this.gameObjects[i].update( dt );
      
    }
    
  },
  
  draw : function( ctx ) {
    
    if ( this.background ) {
    
      ctx.drawImage( this.background, 0, 0 );
    
    }
    
    for ( var i = 0; i < this.gameObjects.length; i++ ) {
      
      this.gameObjects[i].draw( ctx );
      
    }
    
  },
  
  getGameObjectWithID : function( gameObjectID ) {
    
    for ( var i = 0; i < this.gameObjects.length; i++ ) {
      
      if ( this.gameObjects[i].ID === gameObjectID ) {
        
        return this.gameObjects[i];
        
      }
      
    }
    
    console.error( "no gameObject with ID " + gameObjectID );
    
    return null;
    
  }
  
};