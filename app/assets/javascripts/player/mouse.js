var Mouse = function( player, canvas ) {
  
  this.canvas = canvas;
  this.player = player;
  
  this.clicked = false;
  this.dragging = false;
  
  this._pos = new Vector();
  this.pos = new Vector();
  this.move = new Vector();
  
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
    
    this.player.click( this );
    
  },
  
  mousedown : function( e ) {
    
    this.setMouse( e, this.pos );
    this._pos.copy( this.pos );
    
    this.dragging = true;
    
    this.player.mousedown( this );
    
    e.stopPropagation();
    
  },
  
  mousemove : function( e ) {
    
    if ( this.dragging ) {
    
      this._pos.copy( this.pos );
      this.setMouse( e, this.pos );
      this.move.copy( this.pos ).subSelf( this._pos );
      
      this.player.mousemove( this );
    
    }
    
    e.stopPropagation();
    
  },
  
  mouseup : function( e ) {
    
    this.setMouse( e, this.pos );
    
    this.dragging = false;
    
    this.player.mouseup( this );
    
    e.stopPropagation();
    
  },
  
  setMouse : function( e, mouse ) {
    
    var offset = $( this.canvas ).offset(),
      i = this.player.edit ? this.player.increment : 0;
    
    mouse.set( e.pageX - offset.left - i, e.pageY - offset.top - i );
    
  }
  
};