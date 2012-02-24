var Parser = {
  
  parseData : function( data, game, callback ) {
    
    var loader = new Loader( callback );
    
    game.background = loader.loadImage( data.background );
    
    for ( var i = 0; i < data.gameObjects.length; i++ ) {
      
      var obj = data.gameObjects[i];
      
      game.gameObjects.push( new GameObject( 
        new Vector( obj.x, obj.y ), 
        new Vector( obj.oX, obj.oY ),
        loader.loadImage( obj.image )
      ));
      
    }
    
  }
  
};