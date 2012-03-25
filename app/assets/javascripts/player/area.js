var Area = function( x, y, width, height ) {
  
  this.set( x, y, width, height );
  
};

Area.prototype = {
  
  set : function( x, y, width, height ) {
    
    this.x = x;
    this.y = y;
  
    this.width = width;
    this.height = height;
    
    return this;
    
  },
  
  contains : function( point ) {
    
    return (
      point.x >= this.x && point.x <= this.x + this.width &&
      point.y >= this.y && point.y <= this.y + this.height
    );
    
  },
  
  overlaps : function( area ) {
    
    var x = this.x < area.x ? [this, area] : [area, this],
      y = this.y < area.y ? [this, area] : [area, this];
    
    return ( x[0].x + x[0].width > x[1].x && y[0].y + y[0].height > y[1].y );
    
  }
  
};