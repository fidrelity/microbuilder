var Graphic = function( ID ) {
  
  this.ID = ID;
  
  this.image = null;
  
  this.frameWidth = 0;
  this.frameHeight = 0;
  
  this.frameCount = 1;

  this.scaleX = 1;
  this.scaleY = 1;

  this.flipDirectionX = 1
  this.flipDirectionY = 1
  
};

Graphic.prototype = {
  
  draw : function( ctx, frame ) {
    
    var width = this.frameWidth,
      height = this.frameHeight;
    
    ctx.save();
    
      ctx.scale(this.scaleX * this.flipDirectionX, this.scaleY * this.flipDirectionY);

      ctx.drawImage( 
        this.image, 
        ( frame - 1 ) * width, 0, width, height, 
        -0.5 * width, -0.5 * height, width, height 
      );

    ctx.restore();
    
  },
  
  checkSize : function() {
    
    var img = this.image;
    
    if ( this.frameWidth * this.frameCount !== img.width || this.frameHeight !== img.height ) {
      
      console.error( 'graphic size and image size is not the same', this, img.width, img.height );
      
    }
    
  },

  reset : function() {

    this.scaleX = this.scaleY = 1;
    this.flipDirectionX = this.flipDirectionY = 1;

  }
  
};