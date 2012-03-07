var Parser = {
  
  parseData : function( data, game, callback ) {
    
    var loader = new Loader( callback );
    
    if ( data.background ) {
    
      game.background = loader.loadImage( data.background.imagePath );
    
    }
    
    for ( var i = 0; i < data.gameObjects.length; i++ ) {
      
      var obj = data.gameObjects[i],
          gameObj = new GameObject();
      
      gameObj.setPosition( obj.position.x, obj.position.y );
      
      gameObj.image = loader.loadImage( obj.graphic.imagePath );
      
      game.gameObjects.push( gameObj );
      
    }
    
    loader.checkRemaining();
    
  }
  
};