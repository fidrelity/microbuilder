var GameObject = function( position, offset, image ) {
  
  this.position = position;
  this.offset = offset;
  
  this.image = image;
  
};

GameObject.prototype = {
  
  update : function( dt ) {
    
    this.offset.rotateSelf( 0.04 );
    
  },
  
  draw : function( ctx ) {
    
    var pos = new Vector( this.image.width, this.image.height ).mulSelf( -0.5 );
    
    pos.addSelf( this.offset ).addSelf( this.position );
    
    ctx.drawImage( this.image, pos.x, pos.y );
    
  }
  
};