var FramePlayer = {

  frame : null,
  index : 0,
  width : 64,
  totalFrames : 1,
  
  duration : 1000,
  playInterval : null,

  init : function() {
    
    var self = this;
    
    $('.graphic').live('mouseover', function() {
      
      self.initPlay($(this).find('.frame_graphic'));
      
    }).live('mouseout', function() { 
      
      self.stop();
      
    });
    
  },

  initPlay : function(_frame) {
    
    if(this.frame) {
      this.stop();
    }
    
    this.frame = _frame;
    this.totalFrames = parseInt(_frame.attr("data-frames"));
    
    if(this.totalFrames > 1) {
      _frame.css({"background-position" : '0px' });
    
      this.index = 1;
      this.width = _frame.width();
    
      this.playInterval = setInterval(bind(this, this.play), this.duration);
    
      this.play();
    }
  },

  play : function() {
    if(!this.frame) { 
      return stop();
    }
    
    this.frame.css({"background-position" : -(this.width * this.index)});
    this.index++;
    
    if(this.index === this.totalFrames) {
      this.index = 0; // reset when last one
    }
  },

  stop : function() {
    clearInterval(this.playInterval);
    
    if(this.frame) {
      this.frame.css({"background-position" : '0px'});
      this.frame = null;
    }
  }
  
};