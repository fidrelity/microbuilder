var Mouse = function( player, canvas ) {
  
  this.canvas = canvas;
  this.player = player;
  
  this.clicked = false;
  this.dragging = false;
  
  this._pos = new Vector();
  this.pos = new Vector();
  this.move = new Vector();
  
  this.area = new Area( 0, 0, 640, 390 );
  
  this.mode;
  
}

Mouse.prototype = {
  
  handleClick : function() {
    
    if ( this.mode === 'click' ) {
      
      return;
      
    }
    
    this.mode = 'click';
    
    $( this.canvas ).unbind( 'mousedown' );
    $( this.canvas ).unbind( 'mousemove' );
    $( this.canvas ).unbind( 'mouseup' );
    
    $( this.canvas ).mousedown( bind( this, this.click ) );
    
  },
  
  handleDrag : function() {
    
    if ( this.mode === 'drag' ) {
      
      return;
      
    }
    
    this.mode = 'drag';
    
    $( this.canvas ).unbind( 'mousedown' );
    
    $( this.canvas ).mousedown( bind( this, this.mousedown ) );
    $( this.canvas ).mousemove( bind( this, this.mousemove ) );
    $( this.canvas ).mouseup( bind( this, this.mouseup ) );
    
  },
  
  click : function( e ) {
    
    this.setMouse( e, this._pos );
    
    if ( this.area.contains( this._pos ) ) {
    
      this.pos.copy( this._pos );
    
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
      i = this.player.increment;
    
    mouse.set( e.pageX - offset.left, e.pageY - offset.top );
    
    mouse.mulSelf( this.player.scale );
    
    mouse.x -= i.x + 1;
    mouse.y -= i.y + 1;
    
  }
  
};