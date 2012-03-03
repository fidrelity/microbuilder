var Loader = function( callback ) {

  this.callback = callback;

  this.imageCount = 0;

};

Loader.prototype = {
  
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
