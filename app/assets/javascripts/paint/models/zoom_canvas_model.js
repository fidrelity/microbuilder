var ZoomCanvasModel = Ember.Object.extend({

  canvas : null,
  context : null,
  domObj : null,
  id : 'zoomCanvas',

  tempCanvas : null,

  height : 0,
  width : 0,

  zoom : 2,
  defaultZoom : 2,
  maxZoom : 4,
  minZoom : 1,

  isBackground : false,

  bgCounter : 0,

  // Constr: width, height = spriteSize.width/height, isBackground
  init : function() {

  },

  initDomReady : function() {

    this.canvas  = document.getElementById(this.id);
    this.context = this.canvas.getContext("2d");

    this.domObj = $('#' + this.id);

    // Mouse events on zoomed canvas
    this.domObj.mousedown(function(e){
      App.paintController.mousedown(e);
    });

    this.domObj.mousemove(function(e){
      App.paintController.mousemove(e);
    });

    this.domObj.mouseup(function(e){
      App.paintController.mouseup(e);
    });

    this.domObj.mouseout(function(e){
      App.paintController.mouseup(e);
    });  

    this.canvas.width = this.width;
    this.canvas.height = this.height; 

  },

  reset : function () {

    this.zoom = this.isBackground ? 1 : 2;

  },

  handleType : function() {

    var areaWrapper = $('#area-wrapper');

    if(this.isBackground) {

      this.zoom = 1;

    }

  },

  zoomIn : function() {

    if ( this.zoom < this.maxZoom) {
      
      this.zoom++;
      this.updateZoom();
    
    }

  },

  zoomOut : function() {
    
    if ( this.zoom > 1 ) {
      
      this.zoom--;
      this.updateZoom();
    
    }
    
  },

  clear : function() {

    this.context.clearRect(0, 0, this.width, this.height);

    if(this.isBackground) this.fillBackground("#FFFFFF");

  },

  eraseArea : function(_x, _y, w, h) {

    this.context.clearRect(_x, _y, w, h);

  },

  // Copy zoomCanvas data to current sprite
  /* Deprecated???
  drawToSprite : function(spriteModel) {

    var img_data = this.canvas.toDataURL("image/png");
    var w = this.spriteModel.width;
    var h = this.spriteModel.height;
    
    var img = new Image();
    img.src = img_data;
    img.width = w;
    img.height = h;

    img.onload = function() {
      spriteModel.context.drawImage(img, 0, 0, w, h);
      spriteModel.pushState();
    };
    
  },*/

  setZoomCanvasSize : function () {

    var width  = this.zoom * this.width;
    var height = this.zoom * this.height;

    this.canvas.style.width     = width +"px";
    this.canvas.style.height    = height +"px";  

    App.paintController.tempCanvas.updateToZoomCanvasSize(this.width, this.height, width, height);
    
  },

  updateZoom : function(clear) {

    this.setZoomCanvasSize();

    if(clear) this.clear();
    
    this.context.drawImage(App.paintController.getCurrentSpriteModel().canvas, 0, 0);
    
    App.paintController.centerCanvas();

  },

  toogleZoomCanvasBg : function() {

    var bgClasses = ['bgTransparent', 'bgWhite', 'bgBlack'];
    this.bgCounter++;
    this.bgCounter = (this.bgCounter > bgClasses.length - 1) ? 0 : this.bgCounter;
    
    var addClass = bgClasses[this.bgCounter];

    var bgToggleButton = $('.bgToggle');

    var that = this;

    $.each(bgClasses, function(k,v) {

      bgToggleButton.removeClass(v);
      that.domObj.removeClass(v);

    });
    
    bgToggleButton.addClass(addClass);
    this.domObj.addClass(addClass);   

  },

  fillBackground : function(_color) {

    if(_color) {

      this.context.fillStyle = _color;
      this.context.fillRect(0, 0, this.width, this.height);

      this.domObj.css({'background-image' : 'none'});
    }

  },  

});