var Mouse = function( canvas ) {
  
  this.canvas = canvas;
  this.clicked = false;
  
  this.start = new Vector();
  this.pos = new Vector();
  
}

Mouse.prototype = {
  
  handleClick : function() {
    
    var self = this;
    
    $( this.canvas ).click( function( e ) {
        
        self.click( e );
        
    });
    
  },
  
  click : function( e ) {
    
    var offset = $( this.canvas ).offset();
    
    if ( this.canvas.width === 640 ) {
      
      this.pos.set( e.pageX - offset.left, e.pageY - offset.top );
      
    } else {
      
      this.pos.set( e.pageX - offset.left - 128, e.pageY - offset.top - 128 );
      
    }
    
    this.clicked = true;
    
    e.stopPropagation();
    
  }
  
};