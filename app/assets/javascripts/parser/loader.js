var Loader = function( callback ) {

  this.callback = callback;

};

Loader.prototype = {
  
  imageCount : 0,
  
  callback : null,
  
  loadImage : function( path ) {
    
    var image = new Image();
    
    var self = this;
    
    image.onload = function () {
    
      self.imageLoaded();
    
    }
    
    image.src = path;
    
    this.imageCount++;
    
    return image;
    
  },
  
  imageLoaded : function() {
    
    this.imageCount--;
    
    if ( this.imageCount <= 0 ) {
      
      this.callback();
      
    }
    
  }
  
};