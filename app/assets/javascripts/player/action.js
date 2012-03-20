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
  this.image = null;
  
};

ArtAction.prototype = {
  
  execute : function() {
    
    this.gameObject.setImage( this.image );
    
  }
  
};
