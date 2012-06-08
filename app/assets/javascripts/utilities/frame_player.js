var FramePlayer = ( function() {

  var _frame = null,
    _index = 0,
    _width = 64,
    _totalFrames = 1,
    _playInterval = null,
    _duration = 1000;

  this.init = function() {
    $('.graphic').live('mouseover', function() {
      
      initPlay($(this).find('.frame_graphic'));
      
    }).live('mouseout', stop);
  };

  function initPlay(frame) {
    if(_frame) {
      stop();
    }
    
    _frame = frame;
    _totalFrames = parseInt(_frame.attr("data-frames"));
    
    if(_totalFrames > 1) {
      _frame.css({"background-position" : '0px' });
    
      _index = 1;
      _width = _frame.width();
    
      _playInterval = setInterval(play, _duration);
    
      play();
    }
  };

  function play() {
    if(!_frame) { 
      return stop();
    }
    
    _frame.css({"background-position" : -(_width * _index)});
    _index++;
    
    if(_index === _totalFrames) {
      _index = 0; // reset when last one
    }
  };

  function stop() {
    clearInterval(_playInterval);
    
    if(_frame) {
      _frame.css({"background-position" : '0px'});
      _frame = null;
    }
  };
  
  return this;
  
})();