var Graphic = function( ID ) {
  
  this.ID = ID;
  
  this.image = null;
  
  this.frameWidth = 0;
  this.frameHeight = 0;
  
  this.frameCount = 1;
  
  this.canvas = null;
  
};

Graphic.prototype = {
  
  init : function() {
    
    var img = this.image, canvas, ctx;
    
    if ( this.frameWidth * this.frameCount !== img.width || this.frameHeight !== img.height ) {
      
      console.error( 'graphic size and image size is not the same', this, img.width, img.height );
      return;
      
    }
    
    canvas = document.createElement( 'canvas' );
    canvas.width = this.frameWidth * this.frameCount;
    canvas.height = this.frameHeight;
    
    ctx = canvas.getContext( '2d' );
    ctx.drawImage( img, 0, 0 );
    
    this.canvas = canvas;
    
  },
  
  draw : function( ctx, frame ) {
    
    var width = this.frameWidth,
      height = this.frameHeight;
    
    ctx.drawImage( 
      this.canvas,
      ( frame - 1 ) * width, 0, width, height,
      -0.5 * width, -0.5 * height, width, height
    );
    
  },
  
  drawImage : function( ctx ) {
    
    ctx.drawImage( this.canvas, 0, 0 );
    
  }
  
};