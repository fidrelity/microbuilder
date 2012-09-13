var Loader = function( callback, animated, corsSave ) {
  
  this.callback = callback;
  
  this.imageCount = 0;
  this.imagesLoaded = 0;
  
  this.corsSave = corsSave;
  
  this.animated = animated;
  this.loadCircle = 0;
  
  this.c = 0;

};

Loader.prototype = {
  
  loadImage : function( path, callback ) {
    
    if ( !path ) {
      
      return;
      
    }
    
    if ( this.imageCount >= 100 ) {
      
      console.error( 'Loader does not load more than 100 images' );
      return;
      
    }
    
    var image = new Image();
    
    var self = this;
    
    image.onload = function () {
      
      self.c++;
      
      // setTimeout( function() {
        
        callback();
        
        self.imageLoaded();
        
      // }, self.c * 500 );
      
    }
    
    var isLocal = document.location.hostname === 'localhost' ? true : false;
    
    if ( this.corsSave ) {
      
      path = isLocal ? path  : "/s3?url=" + path;
    
    }
    
    image.src = path;
    
    this.imageCount++;
    
    return image;
    
  },
  
  imageLoaded : function() {
    
    this.imagesLoaded++;
    
    if ( !this.animated ) {
      
      this.checkRemaining();
      
    }
    
  },
  
  checkRemaining : function() {
    
    if ( this.imageCount === this.imagesLoaded ) {
      
      this.callback();
      
    }
    
  },
  
  draw : function( ctx ) {
    
    var current = this.imagesLoaded / this.imageCount + 0.02,
      load = this.loadCircle;
    
    load += ( current - load ) * 0.1;
    
    if ( current - load < 0.02 ) {
      
      load = current;
      
      if ( current === 1.02 ) {
        
        this.checkRemaining();
        
      }
      
      return;
      
    }
    
    ctx.fillStyle = 'white';
    ctx.fillRect( 0, 0, 640, 390 );
    
    ctx.save();
    ctx.translate( 320.5, 160.5 );
    
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#C3C3C3';
    
    ctx.beginPath();
    ctx.arc( 0, 0, 30, 0, TAU, true );
    ctx.stroke();
    
    ctx.strokeStyle = '#CD5654';
    ctx.lineWidth = 7;
    
    ctx.beginPath();
    ctx.arc( 0, 0, 30, -0.25 * TAU, ( -0.25 + load ) * TAU, false );
    ctx.stroke();
    
    ctx.restore();
    
    this.loadCircle = load;
    
  }
  
};
