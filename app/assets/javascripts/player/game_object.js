var GameObject = function( ID ) {
  
  this.ID = ID;
  this.position = new Vector();
  this.startPosition = new Vector();
  
  this.target = null;
  
  this.graphic = null;
  this.startGraphic = null;
  
  this.animationFrame = 0;
  
  this.area = new Area();
  
};

GameObject.prototype = {
  
  init : function() {},
  
  reset : function() {
    
    this.position.copy( this.startPosition );
    this.graphic = this.startGraphic;
    
    this.target = null;
    
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
    
    ctx.save();
    ctx.translate( this.position.x, this.position.y )
    
    this.graphic.draw( ctx, this.animationFrame );
    
    ctx.restore();
    
    if ( ctx.debug && this.target ) {
      
      ctx.beginPath();
      ctx.moveTo( this.position.x, this.position.y );
      ctx.lineTo( this.target.x, this.target.y );
      ctx.closePath();
      
      ctx.stroke();
      
    }
    
  },
  
  setPosition : function( pos ) {
    
    this.position.copy( pos );
    this.target = null;
    
  },
  
  movePosition : function( vec ) {
    
    this.position.copy( this.startPosition.addSelf( vec ) );
    
  },
  
  setTarget : function( pos ) {
    
    this.target = pos;
    
  },
  
  setGraphic : function( graphic ) {
    
    this.graphic = graphic;
    
  },
  
  getArea : function() {
    
    return this.area.set(
      this.position.x,
      this.position.y,
      this.graphic.image.width,
      this.graphic.image.height
    )
    
  },
  
  vector : new Vector
  
};