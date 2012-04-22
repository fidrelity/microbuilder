var Graphic = function( ID ) {
  
  this.ID = ID;
  
  this.image = null;
  
  this.frameCount = 1;
  
};

Graphic.prototype = {
  
  draw : function( ctx, frame ) {
    
    var img = this.image,
      width = img.width / this.frameCount,
      height = img.height;
    
    ctx.drawImage( img, 0, 0, width, height, frame * width, 0, width, height );
    
    if ( ctx.debug ) {
      
      ctx.strokeRect( 0, 0, width, height );
      
    }
    
  }
  
};