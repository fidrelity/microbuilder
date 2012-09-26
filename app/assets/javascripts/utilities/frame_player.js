var FramePlayer = {

  frame : null,
  current_frame_display : null,
  index : 0,
  width : 64,
  totalFrames : 1,
  
  duration : 1000,
  playInterval : null,

  init : function() {
    
    var self = this;
    
    $('.frame_graphic').live('mouseover', function() {
      
      self.initPlay($(this).find('.frame_graphic_element'), $(this).parent().parent().find('.graphicDetails').find('.frame_display').find('.frame_number'));
      
    }).live('mouseout', function() { 
      
      self.stop();
      
    });
    
  },

  initPlay : function(_frame, _frameSpan) {
    
    console.log(_frameSpan);
    this.current_frame_display = _frameSpan;

    if(this.frame) {
      this.stop();
    }
    
    this.frame = _frame;
    this.totalFrames = parseInt(_frame.attr("data-frames"));
    
    if(this.totalFrames > 1) {
      _frame.css({"background-position" : '0px 0' });
    
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
    
    this.frame.css({"background-position" : -(this.width * this.index) + 'px 0'});
    this.index++;
    
    this.current_frame_display.html(this.index)

    if(this.index === this.totalFrames) {
      this.index = 0; // reset when last one
    }
  },

  stop : function() {
    clearInterval(this.playInterval);
    
    if(this.frame) {
      this.frame.css({"background-position" : '0px 0'});
      this.frame = null;
      this.current_frame_display = null;
    }
  }
  
};