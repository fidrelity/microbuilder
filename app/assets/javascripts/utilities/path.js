//= require ./../utilities/utilities
//= require ./vector

var Path = function() {
  
  this.points = [];
  
};


Path.prototype = {
  
  add : function( point ) {
    
    this.points.push(point);
      
    return this;
    
  },
   
  copy : function( path ) {
    
    this.points = [];

    for (var i = 0; i < path.points.length; i++) {

      this.add( path.points[i] );

    };

    return this;
    
  },
  
  clone : function() {
    
    return new Path().copy( this );
    
  },
  
  
  draw : function( ctx ) {

    ctx.fillStyle = "#000000";

    var p = this.points;

    for (var i = 0; i < p.length - 1; i++) {      

      ctx.drawArrow( p[i].x, p[i].y, p[i+1].x, p[i+1].y );

    };

    
  },
  
  
  string : function() {    

    return JSON.stringify(this.points);    
    
  },
  
  log : function() {

    console.log( this.string() );

  },

  getData : function() {
    
    return this.clone().points;
    
  }
  
};