var Game = function() {
  
  this.background = null;
  
  this.gameObjects = [];
  
};

Game.prototype = {
  
  init : function() {},
  
  reset : function() {},
  
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
    
  }
  
};