//= require ./../utilities/utilities
//= require ./vector

var Circle = function( x, y, radius ) {
  
  this.set(
    x || 0,
    y || 0,
    radius || 0
  );
  
};

Circle.prototype = new Vector();
Circle.prototype.constructor = Vector;

extend( Circle.prototype, {
  
  set : function( x, y, radius ) {
    
    this.x = x;
    this.y = y;
    
    this.radius = radius;
    
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
    
    return this.sub( point ).norm() <= this.radius;
    
  },
  
  overlaps : function( other ) {
    
    if ( other instanceof Circle ) {
      
      return this.overlapsCircle( other );
      
    } else {
      
      return this.overlapsArea( other );
      
    }
    
  },
  
  overlapsCircle : function( circle ) {
    
    return this.sub( circle ).norm() <= this.radius + circle.radius;
    
  },
  
  overlapsArea : function( area ) {
    
    var t = this,
      a = area;
    
    return ( a.overlapsArea( new Area( t.x - t.radius, t.y - t.radius, 2 * t.radius, 2 * t.radius ) ) &&
      ( t.contains( a ) || t.contains( { x: a.x + a.width, y: a.y + a.height } ) ||
        t.contains( { x: a.x, y: a.y + a.height } ) || t.contains( { x: a.x + a.width, y: a.y } ) ) );
    
  },
  
  draw : function( ctx ) {
    
    ctx.strokeCircle( this.x, this.y, this.radius );
    
  },
  
  move : function( vec ) {
    
    return this.addSelf( vec );
    
  },
  
  resize : function( vec ) {
    
    this.radius = this.sub( vec ).norm();
    
  },
  
  leavesArea : function( area ) {
    
    return false;
    
  },
  
  adjust : function() {},
  
  string : function() {
    
    return '( ' + this.x + ' | ' + this.y + ' | ' + this.radius + ' )';
    
  },
  
  getData : function() {
    
    return {
      x : this.x,
      y : this.y,
      radius : this.radius
    }
    
  }
  
});