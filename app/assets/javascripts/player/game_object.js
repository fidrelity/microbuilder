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
    
    this.graphic.draw( ctx, this.animation.frame );
    
    ctx.restore();
    
    // if ( this.movement.roamArea ) {
    //   
    //   this.movement.roamArea.draw( ctx );
    //   
    // }
    
    // if ( ctx.debug && this.target ) {
    //   
    //   ctx.save();
    //   ctx.translate( this.graphic.image.width / 2, this.graphic.image.height / 2 );
    //   
    //   ctx.line( pos.x, pos.y, this.target.x, this.target.y );
    //   
    //   ctx.restore();
    //   
    // }
    
  },
  
  setPosition : function( pos ) {
    
    this.movement.setPosition( pos );
    
  },
  
  movePosition : function( vec ) {
    
    this.movement.movePosition( vec );
    
  },
  
  setTarget : function( pos, speed ) {
    
    this.movement.setTarget( pos, speed );
    
  },
  
  setDirection : function( dir, speed ) {
    
    this.movement.setDirection( dir, speed );
    
  },
  
  roam : function( mode, area, speed ) {
    
    this.movement.roam( this, mode, area, speed );
    
  },
  
  setGraphic : function( graphic ) {
    
    var img = graphic.image,
      onload = img.onload,
      self = this;
    
    if ( onload ) {
    
      img.onload = function() {
      
        self.movement.area.setSize( img.width / graphic.frameCount, img.height );
      
        onload();
      
      }
    
    } else {
      
      this.movement.area.setSize( img.width / graphic.frameCount, img.height );
      
    }
    
    this.graphic = graphic;
    
    this.animation.setFrame( 1 );
    
  },
  
  setStartGraphic : function( graphic ) {
    
    this.startGraphic = graphic;
    
    this.setGraphic( graphic );
    
  },
  
  setFrame : function( frame ) {
    
    this.animation.setFrame( frame );
    
  },
  
  playAnimation : function( start, end, mode, speed ) {
    
    this.animation.play( start, end, mode, speed );
    
  },
  
  stopAnimation : function() {
    
    this.animation.stop();
    
  },
  
  getArea : function() {
    
    return this.movement.getArea();
    
  }
  
};