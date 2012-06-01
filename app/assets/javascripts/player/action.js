var MoveAction = function() {
  
  this.gameObject = null;
  this.target = null;
  
  this.random = false;
  this.direction = null;
  
};

MoveAction.prototype = {
  
  execute : null,
  
  executeJumpTo : function() {
    
    this.gameObject.setPosition( this.target );
    
  },
  
  executeMoveTo : function() {
    
    this.gameObject.setTarget( this.target );
    
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
    
    this.gameObject.setDirection( dir );
    
  }
  
};

var RoamAction = function( gameObject, mode, area ) {
  
  this.execute = function() {
    
    gameObject.roam( mode, area );
    
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
    
    gameObject.stop();
    
  };
  
};


var ArtAction = function() {
  
  this.gameObject;
  
  this.frame;
  this.frame2;
  
  this.mode; // ['loop', 'ping-pong', 'once']
  this.speed;
  
};

ArtAction.prototype = {
  
  execute : null,
  
  executeFrame : function() {
    
    this.gameObject.setFrame( this.frame );
    
  },
  
  executePlay : function() {
    
    this.gameObject.playAnimation( this.frame, this.frame2, this.mode, this.speed );
    
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
