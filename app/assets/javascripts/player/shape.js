var Shape = function() {
  
  this.startPosition = new Vector();
  this.position = new Vector();
  
  this.startBounds;
  this.bounds = new Area();
  
  this.scale = new Vector( 1, 1 );
  this.targetScale = new Vector();
  
  this.speed;
  this.scales = false;
  
  this.vector = new Vector();
  
};

Shape.prototype = {
  
  reset : function() {
    
    this.position.copy( this.startPosition );
    
    this.scale.set( 1, 1 );
    this.scales = false;
    
  },
  
  getPosition : function() {
    
    return this.position;
    
  },
  
  setPosition : function( pos ) {
    
    this.position.copy( pos );
    
  },
  
  movePosition : function( vec ) {
    
    this.position.copy( this.startPosition.addSelf( vec ) );
    
  },
  
  getBounds : function() {
    
    var pos = this.position;
    
    if ( this.startBounds ) {
      
      return this.bounds.copy( this.startBounds ).addSelf( pos );
      
    }
    
    return this.bounds.setCenter( pos.x, pos.y );
    
  },
  
  getStartBounds : function() {
    
    return this.startBounds;
    
  },
  
  setBounds : function( bounds ) {
    
    this.startBounds = bounds.clone();
    this.bounds = bounds.clone();
    
  },
  
  setGraphicSize : function( width, height ) {
    
    if ( !this.startBounds ) {
      
      this.bounds.setSize( width, height );
      
    }
    
  },
  
  getScale : function() {
    
    return this.scale;
    
  },
  
  setScale : function( scale ) {
    
    this.scale.copy( scale );
    this.scales = false;
    
  },
  
  scaleTo : function( target, speed ) {
    
    this.targetScale.copy( target );
    this.speed = speed;
    
    this.scales = true;
    
  },
  
  flip : function( flip ) {
    
    this.scale.x *= flip.x;
    this.scale.y *= flip.y;
    
    this.targetScale.x *= flip.x;
    this.targetScale.y *= flip.y;
    
  },
  
  update : function( dt ) {
    
    if ( !this.scales ) {
      
      return;
      
    }
    
    var vector = this.vector,
      target = this.targetScale,
      scale = this.scale,
      distance = this.speed * dt;
    
    vector.copy( target ).subSelf( scale );
    
    if ( vector.norm() < distance ) {
      
      scale.copy( target );
      
      this.scales = false;
      
    } else {
      
      vector.normalizeSelf().mulSelf( distance );
      
      scale.addSelf( vector );
      
    }
    
  },
  
  draw : function( ctx, graphic, frame ) {
    
    ctx.save();
    
    ctx.translate( this.position.x, this.position.y );
    ctx.scale( this.scale.x, this.scale.y );
    
    graphic.draw( ctx, frame );
    
    ctx.restore();
    
  },
  
};