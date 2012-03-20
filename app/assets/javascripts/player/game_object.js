var GameObject = function( ID ) {
  
  this.ID = ID;
  this.position = new Vector();
  this.startPosition = new Vector();
  
  this.target = null;
  
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
    
    if ( this.target ) {
      
      var vector = this.vector,
        distance = dt * 0.1;
      
      vector.copy( this.target ).subSelf( this.position );
      
      if ( vector.norm() < distance ) {
      
        this.position.copy( this.target );
        
        this.target = null;
      
      } else {
      
        vector.normalizeSelf().mulSelf( distance );
      
        this.position.addSelf( vector );
      
      }
      
    }
    
  },
  
  draw : function( ctx ) {
    
    ctx.drawImage( this.image, this.position.x, this.position.y );
    
    if ( ctx.debug ) {
      
      ctx.strokeRect( this.position.x, this.position.y, this.image.width, this.image.height );
      
      if ( this.target ) {
        
        ctx.beginPath();
        ctx.moveTo( this.position.x, this.position.y );
        ctx.lineTo( this.target.x, this.target.y );
        ctx.closePath();
        
        ctx.stroke();
        
      }
      
    }
    
  },
  
  setPosition : function( pos ) {
    
    this.position.copy( pos );
    
  },

  setTarget : function( pos ) {
    
    this.target = pos;
    
  },
  
  vector : new Vector
  
};