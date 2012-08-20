/*
  SliderDiv --v.1.2.1
  Author: weberdevelopment.de
  https://github.com/webarbeit/SliderDiv
*/
var SliderDiv = function(_options) {

   var defaults = {

    containerSelector : '#slide-container',

    slideWrapperSelector : '.slide-wrapper',

    slideSelector : '.slide',

    nextButtonSelector : '.nextButton',
  
    previousButtonSelector : '.prevButton',

    itemListSelector : null,

    itemListElementClass : "slide-item",

    activeItemClass : 'active-item',

    hasKeyEvents : false,

    moveSpeed : 500
  }
  
  // Merge default settings with arguments
  this.settings = $.extend({}, defaults, _options);

  this.container = $(this.settings.containerSelector);
  
  this.viewport = this.container.find(this.settings.slideWrapperSelector);
  this.slideObjects = this.viewport.find(this.settings.slideSelector);

  this.itemUl = $(this.settings.itemListSelector);
  this.itemListElementClass = this.settings.itemListElementClass;
  this.activeItemClass = this.settings.activeItemClass;

  this.nextButton = $(this.settings.nextButtonSelector);
  this.prevButton = $(this.settings.previousButtonSelector);

  this.MOVE_SPEED = this.settings.moveSpeed;
  this.HAS_KEY_EVENTS = this.settings.hasKeyEvents;
  
  this.init();
};

SliderDiv.prototype.init = function() {

  this.reset();

  // Set Styles
  this.container.css({ "overflow" : "hidden" });   
  
  // Adapt size of viewport
  var vp = this.container.width() * this.slideObjects.length;
  this.viewport.css({ 

    width :  vp + 'px', 
    overflow : 'overlay', 
    clear : 'both',
    position : "relative"

  });
  
  this.slideObjects.css({ 

    width: this.container.width() + 'px',
    "position" : "relative",
    "float" : "left"

  });

  this.buildItems();

  // Events
  this.nextButton.click($.proxy(this.next, this));
  this.prevButton.click($.proxy(this.prev, this));

  if(this.HAS_KEY_EVENTS)
    $(document).keydown($.proxy(this.keyEvent, this));
  
  return this;

};

SliderDiv.prototype.reset = function() {

  this.currentSlideIndex = 0;
  this.handleButtonVisibility();
  this.autoTimeout = null;
  this.doPlay = false;
  this.autoMoveTime = 5000;

  this.countSlides = this.slideObjects.length;

  return this;

};

SliderDiv.prototype.buildItems = function() {

  var self = this;

  if( !this.itemUl.length || this.countSlides === 0 ) return false;

  this.slideObjects.each(function(k, v) {

    self.itemUl.append('<li class="' + self.itemListElementClass + '"></li>');

  });

  // Bind event
  this.itemUl.find("li").bind("click", function() {

    self.moveTo( $(this).index() );

  });

  this.highLightItem();

};

SliderDiv.prototype.next = function(e) {

  if(this.currentSlideIndex === this.slideObjects.length - 1) return false;
  
  this.currentSlideIndex++;
  this.move(1);

  return this;

};

SliderDiv.prototype.prev = function(e) {

  if(this.currentSlideIndex === 0) return false;
  
  this.currentSlideIndex--;
  this.move(-1);

  return this;

};

SliderDiv.prototype.autoPlay = function( _moveTime ) {
  
  this.autoMoveTime = _moveTime || this.autoMoveTime;

  var self = this;
  
  this.autoTimeout = setInterval(function() {

    self.play(); 

  }, this.autoMoveTime);

  return this;
};

SliderDiv.prototype.play = function() {

  if(this.currentSlideIndex === this.countSlides - 1)
    this.moveTo(0);
  else
    this.next();

  return this;
};

SliderDiv.prototype.stopPlay = function() {

  clearTimeout(this.autoTimeout);
  return this;

};

SliderDiv.prototype.move = function( _direction, _distance ) {

  this.handleButtonVisibility();

  this.highLightItem();

  // Move
  var distance = _distance ? _distance : this.container.width();
  var to = _direction < 0 ? '+=' : '-=';
   
  // Animation
  var self = this;
  this.viewport.animate({

    left: to + distance

  }, this.MOVE_SPEED, function() {

    self.afterMove();

  });

  return this;
};

SliderDiv.prototype.moveTo = function( _index ) {

  if($("input, textarea").is(":focus")) return false;
  
  if(_index < 0 || _index === this.currentSlideIndex || _index > this.countSlides) return false;

  // Direction
  var currentLeft = this.slideObjects.eq(this.currentSlideIndex).offset().left;
  var nextLeft = this.slideObjects.eq(_index).offset().left;
  var direction = currentLeft > nextLeft ? -1 : 1;

  // Distance
  var distance = this.container.width() * Math.abs(this.currentSlideIndex - _index);

  // I like to move it move it
  this.currentSlideIndex = _index;
  this.move(direction, distance);

  return this;
};

SliderDiv.prototype.afterMove = function() {

  return true;

};

SliderDiv.prototype.highLightItem = function() {

  if( !this.itemUl.length ) return false;

  var items = this.itemUl.find("li");

  items.removeClass(this.activeItemClass);

  items.eq(this.currentSlideIndex).addClass(this.activeItemClass);

};

SliderDiv.prototype.handleButtonVisibility = function() {
  
  this.nextButton.show();
  this.prevButton.show();
  
  if(this.currentSlideIndex === this.slideObjects.length - 1)            
    this.nextButton.hide();
  
  if(this.currentSlideIndex === 0)            
    this.prevButton.hide();

};

SliderDiv.prototype.getViewportHeight = function( _index ) {

  var hiddenFields = this.slideObjects.eq(_index).find(':hidden').show();
  var newH = this.slideObjects.eq(_index).height();
  
  hiddenFields.hide();
  
  return newH;

};

SliderDiv.prototype.keyEvent = function(e) {

  if( !this.HAS_KEY_EVENTS ) return false;
  
  switch(e.keyCode) {

    case(39): this.next(); break;

    case(37): this.prev(); break;

  }

};