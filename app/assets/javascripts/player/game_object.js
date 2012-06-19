var GameObject = function( ID ) {
  
  this.ID = ID;
  
  this.startGraphic = null;
  this.graphic = null;
  
  this.movement = new Movement();
  this.animation = new Animation();
  
};

GameObject.prototype = {
  
  reset : function() {
    
    this.setGraphic( this.startGraphic );
    
    this.movement.reset();
    
  },
  
  update : function( dt ) {
    
    this.movement.update( dt );
    this.animation.update( dt );
    
  },
  
  draw : function( ctx ) {
    
    var pos = this.movement.position;
    
    ctx.save();
    ctx.translate( pos.x, pos.y );
    
    this.graphic.draw( ctx, this.animation.getFrame() );
    
    ctx.restore();
    
    if ( ctx.debug ) {
      
      this.movement.draw( ctx );
      
    }
    
  },
  
  setGraphic : function( graphic ) {
    
    this.graphic = graphic;
    
    this.movement.setGraphicSize( graphic.frameWidth, graphic.frameHeight );
    
    this.animation.setFrame( 1 );
    
  },
  
  setStartGraphic : function( graphic ) {
    
    this.startGraphic = graphic;
    
    this.setGraphic( graphic );
    
  },
  
  getArea : function() {
    
    return this.movement.getArea();
    
  },
  
  getGraphicArea : function() {
    
    var pos = this.movement.position,
      g = this.graphic,
      width = g.frameWidth,
      height = g.frameHeight;
    
    return new Area( pos.x - width * 0.5, pos.y - height * 0.5, width, height );
    
  },
  
  getPosition : function() {
    
    return this.movement.position;
    
  }
  
};