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
    
    var dist = area.center().subSelf( this );
    
    dist.x = Math.abs( dist.x ) - area.width * 0.5;
    dist.y = Math.abs( dist.y ) - area.height * 0.5;
    
    if ( dist.x > this.radius || dist.y > this.radius ) {
      
      return false;
      
    } else if ( dist.x <= 0 || dist.y <= 0 ) {
      
      return true;
      
    }
    
    return dist.normSquared() < this.radius * this.radius;
    
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
    
    var center = area.center();
    
    if ( !area.contains( { x: this.x - this.radius, y: this.y - this.radius } ) ) {
      
      return this.x - this.radius < area.x ? 'x' : 'y';
      
    } else if ( !area.contains( { x: this.x + this.radius, y: this.y + this.radius } ) ) {
      
      return this.x + this.radius > area.x + area.width ? 'width' : 'height';
      
    }
    
    return false;
    
  },
  
  adjust : function() {
    
    this.x = Math.floor( this.x );
    this.y = Math.floor( this.y );
    
    this.radius = Math.floor( this.radius );
    
  },
  
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