var MoveAction = function() {
  
  this.gameObject = null;
  this.target = null;
  this.area = null;
  
  this.random = false;
  this.direction = null;
  
  this.speed;
  
};

MoveAction.prototype = {
  
  execute : null,
  
  executeJumpTo : function() {
    
    if ( this.area) {
      
      this.gameObject.movement.jump( this.area );
      
    } else {
    
      this.gameObject.setPosition( this.target );
      
    }
    
  },
  
  executeMoveTo : function() {
    
    this.gameObject.setTarget( this.target, this.speed );
    
  },
  
  executeMoveIn : function() {
    
    var dir;
    
    if ( this.random ) {
      
      dir = Math.random() * Math.PI * 2;
      
    } else if ( this.direction !== null ) {
      
      dir = this.direction;
      
    } else {
      
      dir = this.target.sub( this.gameObject.movement.position ).angle();
      
    }
    
    this.gameObject.setDirection( dir, this.speed );
    
  }
  
};

var RoamAction = function( gameObject, mode, area, speed ) {
  
  this.execute = function() {
    
    gameObject.roam( mode, area, speed );
    
  };
  
};

var SwapAction = function( one, two ) {
  
  this.execute = function() {
    
    var swap = one.clone();
    
    one.copy( two );
    two.copy( swap );
    
  };
  
};

var StopAction = function( gameObject ) {
  
  this.execute = function() {
    
    gameObject.movement.stop();
    
  };
  
};


var ArtAction = function() {
  
  this.gameObject;
  
  this.frame;
  this.frame2;
  
  this.mode; // ['loop', 'ping-pong', 'once']
  this.speed;
  
  this.graphic
  
};

ArtAction.prototype = {
  
  execute : null,
  
  executeFrame : function() {
    
    this.gameObject.setFrame( this.frame );
    
  },
  
  executePlay : function() {
    
    this.gameObject.playAnimation( this.frame, this.frame2, this.mode, this.speed );
    
  },
  
  executeChange : function() {
    
    this.gameObject.setGraphic( this.graphic );
    
  },
  
  executeStop : function() {
    
    this.gameObject.stopAnimation();
    
  }
  
};

var WinAction = {
  
  execute : function( game ) {
    
    game.player.fsm.win();
    game.player.fsm.winTrial();
    
  }
  
};

var LoseAction = {
  
  execute : function( game ) {
    
    game.player.fsm.lose();
    game.player.fsm.loseTrial();
    
  }
  
};
