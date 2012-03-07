var Parser = {
  
  parseData : function( data, game, callback ) {
    
    var loader = new Loader( callback );
    
    if ( data.background ) {
    
      game.background = loader.loadImage( data.background );
    
    }
    
    if ( data.gameObjects ) {
    
      for ( var i = 0; i < data.gameObjects.length; i++ ) {
      
        var obj = data.gameObjects[i],
            gameObj = new GameObject();
      
        gameObj.setPosition( obj.position.x, obj.position.y );
      
        gameObj.image = loader.loadImage( obj.imagePath );
      
        game.gameObjects.push( gameObj );
      
      }
    
    }
    
    loader.checkRemaining();
    
  }
  
};