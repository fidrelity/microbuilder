var Game = function( player, mouse ) {
  
  this.player = player;
  this.mouse = player.mouse;
  
  this.background = null;
  
  this.graphics = [];
  this.gameObjects = [];
  this.behaviours = [];
  
  this.startActions = [];
  
  this.time = 0;
  this.timePlayed = 0;
  
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
    
    this.time = 0;
    this.timePlayed = 0;
    
  },
  
  update : function() {
    
    var dt;
      t = new Date().getTime();
        
    dt = t - this.time;
    dt = dt > 30 ? 30 : dt;
    
    this.time = t;
    
    for ( var i = 0; i < this.behaviours.length; i++ ) {
      
      this.behaviours[i].check( this );
      
    }
    
    for ( var i = 0; i < this.gameObjects.length; i++ ) {
      
      this.gameObjects[i].update( dt );
      
    }
    
    this.timePlayed += dt;
    
  },
  
  draw : function( ctx ) {
    
    if ( this.background ) {
    
      ctx.drawImage( this.background, 0, 0 );
    
    } else {
      
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect( 0, 0, 640, 390 );
      
    }
    
    for ( var i = 0; i < this.gameObjects.length; i++ ) {
      
      this.gameObjects[i].draw( ctx );
      
    }
    
    if ( ctx.debug ) {
        
        ctx.fillStyle = '#000';
        ctx.fillRect( this.mouse.pos.x - 5, this.mouse.pos.y - 5 , 10, 10 );
        
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
  
  win : function() {
    
    this.player.fsm.win();
    
  },
  
  lose : function() {
    
    this.player.fsm.lose();
    
  }
  
};