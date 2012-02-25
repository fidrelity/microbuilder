var Parser = {
  
  parseData : function( data, game, callback ) {
    
    var loader = new Loader( callback );
    
    game.background = loader.loadImage( data.background );
    
    for ( var i = 0; i < data.gameObjects.length; i++ ) {
      
      var obj = data.gameObjects[i],
          gameObj = new GameObject();
      
      gameObj.setPosition( obj.x, obj.y );
      gameObj.offset = new Vector( obj.oX, obj.oY );
      
      gameObj.image = loader.loadImage( obj.image );
      
      game.gameObjects.push( gameObj );
      
    }
    
  }
  
};