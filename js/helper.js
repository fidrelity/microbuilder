// Clone array
Array.prototype.copy = function() {
  var tempClone = [];
  for (var i = 0; i < this.length; i++) {
    tempClone.push(this[i]);
  }
  return tempClone;
};
// Get max value of array
Array.max = function( array ){
  return Math.max.apply( Math, array );
};
// Get min value of array
Array.min = function( array ){
  return Math.min.apply( Math, array );
};