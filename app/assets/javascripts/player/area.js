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
  
  copy : function( area ) {
    
    return this.set( area.x, area.y, area.width, area.height );
    
  },
  
  clone : function() {
    
    return new Area( this.x, this.y, this.width, this.height );
    
  },
  
  center : function() {
    
    return new Vector( this.x + this.width / 2, this.y + this.height / 2 );
    
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
    
  },
  
  draw : function( ctx ) {
    
    ctx.strokeRect( this.x, this.y, this.width, this.height );
    
  },
  
  move : function( vec ) {
    
    this.x += vec.x;
    this.y += vec.y;
    
  },
  
  resize : function( vec ) {
    
    this.width += vec.x;
    this.height += vec.y;
    
  },
  
  adjust : function() {
    
    if ( this.width < 0 ) {
      
      this.x -= ( this.width *= -1 );
      
    }
    
    if ( this.height < 0 ) {
      
      this.y -= ( this.height *= -1 );
      
    }
    
  }
  
};