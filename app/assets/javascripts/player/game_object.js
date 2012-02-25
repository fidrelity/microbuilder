var GameObject = function() {
  
  this.setPosition( 0, 0 );
  
  this.id = null;
  
  this.offset = null;
  
  this.image = null;
  this.filename = '';
  
};

GameObject.prototype = {
  
  init : function() {},
  
  update : function( dt ) {
    
    this.offset.rotateSelf( 0.04 );
    
  },
  
  draw : function( ctx ) {
    
    var pos = new Vector( this.image.width, this.image.height ).mulSelf( -0.5 );
    
    pos.addSelf( this.offset ).addSelf( this.position );
    
    ctx.drawImage( this.image, pos.x, pos.y );
    
  },
  
  setPosition : function( x, y ) {
    
    this.position = new Vector( x, y );
    this.startPosition = new Vector( x, y );
    
  }
  
};