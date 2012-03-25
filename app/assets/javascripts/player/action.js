var MoveAction = function() {
  
  this.gameObject = null;
  this.target = null;
  
};

MoveAction.prototype = {
  
  execute : null,
  
  executeJumpTo : function() {
    
    this.gameObject.setPosition( this.target );
    
  },
  
  executeMoveTo : function() {
    
    this.gameObject.setTarget( this.target );
    
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
    
    game.win();
    
  }
  
};

var LoseAction = {
  
  execute : function( game ) {
    
    game.lose();
    
  }
  
};
