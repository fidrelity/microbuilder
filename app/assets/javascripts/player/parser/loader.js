var Loader = function( callback ) {

  this.callback = callback;

  this.imageCount = 0;

};

Loader.prototype = {
  
  loadImage : function( path ) {
    
    if ( this.imageCount >= 100 ) {
      
      console.error( 'Loader does not load more than 100 images' );
      return;
      
    }
    
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
    
    this.checkRemaining();
    
  },
  
  checkRemaining : function() {
    
    if ( this.imageCount <= 0 ) {
      
      this.callback();
      
    }
    
  }
  
};
