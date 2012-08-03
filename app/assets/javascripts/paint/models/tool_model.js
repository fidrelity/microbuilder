var ToolModel = Ember.Object.extend({
  
  mousedown : function( _mouse, _screenCtx, _toolCtx, _size ) {},
  mousemove : function( _mouse, _screenCtx, _toolCtx, _size ) {},
  mouseup : function( _mouse, _screenCtx, _toolCtx, _size ) {}
  
});

var PencilToolModel = ToolModel.extend({

  oldX : 0,
  oldY : 0,
  
  mousedown : function( _mouse, _screenCtx, _toolCtx, _size ) {
    
    this.oldX = _mouse.x;
    this.oldY = _mouse.y;
    
  },
  
  mousemove : function( _mouse, _screenCtx, _toolCtx, _size ) {
    
    _screenCtx.drawLine( _mouse.x, _mouse.y, this.oldX, this.oldY );
    
    this.oldX = _mouse.x;
    this.oldY = _mouse.y;
    
  }

});

var PipetteToolModel = ToolModel.extend({
  
  mouseup : function( _mouse, _screenCtx, _toolCtx, _size ) {
    
    var p = _screenCtx.getImageData( _mouse.x, _mouse.y, 1, 1 ).data;
    App.paintController.set( 'color', rgbToHex( p[0], p[1], p[2] ) )
    
  }
  
});