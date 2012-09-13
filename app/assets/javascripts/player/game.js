//= require utilities/vector

var Game = function( player, mouse ) {
  
  this.player = player;
  this.mouse = player.mouse;
  
  this.background = null;
  this.duration = 5000;
  
  this.graphics = [];
  this.gameObjects = [];
  this.behaviours = [];
  
  this.startActions = [];
  
  this.isWon = false;
  this.isLost = false;
  
};

Game.prototype = {
  
  init : function() {},
  
  reset : function() {
    
    this.isWon = false;
    this.isLost = false;
    
    this.gameObjects.forEachApply( 'reset' );
    this.behaviours.forEachApply( 'reset' );
    
  },
  
  start : function() {
    
    this.startActions.forEachApply( 'execute', this );
    
  },
  
  update : function( dt ) {
    
    this.behaviours.forEachApply( 'check', this );
    
    this.gameObjects.forEachApply( 'update', dt );
    
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
    
      this.behaviours.forEachApply( 'draw', ctx );
    
    }
    
    ctx.fillStyle = '#AAA';
    ctx.strokeStyle = '#AAA';
    
    this.gameObjects.forEachApply( 'draw', ctx );
    
    if ( ctx.debug ) {
      
      ctx.fillCircle( this.mouse._pos.x, this.mouse._pos.y, 3 );
      
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
    
    console.error( "no graphic with ID " + graphicID );
    
    return null;
    
  },
  
  getGameObjectAt : function( pos ) {
    
    for ( var i = this.gameObjects.length - 1; i >= 0 ; i-- ) {
      
      if ( this.gameObjects[i].getGraphicArea().contains( pos ) ) {
        
        return this.gameObjects[i];
        
      }
      
    }
    
    return null;
    
  }
  
};