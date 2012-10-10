var GameObject = function( ID, name ) {
  
  this.ID = ID;
  this.name = name;
  
  this.startGraphic = null;
  this.graphic = null;
  
  this.movement = new Movement();
  this.animation = new Animation();
  
  this.counter = 0;
  
};

GameObject.prototype = {
  
  reset : function() {
    
    this.setGraphic( this.startGraphic );
    
    this.movement.reset();
    this.animation.reset();
    
    this.counter = 0;
    
  },
  
  update : function( dt ) {
    
    this.movement.update( dt );
    this.animation.update( dt );
    
  },
  
  draw : function( ctx ) {
    
    var pos = this.movement.position,
      scale = this.animation.getScale(),
      area;
    
    ctx.save();
    
    ctx.translate( pos.x, pos.y );
    ctx.scale( scale.x, scale.y );
    
    this.graphic.draw( ctx, this.animation.getFrame() );
    
    ctx.restore();
    
    if ( ctx.debug ) {
      
      this.movement.draw( ctx );
      
      area = this.movement.getArea();
      ctx.fillText( this.counter, area.x + 2, area.y + 17 );
      
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
    
    return this.getArea();
    
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