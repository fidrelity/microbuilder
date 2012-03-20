var JumpToAction = function() {
  
  this.gameObject = null;
  this.target = null;
  
};

JumpToAction.prototype = {
  
  execute : function() {
    
    this.gameObject.setPosition( this.target );
    
  }
  
};

var MoveToAction = function() {
  
  this.gameObject = null;
  this.target = null;
  
};

MoveToAction.prototype = {
  
  execute : function() {
    
    this.gameObject.setTarget( this.target );
    
  }
  
};
