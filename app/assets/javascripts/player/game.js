var Game = function( fsm ) {
  
  this.fsm = fsm;
  
  this.background = null;
  
  this.graphics = [];
  this.gameObjects = [];
  this.behaviours = [];
  
  this.startActions = [];
  
  this.time = 0;
  this.timePlayed = 0;
  
  this.mouse = null;
  
  this.debug = true;
  this.debugMouse = new Vector();
  
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
    
    this.mouse = null;
    
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
    
    if ( this.mouse ) {
    
        this.debugMouse.copy( this.mouse );
        this.mouse = null;
    
    }
    
  },
  
  draw : function( ctx ) {
    
    ctx.debug = this.debug;
    
    if ( this.background ) {
    
      ctx.drawImage( this.background, 0, 0 );
    
    } else {
      
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect( 0, 0, 640, 390 );
      
    }
    
    for ( var i = 0; i < this.gameObjects.length; i++ ) {
      
      this.gameObjects[i].draw( ctx );
      
    }
    
    if ( this.debug && this.debugMouse ) {
        
        ctx.fillStyle = '#000';
        ctx.fillRect( this.debugMouse.x - 5, this.debugMouse.y -5 , 10, 10 );
        
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
    
    this.fsm.win();
    
  },
  
  lose : function() {
    
    this.fsm.lose();
    
  },
  
  drawDebug : function() {
    
    this.debug = !this.debug;
    
  }
  
};