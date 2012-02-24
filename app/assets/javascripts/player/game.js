var Game = function() {
  
};

Game.prototype = {
  
  background : null,
  
  gameObjects : [],
  
  init : function() {},
  
  reset : function() {},
  
  update : function( dt ) {
    
    for ( var i = 0; i < this.gameObjects.length; i++ ) {
      
      this.gameObjects[i].update( dt );
      
    }
    
  },
  
  draw : function( ctx ) {
    
    ctx.drawImage( this.background, 0, 0 );
    
    for ( var i = 0; i < this.gameObjects.length; i++ ) {
      
      this.gameObjects[i].draw( ctx );
      
    }
    
  }
  
};