var GameObject = function( ID ) {
  
  this.ID = ID;
  this.position = new Vector();
  this.startPosition = new Vector();
  
  this.target = null;
  this.direction = null;
  
  this.graphic = null;
  this.startGraphic = null;
  
  this.animationFrame = 1;
  
  this.area = new Area();
  
};

GameObject.prototype = {
  
  init : function() {},
  
  reset : function() {
    
    this.position.copy( this.startPosition );
    this.graphic = this.startGraphic;
    
    this.animationFrame = 1;
    
    this.stop();
    
  },
  
  update : function( dt ) {
    
    var vector = this.vector,
      distance = dt * 0.1;
    
    if ( this.target ) {
      
      vector.copy( this.target ).subSelf( this.position );
      
      if ( vector.norm() < distance ) {
      
        this.position.copy( this.target );
        
        this.target = null;
      
      } else {
      
        vector.normalizeSelf().mulSelf( distance );
      
        this.position.addSelf( vector );
      
      }
      
    } else if ( this.direction !== null ) {
      
      vector.set( distance, 0 ).rotateSelf( this.direction );
      
      this.position.addSelf( vector );
      
    }
    
  },
  
  draw : function( ctx ) {
    
    var pos = this.position;
    
    ctx.save();
    ctx.translate( pos.x, pos.y );
    
    this.graphic.draw( ctx, this.animationFrame );
    
    ctx.restore();
    
    if ( ctx.debug && this.target ) {
      
      ctx.save();
      ctx.translate( this.graphic.image.width / 2, this.graphic.image.height / 2 );
      
      ctx.line( pos.x, pos.y, this.target.x, this.target.y );
      
      ctx.restore();
      
    }
    
  },
  
  stop : function() {
    
    this.target = null;
    this.direction = null;
    
  },
  
  setPosition : function( pos ) {
    
    this.stop();
    
    this.position.copy( pos );
    
  },
  
  movePosition : function( vec ) {
    
    this.position.copy( this.startPosition.addSelf( vec ) );
    
  },
  
  setTarget : function( pos ) {
    
    this.stop();
    
    this.target = pos;
    
  },
  
  setDirection : function( dir ) {
    
    this.stop();
    
    this.direction = dir;
    
  },
  
  setGraphic : function( graphic ) {
    
    this.graphic = graphic;
    
  },
  
  setFrame : function( frame ) {
    
    this.animationFrame = frame;
    
  },
  
  getArea : function() {
    
    return this.area.set(
      this.position.x,
      this.position.y,
      this.graphic.image.width / this.graphic.frameCount,
      this.graphic.image.height
    )
    
    return this.area;
    
  },
  
  vector : new Vector
  
};