var GameObject = function() {
  
  this.setPosition( 0, 0 );
  
  this.id = null;
  
  this.image = null;
  this.filename = '';
  
};

GameObject.prototype = {
  
  init : function() {},
  
  update : function( dt ) {
    
  },
  
  draw : function( ctx ) {
    
    ctx.drawImage( this.image, this.position.x, this.position.y );
    
  },
  
  setPosition : function( x, y ) {
    
    this.position = new Vector( x, y );
    this.startPosition = new Vector( x, y );
    
  }
  
};