/*
  PaintController
  
  - manages the graphic being saved
*/
var PaintController =  Ember.ArrayController.extend({

  graphic : null,
  //
  content : [],       // sprites
  mode : null,        // [ 'graphic', 'background' ]
  tabState : 'paint',  // Different views [ 'paint', 'setSize' ]
  spriteSize : null,
  currentSprite : null,
  currentTool : null,
  spriteWrapper : 'paints',
  //
  color : "#000000",
  size : 1,
  zoom : 4,
  //  

  //
  init : function() {
    this.spriteSize = { width: 64, height: 64};
    // Add first Sprite
    //this.addObject(SpriteModel.create({ id: 0, width: this.spriteSize.width, height: this.spriteSize.height, wrapper: this.spriteWrapper }));
    //this.toolBox = ToolBox.create();
  },

  // Should be called when Paint_View called
  initView : function() {
    // Switch
      // isBackground
      // setImageSize

    this.pixelDrawer = new PixelDrawer();
    //this.zoomTool = new ZoomTool();

    this.add();
    
    //this.zoomTool.resizeCanvas();
    this.finalCanvas = $('#sprite-canvas');

    this.zoomCanvas = document.getElementById("zoomCanvas");
    this.zoomContext = this.zoomCanvas.getContext("2d");
  },

  // ---------------------------------------
  save : function() {

    // Stop Animation

    var imageTitle = $("#imageName").val();
    var makePublic = $("#makePublic").is(":checked") ? 1 : 0;

    var count = this.content.length;
    var width = this.spriteSize.width;
    var totalWidth = count * width;
    var height = this.spriteSize.height;
    
    this.finalCanvas.attr('width', totalWidth).attr('height', height).show();
    var canvas = document.getElementById(this.finalCanvas.attr('id'));
    var context = canvas.getContext('2d');

    if(!imageTitle || !count) { alert("No Name!"); return false;}

    // Merge canvases
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

  reset : function() {
    // delete all sprites, except first 
    // clear first one
    // 
  },

  // Undo current SpriteModel
  undo : function() {
    this.getCurrentSpriteModel().popState();
    this.clearZoomCanvas();
    var imgData = this.getCurrentSpriteModel().context.getImageData(0, 0, this.spriteSize.width, this.spriteSize.height);
    this.zoomImageData(imgData);
  },

    // Undo current SpriteModel
  clearCurrentSprite : function() {
    this.getCurrentSpriteModel().clear();
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

    // Set marker position
    var left = (coord.x - (this.size / 2)) * this.zoom;//this.zoomTool.gridSize;
    var top = (coord.y - (this.size / 2)) * this.zoom;//this.zoomTool.gridSize;
    $("#marker").css({left: left, top: top, width: this.size * this.zoom, height: this.size * this.zoom});
  },

  // ---------------------------------------  
  add : function() {
    this.addObject(SpriteModel.create({ id: this.content.length, width: this.spriteSize.width, height: this.spriteSize.height, wrapper: this.spriteWrapper }));
  },

  // ---------------------------------------  
  // Getter And Setter
  setCurrentSpriteModel : function(spriteModel) {
    this.set('currentSprite', spriteModel);
    this.pixelDrawer.setCanvasContext(spriteModel.canvas);
  },

  getCurrentSpriteModel : function() {
    return this.content[this.currentSprite];
  },

  getCurrentTool : function() {
    return App.ToolBox.getCurrentTool();
  },

  setColor : function(_color) {
    var color = _color || "#000000";
    this.color = color.substr(0,1) != '#' ? '#' + color : color;
  },

  setSize : function(_size) {
    this.size = _size || 1;
  },

  // ---------------------------------------
  showPaintView : function() {
    this.set( 'tabState', 'paint' );
  },

  showSizeView : function() {
    this.set( 'tabState', 'setSize' );
  },

  // ---------------------------------------
  zoomIn : function() {
    this.zoom++;
  },

  zoomOut : function() {
    this.zoom--;
  },

  clearZoomCanvas : function() {
    this.zoomContext.clearRect(0, 0, this.zoomCanvas.width, this.zoomCanvas.height);
  },

  zoomImageData : function( imageData, _zoom ) {
    var zoom = zoom || this.zoom;

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

  // ---------------------------------------
  // Helper
  getMouseCoordinates : function(e) {
    var zoomCanvas = $('#zoomCanvas');
    var x = e.pageX - zoomCanvas.offset().left;
    var y = e.pageY - zoomCanvas.offset().top;

    x = Math.floor(x / this.zoom);
    y = Math.floor(y / this.zoom);

    return { x: x, y: y };
  }

});