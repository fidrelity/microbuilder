/*
  PaintController

  Todo:    
    - removeCanvas
  Fix:
    - didInsertElement - initalizing multipletimes    
    - on Save -> hide merged canvas
              -> show message on error
              -> redirect to ...
  Feature:
    - Text
    - key shortcuts (Undo, Shift -> straight lines)
    - Order sprite areas by drag&drop

*/
var PaintController =  Ember.ArrayController.extend({

  graphic : null,
  //
  content : [],         // contains sprite models
  mode : null,          // [ 'graphic', 'background' ]
  tabState : 'paint',   // Different views [ 'paint', 'setSize' ]
  //
  spriteSize : null,    // Object {width: , height: }
  currentSprite : null, // type of spriteModel
  spriteWrapper : 'sprites-area-scroll', // 'sprites-area',
  showMarker : false,   // deprecated
  spriteCounter : 0,    // spriteModel.index
  LIMIT : 8,
  type : null,          // background or object
  isBackground : false,
  //
  color : "#000000",    // Paint color
  size : 2,             // Paint stroke size
  zoom : 2,             // Zoom size
  //  
  playDelay : 200,
  currentFrameIndex : 0,

  init : function() {
    this.spriteSize = {width: 64, height: 64};
    this.pixelDrawer = new PixelDrawer();
  },

  // Called when Paint_View init (after dom ready)
  initView : function(_type, _width, _height) {
    this.type = _type || 'object';
    this.isBackground = this.type === 'background' ? true : false;

    this.setSpriteSize({width: _width, height: _height});

    this.zoomCanvas  = document.getElementById("zoomCanvas");
    this.zoomContext = this.zoomCanvas.getContext("2d");
    this.zoomCanvas.width = _width;
    this.zoomCanvas.height = _height;

    this.tempCanvas = $('#canvas-temp');
    this.tempContext = this.tempCanvas[0].getContext("2d");
    this.tempCanvas[0].width = _width;
    this.tempCanvas[0].height = _height;

    // Init file load
    if (!window.File && !window.FileReader && !window.FileList && !window.Blob) {
      $('#file').remove();
    } else {
      $('#file').change(function(e) {App.paintController.handleFile(e)});
    }
    
    // React if type is background
    var areaWrapper = $('#area-wrapper');    
    
    if(this.type === 'background') {   
      this.zoom = 1;   
      // Set Size of zoomCanvas wrapper
      var _width = 700;
      var _height = 420;
      areaWrapper.find('#zoom-canvas-area')
        .attr('width', _width).attr('height', _height)
        .css({ 'max-width' : _width, 'max-height' : _height, 'width' : _width, 'height' : _height});
      // Hide left side (sprite areas)
      areaWrapper.find('#sprites-area').hide();
      $('#player').hide();
      $('#copySpriteButton').hide();
    } else {
      areaWrapper.find('#sprites-area').show();
      areaWrapper.find('.zoomButtons').show();
    }

    this.add();
    this.finalCanvas = $('#canvas-merged');
    this.initEvents();
  },

  initEvents : function() {
    // OnMouse on zoomed canvas
    $('#zoomCanvas').mousedown(function(e){
      App.paintController.mousedown(e);
    });

    $('#zoomCanvas').mousemove(function(e){
      App.paintController.mousemove(e);
    });

    $('#zoomCanvas').mouseup(function(e){
      App.paintController.mouseup(e);
    });

    $('#zoomCanvas').mouseout(function(e){
      App.paintController.mouseup(e);
    });

    // Onclick sprite area
    $('.canvas').live('click', function(e) {
      var index = parseInt($(this).attr("data-index"));
      var spriteModel = App.paintController.getCurrentSpriteModelByIndex(index);      
      App.paintController.setCurrentSpriteModel(spriteModel);
    });

    // Slider for pencil size
    $("#sizeSlider").slider({
      value: 2, 
      min: 1,
      max: 10, 
      step: 1,
      change: function( event, ui ) {
        App.paintController.setSize(ui.value);
      }
    });
  },

  // ---------------------------------------
  save : function() {

    this.stop();

    var imageTitle = $("#imageName").val();
    var makePublic = $("#makePublic").is(":checked") ? 1 : 0;

    var count = this.content.length;
    var width = this.spriteSize.width;
    var totalWidth = count * width;
    var height = this.spriteSize.height;

    var isBackground = this.type === 'background' ? true : false;
    
    if(!imageTitle || !count) {alert("No Name!");return false;}

    this.finalCanvas.attr('width', totalWidth).attr('height', height).show();
    var canvas = this.finalCanvas[0];
    var context = canvas.getContext('2d');    

    // Merge sprites into final canvas
    for (var i = 0; i < this.content.length; i++) {
      var area = this.content[i];
      var xPos = i * width;
      context.drawImage(area.canvas, xPos, 0);
    };
    
    // Push to Server
    var imgData = this.finalCanvas[0].toDataURL("image/png");   
    $.ajax({
      url: "/graphics",
      type: "post",
      data: { 
        graphic: {
          name : imageTitle,
          image_data: imgData,
          frame_count: count,
          frame_width: width,
          frame_height: height,
          public : makePublic,
          background : isBackground,
        },
      },
      
      success : function( data ) {
        App.paintController.reset(false);
        App.libraryController.graphicSaved( data );        
      }
      
    });

  },

  // ---------------------------------------
  reset : function(_ask) {
    if(_ask) {
      var ok = confirm("Remove all sprites and reset paint editor?");
      if(!ok) return false;
    }

    for (var i = 0; i < this.content.length; i++) {
      this.remove(this.content[i]);
    };

    var first = this.content[this.content.length - 1];
    first.reset();
    this.setCurrentSpriteModel(first);
    this.clearZoomCanvas();
  },

  // Undo current SpriteModel
  undo : function() {
    this.getCurrentSpriteModel().popState();
    this.updateZoom();
  },

  // Clear current SpriteModel
  clearCurrentSprite : function() {
    this.getCurrentSpriteModel().clear();
    this.clearZoomCanvas();
  },

  erase : function(_x, _y) {    
    this.zoomContext.clearRect(_x, _y, this.size, this.size);    
    this.getCurrentSpriteModel().erase(Math.floor(_x), Math.floor(_y), this.size);
  },

  // ---------------------------------------
  // onMouseZoomCanvas Delegate events to current Tool
  click : function() {
    var options = {sprite: this.getCurrentSpriteModel()};
    this.getCurrentTool().click(options);
  },

  mousedown : function(e) { 
    var coord = this.getMouseCoordinates(e);
    var options = {x: coord.x, y: coord.y, sprite: this.getCurrentSpriteModel()};
    this.getCurrentTool().mousedown(options, this.pixelDrawer);
  },

  mousemove : function(e) {    
    var coord = this.getMouseCoordinates(e);
    var options = {x: coord.x, y: coord.y, sprite: this.getCurrentSpriteModel()};
    this.getCurrentTool().mousemove(options);
  },

  mouseup : function(e) {
    var coord = this.getMouseCoordinates(e);
    var options = {x: coord.x, y: coord.y, sprite: this.getCurrentSpriteModel()};
    this.getCurrentTool().mouseup(options);
  },

  // ---------------------------------------  
  // Add new SpriteModel
  add : function(copy) {
    if(this.content.length >= this.LIMIT) return false;
    var copyData = copy ? this.getCurrentSpriteModel().context.getImageData(0, 0, this.spriteSize.width, this.spriteSize.height) : null;
    
    var spriteModel = SpriteModel.create({
      index:    this.spriteCounter++,
      width:    this.spriteSize.width,
      height:   this.spriteSize.height,
      wrapper:  this.spriteWrapper,
      imgData : copyData
    });

    this.addObject(spriteModel);
    $('.canvas').css({width: this.spriteSize.width, height: this.spriteSize.height});
    this.setCurrentSpriteModel(spriteModel);
    if(copy) this.getCurrentSpriteModel().pushState();

    this.updateZoom();
  },

  // ---------------------------------------  
  remove : function(_spriteModel) {
    if(this.content.length === 1) return false;
    var spriteModel = _spriteModel || this.getCurrentSpriteModel();
    $("#" + spriteModel.id).remove();
    this.removeObject(_spriteModel);
    // set currentSpriteModel
  },

  // ---------------------------------------
  // Getter And Setter
  setCurrentSpriteModel : function(spriteModel) {
    if(!spriteModel) return false;
    this.set('currentSprite', spriteModel);
    spriteModel.highlight();
    //this.pixelDrawer.setCanvasContext(spriteModel.canvas);
    this.pixelDrawer.setCanvasContext(this.zoomCanvas);
    this.updateZoom();
    
  },

  getCurrentSpriteModel : function() {
    return this.get('currentSprite');
  },

  getCurrentSpriteModelByIndex : function(_id) {
    for (var i = 0; i < this.content.length; i++) {
      var spriteModel = this.content[i];
      if(spriteModel.index === _id)
        return spriteModel;
    };
    return null;
  },

  getCurrentTool : function() {
    return App.toolBoxController.getCurrentTool();
  },

  setColor : function(_color) {
    var color = _color || "#000000";
    this.color = color.substr(0,1) != '#' ? '#' + color : color;
  },

  setSize : function(_size) {
    this.size = _size || 1;
  },

  setSpriteSize : function(_obj) {
    this.spriteSize = _obj;
  },

  // ---------------------------------------
  showPaintView : function() {
    this.set( 'tabState', 'paint' );
  },

  showSizeView : function() {
    this.set( 'tabState', 'setSize' );
  },

  toggleColorPalette : function(_visible) {
    if(_visible)
      $('#colorChooser').show(); //palette
    else
      $('#colorChooser').hide();
  },

  // ---------------------------------------
  // Zoom Canvas
  zoomIn : function() {
    if(this.zoom > 10) return false;
    this.zoom++;    
    this.updateZoom(false);
  },

  zoomOut : function() {
    if(this.zoomCanvas.style.width === this.spriteSize.width+"px") return false;
    this.zoom--;
    this.updateZoom(false);
  },

  clearZoomCanvas : function() {
    this.zoomContext.clearRect(0, 0, this.zoomCanvas.width, this.zoomCanvas.height);
  },

  /* DEPRECATED
  zoomImageData : function( imageData, _zoom ) {
    var zoom = _zoom || this.zoom;
  
    var width = imageData.width, 
        height = imageData.height, 
        data = imageData.data,
        x, y, i;
   
   
    for ( x = 0; x < width; x++ ) {

        for ( y = 0; y < height; y++ ) {

            i = ( y * width + x ) * 4;

            this.zoomContext.fillStyle = "rgba(" + data[i] + "," + data[i+1] + "," + data[i+2] + "," + ( data[i+3] / 255 ) + ")";
            this.zoomContext.fillRect(x, y,1,1 );
        }

    }
  },*/

  // Copy zoomCanvas data to current sprite
  drawToSprite : function() {

    var img_data = this.zoomCanvas.toDataURL("image/png");
    var w = this.spriteSize.width;
    var h = this.spriteSize.height;
    
    var img = new Image();
    img.src = img_data;
    img.width = w;
    img.height = h;

    var currentSpriteModel = this.getCurrentSpriteModel();
    img.onload = function() {
      currentSpriteModel.context.drawImage(img, 0, 0, w, h);
      currentSpriteModel.pushState();
    };
    
  },

  setZoomCanvasSize : function () {
    var width  = this.zoom * this.spriteSize.width;  //this.isBackground ? this.spriteSize.width : this.zoom * this.spriteSize.width;
    var height = this.zoom * this.spriteSize.height; //this.isBackground ? this.spriteSize.height : this.zoom * this.spriteSize.height;
    this.zoomCanvas.style.width     = width +"px";
    this.zoomCanvas.style.height    = height +"px";    
    
    this.tempCanvas[0].style.width  = width + "px";
    this.tempCanvas[0].style.height = height + "px";
  },

  updateZoom : function(clear) {
    this.setZoomCanvasSize();
    var clear  = clear || true;
    if(clear) this.clearZoomCanvas();
    this.zoomContext.drawImage(this.getCurrentSpriteModel().canvas, 0, 0);
  },

  // ---------------------------------------
  // Temp canvas

  // Set position of temp canvas and display it over zoomCanvas
  showTempCanvas : function() { 
    
    var canvasObject = $("#zoomCanvas");    
 
    var newLeft = $("#zoom-canvas-area")[0].scrollLeft + canvasObject.position().left,
        newTop = $("#zoom-canvas-area")[0].scrollTop + canvasObject.position().top;

    this.tempCanvas.css({     
                            left: newLeft,
                            top: newTop,
                            width: canvasObject.width(),
                            height: canvasObject.height()
                        }).show();
  },

  hideTempCanvas : function() {
    this.tempCanvas.hide();
    this.pixelDrawer.setCanvasContext(this.zoomCanvas);
  },

  // ---------------------------------------
  // Animation

  play : function() {
    $('#playButton').hide();
    $('#stopButton').show();
    this.playDelay = parseInt($('#playDelay').val());
    this.currentFrameIndex = 0;
    this.overSprites();
    this.nextFrame();    
  },

  nextFrame : function() {
    var canvasObjects = $('.canvas').not('#canvas-size, #canvas-template, #canvas-sketch, #zoomCanvas');
    canvasObjects.hide();
    canvasObjects.eq(this.currentFrameIndex).show();
    console.log(canvasObjects);
    console.log(this.currentFrameIndex, this.content.length);

    if(this.currentFrameIndex == this.content.length) {
      // Loop
      if($("#replayLoop").is(":checked")) {
        this.play();
        return false;
      // End
      } else {        
        this.stop();
        return false;
      }
    }

    this.currentFrameIndex++;
    var that = this;
    this.playInterval = setTimeout(function(){
      that.nextFrame();
    }, this.playDelay);    
  },

  stop : function() {
    clearTimeout(this.playInterval);
    var canvasObjects = $('.canvas').not('#canvas-template, #canvas-sketch, #zoomCanvas').show();
    this.floatSprites();
    $('#playButton').show();
    $('#stopButton').hide();
  },

  floatSprites : function() {
    $('.canvas').not('#canvas-sketch').removeClass('canvas-over').addClass('canvas-float');
  },

  overSprites : function() {
    $('.canvas').not('#canvas-sketch').removeClass('canvas-float').addClass('canvas-over');
  },

  // ---------------------------------------
  // Helper
  getMouseCoordinates : function(e) {
    var zoomCanvas = $('#zoomCanvas');
    var x = e.pageX - zoomCanvas.offset().left;
    var y = e.pageY - zoomCanvas.offset().top;
  
    x = Math.floor(x / this.zoom);
    y = Math.floor(y / this.zoom);

    return {x: x, y: y};
  },

  // Loads file from hard drive to canvas
  handleFile : function(e) {

    var goon = confirm("This will overwrite your current canvas. Proceed?");
    if(!goon) return false;

    reader = new FileReader;

    reader.onload = function(event) {
        var w = App.paintController.zoomCanvas.width;
        var h = App.paintController.zoomCanvas.height;
        var img = new Image;
        
        img.width = w;
        img.height = h;

        img.onload = function() {
          App.paintController.zoomContext.drawImage(img, 0,0, w, h);      
          App.paintController.drawToSprite();
        };

        img.src = event.target.result;
    };

    reader.readAsDataURL(e.target.files[0]);
  }

});
