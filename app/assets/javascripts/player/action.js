var MoveAction = function( type, gameObject, speed ) {
  
  this.gameObject = gameObject;
  this.speed = speed;
  
  this.target = null;
  this.offset = new Vector();
  this.area = null;
  
  this.random = false;
  this.direction = null;
  
  this.path = [];
  
  if ( type === 'moveIn' ) {
    
    this.execute = this.executeMoveIn;
    
  } else if ( type === 'moveTo') {
    
    this.execute = this.executeMoveTo;
    
  } else if (type == "moveAlongPath" ) {

    this.execute = this.executePath;
    
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

  executePath : function() {

    this.gameObject.movement.followPath( this.path, this.mode, this.speed );

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
    
    gameObject.movement.roam( mode, area, speed );
    
  };
  
};

var SwapAction = function( objectOne, objectTwo ) {
  
  this.execute = function() {
    
    var one = objectOne.movement.position,
      two = objectTwo.movement.position,
      swap = one.clone();
    
    objectOne.movement.stop();
    objectTwo.movement.stop();
    
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
    
    this.gameObject.animation.setFrame( this.frame );
    
  },
  
  executePlay : function() {
    
    this.gameObject.animation.play( this.frame, this.frame2, this.mode, this.speed );
    
  },
  
  executeChange : function() {
    
    this.gameObject.setGraphic( this.graphic );
    
  },
  
  executeStop : function() {
    
    this.gameObject.animation.stop();
    
  }
  
};

var WinAction = {
  
  execute : function( game ) {
    
    if ( !game.isWon && !game.isLost ) {
      
      game.isWon = true;
      
      game.player.fsm.end();
      
    }
    
  }
  
};

var LoseAction = {
  
  execute : function( game ) {
    
    if ( !game.isWon && !game.isLost ) {
      
      game.isLost = true;
      
      game.player.fsm.end();
      
    }
    
  }
  
};

var CounterAction = function( type, count, gameObject ) {

  this.gameObject = gameObject;
  this.count = count;
  this.type = type;
  
  this.execute = this[type]; // up, down, set
  
  if ( !this[type] ) {
    
    throw "Counter type is unknown: " + type;
    
  }

};

CounterAction.prototype = {
  
  execute : null,
  
  up : function() {
    
    this.gameObject.counter++;
    
  },
  
  down : function() {
    
    this.gameObject.counter--;
    
  },
  
  set : function() {
    
    this.gameObject.counter = this.count;
    
  }
  
};