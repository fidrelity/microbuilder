var FramePlayer = {

  selector : '.frame_graphic',
  currentFrameIndex : 0,
  currentObject : null,
  totalFrames : 0,
  frameWidth : 64,
  playInterval : null,

  init : function() {

    $(this.selector).live('mouseover', function() {
      FramePlayer.initPlay($(this));
    });

    $(this.selector).live('mouseout', function() {      
      FramePlayer.stop();
      FramePlayer.reset();
    });
  },

  initPlay : function(_object) {    
    this.totalFrames = parseInt(_object.attr("data-frames"));    
    if(this.totalFrames === 1) return false;

    this.currentObject = _object;
    this.frameWidth = _object.width();
    this.currentFrameIndex = 0;
    
    this.playInterval = setInterval( function() { FramePlayer.play() ;} , 1000)
  },

  play : function() {
    
    var newPosition = -(this.frameWidth * this.currentFrameIndex);
    this.currentObject.css({"background-position" : newPosition });

    if(this.currentFrameIndex === this.totalFrames - 1) {
      this.currentFrameIndex = 0; // reset when last one
    } else {
      this.currentFrameIndex++;
    }
    
  },

  stop : function() {
    clearInterval(this.playInterval);
  },

  reset : function() {
    this.totalFrames = 0;
    this.currentFrameIndex = 0;
    this.currentObject = null;
  },

};

$(document).ready(function() {
  console.log("frameplayer init")
  FramePlayer.init();
});