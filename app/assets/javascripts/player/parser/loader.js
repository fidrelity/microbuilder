var Loader = function( callback ) {

  this.callback = callback;

  this.imageCount = 0;

  this.corsSave = false;

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
    
      image.onload = null;
    
      self.imageLoaded();
    
    }
    
    var isLocal = document.location.hostname === 'localhost' ? true : false;
    
    if ( this.corsSave ) {
      
      path = isLocal ? "/s3?url=http://" + document.location.host + "/" + path  : "/s3?url=" + path;
    
    }
    console.log(path);
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
