/*
  PaintController
  
  - manages the graphic being saved

  Todo:    
    - removeCanvas
  Fix:
    - didInsertElement - initalizing multipletimes
    - refactor
      -> Create Classes: Zoomer, FramePlayer, colorpallette
    - on Save -> hide merged canvas
              -> show message on error
    - Zoom and temp-canvas
    - Zooming too pixelated
  Feature:
    - Text
    - FillTool
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
  spriteWrapper : 'sprites-area',
  showMarker : false,
  spriteCounter : 0,    // spriteModel.index
  LIMIT : 8,
  //
  color : "#000000",    // Paint color
  size : 2,             // Paint stroke size
  zoom : 4,             // Zoom size
  //  
  playDelay : 200,
  currentFrameIndex : 0,

  init : function() {
    this.spriteSize = { width: 64, height: 64};
    this.pixelDrawer = new PixelDrawer();
  },

  // Called when Paint_View init
  initView : function() {
    console.log("init paint controller")
    this.zoomCanvas  = document.getElementById("zoomCanvas");
    this.zoomContext = this.zoomCanvas.getContext("2d");

    this.tempCanvas = $('#canvas-temp');
    this.tempContext = this.tempCanvas[0].getContext("2d");

    // Init instanst file load    
    if (!window.File && !window.FileReader && !window.FileList && !window.Blob) {
      $('#file').remove();
    } else {
      $('#file').change(function(e) { App.paintController.handleFile(e) });
    }


    $('#loadImageByUrl').change(function() { App.paintController.loadImageToCanvas($(this).val()) });
    // if mode = background -> set spriteSize to background size
      // remove zoom
      // remove original sprites
      // remove add button

    // if mode = graphic -> show size-page
    
    // set sketch canvas size + position

    this.add();
    this.finalCanvas = $('#canvas-merged');
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
    
    if(!imageTitle || !count) { alert("No Name!"); return false;}

    this.finalCanvas.attr('width', totalWidth).attr('height', height).show();
    var canvas = this.finalCanvas[0]; //document.getElementById(this.finalCanvas.attr('id'));
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
      url: "graphics/",
      type: "post",
      data: { 
        graphic: {
          name : imageTitle,
          image_data: imgData,
          frame_count: count,
          frame_width: width,
          frame_height: height,
          public : makePublic,
          background : 0,
        },
      },
      
      success : function( data ) {   
        App.libraryController.graphicSaved( data );        
      }
      
    });

  },

  // ---------------------------------------
  reset : function() {
    var ok = confirm("Remove all sprites and reset paint editor?");
    if(!ok) return false;

    for (var i = 0; i < this.content.length; i++) {
      console.log(this.content[i]);
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
    this.getCurrentSpriteModel().erase(Math.floor(_x / this.zoom), Math.floor(_y / this.zoom), this.size * this.zoom);
    this.zoomContext.clearRect(_x, _y, this.size * this.zoom, this.size * this.zoom);
  },

  // ---------------------------------------
  // onMouseZoomCanvas Delegate events to current Tool
  click : function() {
    var options = { sprite: this.getCurrentSpriteModel() };
    this.getCurrentTool().click(options);
  },

  mousedown : function(e) { 
    var coord = this.getMouseCoordinates(e);
    var options = { x: coord.x, y: coord.y, sprite: this.getCurrentSpriteModel()};
    this.getCurrentTool().mousedown(options, this.pixelDrawer);
  },

  mousemove : function(e) {    
    var coord = this.getMouseCoordinates(e);
    var options = { x: coord.x, y: coord.y, sprite: this.getCurrentSpriteModel() };
    this.getCurrentTool().mousemove(options);
  },

  mouseup : function(e) {
    var coord = this.getMouseCoordinates(e);
    var options = { x: coord.x, y: coord.y, sprite: this.getCurrentSpriteModel() };
    this.getCurrentTool().mouseup(options);
  },

  // ---------------------------------------  
  // Sprite Models
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
    if(this.zoomCanvas.width === this.spriteSize.width) return false;
    this.zoom--;
    this.updateZoom(false);
  },

  clearZoomCanvas : function() {
    this.zoomContext.clearRect(0, 0, this.zoomCanvas.width, this.zoomCanvas.height);
  },

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
            this.zoomContext.fillRect( x * zoom, y * zoom, zoom, zoom );
        }

    }
  },

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

  updateZoom : function(clear) {
    var clear = clear || true;
    this.zoomCanvas.width     = this.zoom * this.spriteSize.width;
    this.zoomCanvas.height    = this.zoom * this.spriteSize.height;
    this.tempCanvas[0].width  = this.zoomCanvas.width;
    this.tempCanvas[0].height = this.zoomCanvas.height;

    if(clear) this.clearZoomCanvas();
    var imgData = this.getCurrentSpriteModel().context.getImageData(0, 0, this.spriteSize.width, this.spriteSize.height);
    //this.zoomImageData(imgData);
  },

  // ---------------------------------------
  // Temp canvas

  showTempCanvas : function() {    
    // Set position of temp canvas and show it
    var canvasObject = $("#zoomCanvas");
    this.tempCanvas.css({     
                            left: canvasObject.position().left,
                            top: canvasObject.position().top,
                            width: canvasObject.width(),
                            height: canvasObject.height()
                        }).attr("width" , canvasObject.width()).attr("height" , canvasObject.height()).show();
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
    var canvasObjects = $('.canvas').not('#canvas-template, #canvas-sketch, #zoomCanvas');
    canvasObjects.hide();
    canvasObjects.eq(this.currentFrameIndex).show();

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

    //x = Math.floor(x / this.zoom);
    //y = Math.floor(y / this.zoom);
    x = Math.floor(x);
    y = Math.floor(y);

    return { x: x, y: y };
  },

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

  },

  loadImageToCanvas : function(_url) {

    var w = App.paintController.zoomCanvas.width;
    var h = App.paintController.zoomCanvas.height;
    var img = new Image;
    img.src = _url;
    
    img.width = w;
    img.height = h;

    img.onload = function() {
      App.paintController.zoomContext.drawImage(img, 0,0, w, h);      
      App.paintController.drawToSprite();
    };
  }

});
