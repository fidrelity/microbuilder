var Area = function( x, y, width, height ) {
  
  this.set( x, y, width, height );
  
};

Area.prototype = {
  
  set : function( x, y, width, height ) {
    
    this.x = x || 0;
    this.y = y || 0;
  
    this.width = width || 0;
    this.height = height || 0;
    
    return this;
    
  },
  
  setPosition : function( x, y ) {
    
    this.x = x;
    this.y = y;
    
    return this;
    
  },
  
  setCenter : function( x, y ) {
    
    this.x = x - this.width * 0.5;
    this.y = y - this.height * 0.5;
    
    return this;
    
  },
  
  setSize : function( width, height ) {
    
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
    
    return (
      this.x + this.width > area.x &&
      this.y + this.height > area.y &&
      this.x < area.x + area.width &&
      this.y < area.y + area.height
    );
    
  },
  
  draw : function( ctx ) {
    
    ctx.strokeRect( this.x, this.y, this.width, this.height );
    
  },
  
  move : function( vec ) {
    
    this.x += vec.x;
    this.y += vec.y;
    
  },
  
  resize : function( vec ) {
    
    this.width = vec.x - this.x;
    this.height = vec.y - this.y;
    
  },
  
  leavesArea : function( area ) {
    
    if ( !this.contains( area ) ) {
      
      return this.x > area.x ? 'x' : 'y';
      
    } else if ( !this.contains( { x : area.x + area.width, y : area.y + area.height } ) ) {
      
      return this.x + this.width < area.x + area.width ? 'width' : 'height';
      
    } else {
      
      return false;
      
    }
    
  },
  
  adjust : function() {
    
    if ( this.width < 0 ) {
      
      this.x -= ( this.width *= -1 );
      
    }
    
    if ( this.height < 0 ) {
      
      this.y -= ( this.height *= -1 );
      
    }
    
  },
  
  string : function() {
    
    return '( ' + this.x + ' | ' + this.y + ' | ' + this.width + ' | ' + this.height + ' )';
    
  },
  
  log: function() {
    
    console.log( this.string() );
    
  },
  
  getData : function() {
    
    return {
      x : this.x,
      y : this.y,
      width : this.width,
      height : this.height
    }
    
  }
  
};