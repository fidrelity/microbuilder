var FramePlayer = {

  selector : '.graphic',
  dataSelector : '.frame_graphic',
  currentFrameIndex : 0,
  currentObject : null,
  totalFrames : 0,
  frameWidth : 64,
  playInterval : null,
  frameDuration : 1000,

  init : function() {

    $(this.selector).live('mouseover', function() {
      FramePlayer.initPlay($(this).find(FramePlayer.dataSelector));
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
    this.currentFrameIndex = 1;
    this.play();
    this.playInterval = setInterval( function() { FramePlayer.play(); } , this.frameDuration)
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
    this.playInterval = null;
    if(this.currentObject) this.currentObject.css({"background-position" : '0px' });
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