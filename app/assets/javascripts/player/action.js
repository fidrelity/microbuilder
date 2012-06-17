var MoveAction = function( type, gameObject, speed ) {
  
  this.gameObject = gameObject;
  this.speed = speed;
  
  this.target = null;
  this.offset = new Vector();
  this.area = null;
  
  this.random = false;
  this.direction = null;
  
  if ( type === 'moveIn' ) {
    
    this.execute = this.executeMoveIn;
    
  } else if ( type === 'moveTo' ) {
    
    this.execute = this.executeMoveTo;
    
  } else if ( type === 'jumpTo' ) {
    
    this.execute = this.executeJumpTo;
    
  }
  
};

MoveAction.prototype = {
  
  execute : null,
  
  executeJumpTo : function() {
    
    if ( this.area ) {
      
      this.gameObject.movement.jump( this.area );
      
    } else {
    
      this.gameObject.movement.setPosition( this.target.add( this.offset ) );
      
    }
    
  },
  
  executeMoveTo : function() {
    
    this.gameObject.movement.setTarget( this.target, this.offset, this.speed );
    
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
    
    this.gameObject.movement.setDirection( dir, this.speed );
    
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


var ArtAction = function( type, gameObject, frame, frame2, mode, speed ) {
  
  this.gameObject = gameObject;
  
  this.frame = frame;
  this.frame2 = frame2;
  
  this.mode = mode; // ['loop', 'ping-pong', 'once']
  this.speed = speed;
  
  this.graphic;
  
  if ( type === 'frame' ) {
    
    this.execute = this.executeFrame;
    
  } else if ( type === 'play' ) {
    
    this.execute = this.executePlay;
    
  } else if ( type === 'stop' ) {
    
    this.execute = this.executeStop;
    
  } else if ( type === 'change' ) {
    
    this.execute = this.executeChange;
    
  }
  
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
    
  }
  
};

var LoseAction = {
  
  execute : function( game ) {
    
    game.player.fsm.lose();
    
  }
  
};
