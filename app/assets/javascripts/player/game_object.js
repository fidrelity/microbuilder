var GameObject = function( ID, name ) {
  
  this.ID = ID;
  this.name = name;
  
  this.startGraphic = null;
  this.graphic = null;
  
  this.shape = new Shape();
  this.movement = new Movement( this.shape );
  this.animation = new Animation();
  
  this.counter = 0;
  
};

GameObject.prototype = {
  
  reset : function() {
    
    this.setGraphic( this.startGraphic );
    
    this.shape.reset();
    this.movement.reset();
    this.animation.reset();
    
    this.counter = 0;
    
  },
  
  update : function( dt ) {
    
    this.shape.update( dt );
    this.movement.update( dt );
    this.animation.update( dt );
    
  },
  
  draw : function( ctx ) {
    
    var area;
    
    this.shape.draw( ctx, this.graphic, this.animation.getFrame() );
    
    if ( ctx.debug ) {
      
      this.movement.draw( ctx );
      
      area = this.shape.getBounds();
      ctx.fillText( this.counter, area.x + 2, area.y + 17 );
      
    }
    
  },
  
  setGraphic : function( graphic ) {
    
    this.graphic = graphic;
    
    this.shape.setGraphicSize( graphic.frameWidth, graphic.frameHeight );
    
    this.animation.setFrame( 1 );
    
  },
  
  setStartGraphic : function( graphic ) {
    
    this.startGraphic = graphic;
    
    this.setGraphic( graphic );
    
  },
  
  getPosition : function() {
    
    return this.shape.getPosition();
    
  },
  
  getArea : function() {
    
    return this.shape.getBounds();
    
  }
  
};