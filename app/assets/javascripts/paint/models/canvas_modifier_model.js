var CanvasModifierModel = {
  
  flipVertical : function( _ctx, _imageData, _width, _height ) { 
    
    return this.transpose( _ctx, _imageData, _width, _height, 1, -1, 0, _height, 0 );
    
  },
  
  flipHorizontal : function( _ctx, _imageData, _width, _height ) {     
    
    return this.transpose( _ctx, _imageData, _width, _height, -1, 1, _width, 0, 0 );
    
  },
  
  rotateLeft : function( _ctx, _imageData, _width, _height ) {     
    
    return this.transpose( _ctx, _imageData, _width, _height, 1, 1, 0, 0, -Math.PI / 2 );
    
  },
  
  rotateRight : function( _ctx, _imageData, _width, _height ) {     
    
    return this.transpose( _ctx, _imageData, _width, _height, 1, 1, 0, 0, Math.PI / 2 );
    
  },
  
  transpose : function( _ctx, _imageData, _width, _height, _scaleX, _scaleY, _transX, _transY, _rotation ) { 
    
    _ctx.clearRect( 0, 0, _width, _height );
    
    _ctx.save();
    
    _ctx.translate( _transX, _transY );
    _ctx.scale( _scaleX, _scaleY );
    
    _ctx.translate( Math.floor( _width / 2 ), Math.floor( _height / 2 ) );
    _ctx.rotate( _rotation );
    _ctx.translate( -Math.floor( _width / 2 ), -Math.floor( _height / 2 ) );
    
    _ctx.putImageDataOverlap( _imageData, 0, 0 );
    
    _ctx.restore();
    
    return _ctx.getImageData( 0, 0, _width, _height );
    
  }
  
};