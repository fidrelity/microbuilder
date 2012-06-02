var Mouse = function( player, canvas ) {
  
  this.canvas = canvas;
  this.player = player;
  
  this.clicked = false;
  this.dragging = false;
  
  this._pos = new Vector();
  this.pos = new Vector();
  this.move = new Vector();
  
  this.canvasArea = new Area( 0, 0, 640, 390 );
  
  this.mode;
  
}

Mouse.prototype = {
  
  handleClick : function() {
    
    if ( this.mode === 'click' ) {
      
      return;
      
    }
    
    this.mode = 'click';
    
    $( this.canvas ).click( bind( this, this.click ) );
    
    $( this.canvas ).unbind( 'mousedown' );
    $( this.canvas ).unbind( 'mousemove' );
    $( this.canvas ).unbind( 'mouseup' );
    
  },
  
  handleDrag : function() {
    
    if ( this.mode === 'drag' ) {
      
      return;
      
    }
    
    this.mode = 'drag';
    
    $( this.canvas ).mousedown( bind( this, this.mousedown ) );
    $( this.canvas ).mousemove( bind( this, this.mousemove ) );
    $( this.canvas ).mouseup( bind( this, this.mouseup ) );
    
    $( this.canvas ).unbind( 'click' );
    
  },
  
  click : function( e ) {
    
    this.setMouse( e, this.pos );
    
    if ( this.canvasArea.contains( this.pos ) ) {
    
      this.clicked = true;
    
      this.player.click( this );
    
    }
    
    e.stopPropagation();
    
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
    
    mouse.set( e.pageX - offset.left, e.pageY - offset.top );
    
    if ( this.player.half ) {
      
      mouse.mulSelf( 2 );
      
    }
    
    mouse.x -= i;
    mouse.y -= i;
    
  }
  
};