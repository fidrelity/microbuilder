var Circle = function( x, y, radius ) {
  
  this.set( x, y, radius );
  
};

Circle.prototype = {
  
  set : function( x, y, radius ) {
    
    this.x = x || 0;
    this.y = y || 0;
  
    this.radius = radius || 0;
    
    return this;
    
  },
  
  setPosition : function( x, y ) {
    
    this.x = x;
    this.y = y;
    
    return this;
    
  },
  
  setRadius : function( radius ) {
    
    this.radius = radius;
    
    return this;
    
  },
  
  copy : function( circle ) {
    
    return this.set( circle.x, circle.y, circle.radius );
    
  },
  
  clone : function() {
    
    return new Circle( this.x, this.y, this.radius );
    
  },
  
  contains : function( point ) {
    
    return new Vector( this.x, this.y ).subSelf( point ).norm() <= this.radius;
    
  },
  
  overlaps : function( area ) {
    
    return false;
    
  },
  
  draw : function( ctx ) {
    
    ctx.strokeCircle( this.x, this.y, this.radius );
    
  },
  
  move : function( vec ) {
    
    this.x += vec.x;
    this.y += vec.y;
    
  },
  
  resize : function( vec ) {
    
    this.radius = new Vector( this.x, this.y ).subSelf( vec ).norm();
    
  },
  
  leavesArea : function( area ) {
    
    return false;
    
  },
  
  adjust : function() {},
  
  string : function() {
    
    return '( ' + this.x + ' | ' + this.y + ' | ' + this.radius + ' )';
    
  },
  
  log: function() {
    
    console.log( this.string() );
    
  },
  
  getData : function() {
    
    return {
      x : this.x,
      y : this.y,
      radius : this.radius
    }
    
  }
  
};