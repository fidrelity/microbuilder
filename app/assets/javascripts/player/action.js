var JumpToAction = function() {
  
  this.gameObject = null;
  this.position = null;
  
};

JumpToAction.prototype = {
  
  execute : function() {
    
    this.gameObject.setPosition( this.position );
    
  }
  
};