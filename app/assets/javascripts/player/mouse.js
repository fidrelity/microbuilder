var Mouse = function( canvas ) {
  
  this.canvas = canvas;
  
  this.clicked = false;
  this.dragging = false;
  
  this.start = new Vector();
  this.pos = new Vector();
  
}

Mouse.prototype = {
  
  handleClick : function() {
    
    $( this.canvas ).click( bind( this, this.click ) );
    
    $( this.canvas ).unbind( 'mousedown' );
    $( this.canvas ).unbind( 'mousemove' );
    $( this.canvas ).unbind( 'mouseup' );
    
  },
  
  handleDrag : function() {
    
    $( this.canvas ).mousedown( bind( this, this.mousedown ) );
    $( this.canvas ).mousemove( bind( this, this.mousemove ) );
    $( this.canvas ).mouseup( bind( this, this.mouseup ) );
    
    $( this.canvas ).unbind( 'click' );
    
  },
  
  click : function( e ) {
    
    this.setMouse( e, this.pos );
    
    this.clicked = true;
    
    e.stopPropagation();
    
  },
  
  mousedown : function( e ) {
    
    this.setMouse( e, this.pos );
    this.start.copy( this.pos );
    
    this.dragging = true;
    
    e.stopPropagation();
    
  },
  
  mousemove : function( e ) {
    
    if ( this.dragging ) {
    
      this.setMouse( e, this.pos );
    
    }
    
    e.stopPropagation();
    
  },
  
  mouseup : function( e ) {
    
    this.setMouse( e, this.pos );
    
    this.dragging = false;
    
    e.stopPropagation();
    
  },
  
  setMouse : function( e, mouse ) {
    
    var offset = $( this.canvas ).offset();
    
    if ( this.canvas.width === 640 ) {
      
      mouse.set( e.pageX - offset.left, e.pageY - offset.top );
      
    } else {
      
      mouse.set( e.pageX - offset.left - 128, e.pageY - offset.top - 128 );
      
    }
    
  }
  
};