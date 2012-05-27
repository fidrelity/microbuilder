var SliderDiv = function(_options) {
   var defaults = {
    containerSelector: '#slide-container',
    slideWrapperSelector: '.slide-wrapper',
    slideSelector: '.slide',
    nextButtonSelector: '.nextButton',
    previousButtonSelector: '.prevButton',
    hasKeyEvents: false,
    moveSpeed: 500
  }
  this.settings = $.extend({}, defaults, _options);

  this.container = $(this.settings.containerSelector);
  this.viewport = this.container.find(this.settings.slideWrapperSelector);
  this.slideObj = this.viewport.find(this.settings.slideSelector);
  this.nextButton = this.container.find(this.settings.nextButtonSelector);
  this.prevButton = this.container.find(this.settings.previousButtonSelector);

  this.currentSlide = null,
  this.MOVE_SPEED = this.settings.moveSpeed;
  this.HAS_KEY_EVENTS = this.settings.hasKeyEvents;
  
  this.init();
};

SliderDiv.prototype.init = function() {
    this.currentSlide = 0;
    this.handleButtonVisibility();
    this.autoTimeout = null;
    this.doPlay = false;
    this.autoMoveTime = 5000;

    // Adapt size
    var vp = this.container.width() * this.slideObj.length;
    this.viewport.css({ width:  vp + 'px', overflow: 'overlay', clear: 'both'});
    this.slideObj.css({ width: this.container.width() + 'px' });

    // Event
    this.nextButton.click($.proxy(this.next, this));
    this.prevButton.click($.proxy(this.prev, this));
    $(document).keydown($.proxy(this.keyEvent, this));

    this.countSlides = this.slideObj.length;
    return this;
};

SliderDiv.prototype.next = function(e) {
  if(this.currentSlide == this.slideObj.length - 1) return false;
  this.currentSlide++;
  this.move(1);
};

SliderDiv.prototype.prev = function(e) {
  if(this.currentSlide == 0) return false;
  this.currentSlide--;
  this.move(-1);
};

SliderDiv.prototype.autoPlay = function(_moveTime) {
  this.autoMoveTime = _moveTime || this.autoMoveTime;

  var that = this;
  this.autoTimeout = setInterval(function() { that.play(); }, this.autoMoveTime);
  return this;
};

SliderDiv.prototype.play = function() {
  if(this.currentSlide == this.countSlides - 1)
    this.moveTo(0);
  else
    this.next();
};

SliderDiv.prototype.stopPlay = function() {
  clearTimeout(this.autoTimeout);
  return this;
};

SliderDiv.prototype.move = function(_direction, _distance) {
  this.handleButtonVisibility();

  // Move
  var distance = _distance ? _distance : this.container.width();
  var to = _direction < 0 ? '+=' : '-=';
   
  // Animation
  var that = this;
  this.viewport.animate({
    left: to + distance
  }, this.MOVE_SPEED, function() {
    that.afterMove();
  });

  return this;
};

SliderDiv.prototype.moveTo = function(_index) {
  if($("input, textarea").is(":focus")) return false;
  if(_index < 0 || _index == this.currentSlide || _index > this.countSlides) return false;

  // Direction
  var currentLeft = this.slideObj.eq(this.currentSlide).offset().left;
  var nextLeft = this.slideObj.eq(_index).offset().left;
  var direction = currentLeft > nextLeft ? -1 : 1;

  // Distance
  var distance = this.container.width() * Math.abs(this.currentSlide - _index);

  // I like to move it move it
  this.currentSlide = _index;
  this.move(direction, distance);

  return this;
};

SliderDiv.prototype.afterMove = function() {
  return true;
}

SliderDiv.prototype.handleButtonVisibility = function() {
  this.nextButton.show();
  this.prevButton.show()
  if(this.currentSlide == this.slideObj.length - 1)            
    this.nextButton.hide();
  if(this.currentSlide == 0)            
    this.prevButton.hide()
};

SliderDiv.prototype.getViewportHeight = function(_index) {
  var hiddenFields = this.slideObj.eq(_index).find(':hidden').show();
  var newH = this.slideObj.eq(_index).height();
  hiddenFields.hide()
  return newH;
};

SliderDiv.prototype.keyEvent = function(e) {
  if(!this.HAS_KEY_EVENTS) return false;  
  switch(e.keyCode) {
    case(39): this.next();break;
    case(37): this.prev();break;
  }
};