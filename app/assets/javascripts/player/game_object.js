var GameObject = function( ID ) {
  
  this.ID = ID;
  this.position = new Vector();
  this.startPosition = new Vector();
  
  this.image = null;
  this.startImage = null;
  
};

GameObject.prototype = {
  
  init : function() {},
  
  reset : function() {
    
    this.position.copy( this.startPosition );
    this.image = this.startImage;
    
  },
  
  update : function( dt ) {
    
  },
  
  draw : function( ctx ) {
    
    ctx.drawImage( this.image, this.position.x, this.position.y );
    
  },
  
  setPosition : function( pos ) {
    
    this.position.copy( pos );
    
  }
  
};