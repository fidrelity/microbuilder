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
  
  this.one = one;
  this.two = two;
  
};

SwapAction.prototype = {
  
  execute : function() {
    
    var swap = this.one.clone();
    
    this.one.copy( this.two );
    this.two.copy( swap );
    
  }
  
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
