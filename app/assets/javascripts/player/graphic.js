var Graphic = function( ID ) {
  
  this.ID = ID;
  
  this.image = null;
  
  this.frameWidth = 0;
  this.frameHeight = 0;
  
  this.frameCount = 1;
  
};

Graphic.prototype = {
  
  draw : function( ctx, frame ) {
    
    var width = this.frameWidth,
      height = this.frameHeight;
    
    ctx.drawImage( 
      this.image, 
      ( frame - 1 ) * width, 0, width, height, 
      -0.5 * width, -0.5 * height, width, height 
    );
    
  },
  
  checkSize : function() {
    
    var img = this.image;
    
    if ( this.frameWidth * this.frameCount !== img.width || this.frameHeight !== img.height ) {
      
      console.error( 'graphic size and image size is not the same', this, img.width, img.height );
      
    }
    
  }
  
};