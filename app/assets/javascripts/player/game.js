var Game = function( player, mouse ) {
  
  this.player = player;
  this.mouse = player.mouse;
  
  this.background = null;
  
  this.graphics = [];
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
      
      this.startActions[i].execute( this );
      
    }
    
  },
  
  update : function( dt ) {
    
    for ( var i = 0; i < this.behaviours.length; i++ ) {
      
      this.behaviours[i].check( this );
      
    }
    
    for ( var i = 0; i < this.gameObjects.length; i++ ) {
      
      this.gameObjects[i].update( dt );
      
    }
    
  },
  
  draw : function( ctx ) {
    
    var i;
    
    if ( this.background ) {
    
      ctx.drawImage( this.background, 0, 0 );
    
    } else {
      
      ctx.fillStyle = '#FFF';
      ctx.fillRect( 0, 0, 640, 390 );
      
    }
    
    
    if ( ctx.debug ) {
    
      for ( i = 0; i < this.behaviours.length; i++ ) {
      
        this.behaviours[i].draw( ctx );
      
      }
    
    }
    
    ctx.fillStyle = '#AAA';
    ctx.strokeStyle = '#AAA';
    
    for ( i = 0; i < this.gameObjects.length; i++ ) {
      
      this.gameObjects[i].draw( ctx );
      
    }
    
    if ( ctx.debug ) {
      
      ctx.fillCircle( this.mouse.pos.x, this.mouse.pos.y, 3 );
      
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
    
  },
  
  getGraphicWithID : function( graphicID ) {
    
    for ( var i = 0; i < this.graphics.length; i++ ) {
      
      if ( this.graphics[i].ID === graphicID ) {
        
        return this.graphics[i];
        
      }
      
    }
    
    console.error( "no gameObject with ID " + graphicID );
    
    return null;
    
  },
  
  getGameObjectAt : function( pos ) {
    
    for ( var i = this.gameObjects.length - 1; i >= 0 ; i-- ) {
      
      if ( this.gameObjects[i].getArea().contains( pos ) ) {
        
        return this.gameObjects[i];
        
      }
      
    }
    
    return null;
    
  }
  
};