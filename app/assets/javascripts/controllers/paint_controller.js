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
    this.zoomTool = new ZoomTool();

    this.add();
    
    this.zoomTool.resizeCanvas();
    this.finalCanvas = $('#sprite-canvas');
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
    this.zoomTool.updateTexture();
  },

  mousemove : function(e) {    
    var coord = this.getMouseCoordinates(e);
    var options = { x: coord.x, y: coord.y, sprite: this.getCurrentSpriteModel() };
    this.getCurrentTool().mousemove(options);
    this.zoomTool.updateTexture();

    // Set marker position
    var left = (coord.x - (this.size / 2)) * this.zoomTool.gridSize;
    var top = (coord.y - (this.size / 2)) * this.zoomTool.gridSize;
    $("#marker").css({left: left, top: top, width: this.size * this.zoomTool.gridSize, height: this.size * this.zoomTool.gridSize});
  },

  // ---------------------------------------  
  add : function() {
    this.addObject(SpriteModel.create({ id: this.content.length, width: this.spriteSize.width, height: this.spriteSize.height, wrapper: this.spriteWrapper }));
  },

  // ---------------------------------------  
  // Getter And Setter
  setCurrentSpriteModel : function(spriteModel) {
    this.set('currentSprite', spriteModel);
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
    this.zoomTool.zoomIn();
  },

  zoomOut : function() {
    this.zoomTool.zoomOut();
  },

  // ---------------------------------------
  // Helper
  getMouseCoordinates : function(e) {
    var zoomCanvas = this.zoomTool.zoomCanvas;
    var x = e.pageX - zoomCanvas.offset().left;
    var y = e.pageY - zoomCanvas.offset().top;

    x = Math.floor(x / this.zoomTool.gridSize);
    y = Math.floor(y / this.zoomTool.gridSize);

    return { x: x, y: y };
  }

});