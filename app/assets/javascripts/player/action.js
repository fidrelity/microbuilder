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
    
    if ( this.random ) {
      
      this.gameObject.setDirection( Math.random() * Math.PI * 2 );
      
    } else if ( this.direction !== null ) {
      
      this.gameObject.setDirection( this.direction );
      
    } else {
      
      this.gameObject.setDirection( this.target.sub( this.gameObject.position ).angle() );
      
    }
    
  }
  
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
  
  this.gameObject = null;
  this.graphic = null;
  
};

ArtAction.prototype = {
  
  execute : function() {
    
    this.gameObject.setGraphic( this.graphic );
    
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
