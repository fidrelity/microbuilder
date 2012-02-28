// ----------------------------------------
// PAINT CLASS
// ----------------------------------------
var Paint = {

  init : function() {
    // Define DOM Objects
    Paint.paintObject       = $('#paints');
    Paint.canvasObjects     = $('.canvas');
    Paint.canvasTemplate    = $('#canvas-template');
    Paint.toolButtons       = $('.tool');
    Paint.canvasSketch      = $('#canvas-sketch'); // temp canvas to draw lines
    Paint.spriteCanvasEle   = document.getElementById('canvas-sketch');
    Paint.canvasSketchContext = Paint.spriteCanvasEle.getContext('2d');
    
    Paint.spriteCanvas      = $('#sprite-canvas'); // Canvas to concat the sprites and save
    Paint.cursorRect        = $('#cursorRect');

    // Init other classes
    ToolBar.init();
    ColorPalette.init();
    Paint.zoomTool = new ZoomTool();
    Paint.pixelDrawer = new PixelDrawer();

    // Init vars with default value
    Paint.isPaint       = false;
    Paint.paintTool     = false;
    Paint.lineWidth     = 4;
    Paint.spriteAreas   = [];
    Paint.playInterval  = null;
    Paint.playDelay     = 100;
    Paint.areaId        = 0;
    Paint.isCursorRect = false;

    // Events
    // Canvas
    Paint.canvasObjects.live("click",  $.proxy(Paint.mouseDown, Paint));

    Paint.zoomTool.zoomCanvas.live("mousedown",  $.proxy(Paint.mouseDownZoom, Paint));
    Paint.zoomTool.zoomCanvas.live("mousemove",  $.proxy(Paint.mouseMove, Paint));
    Paint.zoomTool.zoomCanvas.live("mouseup",    $.proxy(Paint.mouseUp, Paint));
    //Paint.zoomTool.zoomCanvas.live("mouseleave", $.proxy(Paint.mouseUp, Paint));
    //Paint.cursorRect.live("mousedown",  $.proxy(Paint.mouseDownZoom, Paint));
    //Paint.cursorRect.live("mousemove",  $.proxy(Paint.mouseMove, Paint));
    //Paint.cursorRect.live("mouseup",    $.proxy(Paint.mouseUp, Paint));

    // Tools
    $('.switchViewButton').click(function() { Paint.switchView(); });
    $('#addCanvasButton').click(function(){ Paint.addCanvas(); });
    $('#copyCanvasButton').click(function(){ Paint.addCanvas(true); });
    $('#clearCanvasButton').click(function(){Paint.clearCanvas(true);});
    $('#removeCanvasButton').click(function(){Paint.removeCanvas();});
    // Animation
    $('#playButton').click(function(){Paint.initPlay();});
    $('#stopButton').click(function(){Paint.stopAnimation();});
    $("playDelay").change(function(){Paint.playDelay = parseInt($(this).val());});
    // 
    $('#zoomInButton').click(function(){Paint.zoomTool.zoomIn();});
    $('#zoomOutButton').click(function(){Paint.zoomTool.zoomOut();});
    
    // Slider for pencil size
    $("#sizeSlider").slider({
      value: Paint.lineWidth, 
      min: 1,
      max: 40, 
      step: 4,
      change: function( event, ui ) {
        Paint.setSize(ui.value);
      }
    });

    // Resize for canvas size
    $('#sizeSample').resizable({
      grid: 16,
      maxHeight:128,
      maxWidth:128,
      minHeight:32,
      minWidth:32,
      resize: function(event, ui) { 
        var size = ui.size;
        $('.canvas').css({
          width : size.width, 
          height: size.height
        }).attr('width', size.width).attr('height', size.height);
        Paint.resizeZoomCanvas();
      }
    });

    // Key
    $(document).keydown($.proxy(Paint.keyEvent, Paint));

    // Call Methods
    Paint.addCanvas();
    this.resizeZoomCanvas();
  },

  // ----------------------------------------
  // Canvas Events
  mouseDown : function(e) {
    Paint.setCurrentCanvas(e.currentTarget.id);
    Paint.closeOutlineBox();
  },
  // On zoomed canvas
  mouseDownZoom : function(e) {
    var coordinates = Paint.getCoordinates(e);
    ToolBar.mousedown({ coordinates : coordinates });
    this.zoomTool.updateTexture();
  },

  //
  mouseMove : function(e) {
    var coordinates = Paint.getCoordinates(e);
    ToolBar.mousemove({coordinates:coordinates});
    this.zoomTool.updateTexture();

    if(Paint.isCursorRect) {
      var posX = coordinates.x * Paint.zoomTool.gridSize;
      var posY = coordinates.y * Paint.zoomTool.gridSize;
      //console.log(posX, posY, ZoomTool.gridSize, coordinates.x)
      Paint.cursorRect.css({left: posX, top: posY});
    }
  },

  //
  mouseUp : function(e) {
    ToolBar.mouseup();
  },

  // ----------------------------------------
  addCanvas : function(_copyCanvas) {
    // Dom Object
    var clone = Paint.canvasTemplate.clone();
    Paint.areaId++;
    var id = 'canvas' + Paint.areaId;
    clone.attr('id', id).fadeIn();
    Paint.paintObject.append(clone);

    var spriteArea = new SpriteArea(id, Paint.spriteAreas.length);
    Paint.setCurrentCanvas(id);

    if(_copyCanvas) {
      var canvasToCopy = Paint.spriteAreas.length == 0 ? null : Paint.spriteAreas[Paint.spriteAreas.length - 1];

      var imagedata = canvasToCopy.canvas;
      spriteArea.context.drawImage(imagedata, 0, 0);
    }
    Paint.canvasObjects = $(".canvas");
    Paint.spriteAreas.push(spriteArea);
  },

  undo : function() {
    Paint.getCurrentSpriteAreaInstance().undo();
  },

  clearCanvas : function(_reset) {
    var spriteArea = Paint.getCurrentSpriteAreaInstance();
    spriteArea.clearCanvas();
    Paint.closeOutlineBox();
  },

  removeCanvas : function(_spriteArea) {
    if(Paint.spriteAreas.length == 1) return false;
    var spriteArea = _spriteArea || Paint.getCurrentSpriteAreaInstance(); 
    var spriteAreaDom = $('#' + spriteArea.id);

    // Set prev spriteArea as current area
    var prevArea = spriteAreaDom.prev();
    Paint.setCurrentCanvas(prevArea.attr('id'));

    // Remove dom and spriteArea instance
    spriteAreaDom.remove();
    Paint.spriteAreas.splice(spriteArea.index, 1);
  },

  // ----------------------------------------
  switchView : function() {
    if(Paint.spriteAreas.length == 1) return false;

    Paint.closeOutlineBox();

    if(Paint.canvasObjects.hasClass('canvas-over'))
      Paint.floatSprites();
    else
      Paint.overSprites();
  },

  floatSprites : function() {
    Paint.canvasObjects.not('#canvas-sketch').removeClass('canvas-over').addClass('canvas-float');
  },

  overSprites : function() {
    Paint.canvasObjects.not('#canvas-sketch').removeClass('canvas-float').addClass('canvas-over');
  },

  closeOutlineBox : function() {
    $('#outlineBox').hide();
  },

  // ----------------------------------------
  // Sprite Animation
  initPlay : function() {
    Paint.overSprites();
    $('#playButton').hide();
    $('#stopButton').show();
    $('.canvas').removeClass('canvas-selected');
    Paint.play();
  },

  play : function() {
    Paint.currentCanvasIndex = 0;
    Paint.playDelay = parseInt($('#playDelay').val());
    Paint.showFrame();
  },

  showFrame : function() {
    Paint.canvasObjects.hide();

    var canvasObjects = $('.canvas').not('#canvas-template, #canvas-sketch');
    canvasObjects.eq(Paint.currentCanvasIndex).show();

    if(Paint.currentCanvasIndex == Paint.spriteAreas.length) {
      // Loop
      if($("#replayLoop").is(":checked")) {
        Paint.play();
        return false;
      // End
      } else {        
        Paint.stopAnimation();
        return false;
      }
    }

    Paint.currentCanvasIndex++;
    Paint.playInterval = setTimeout(function(){
      Paint.showFrame()
      }, Paint.playDelay);    
  },

  stopAnimation : function() {
    clearTimeout(Paint.playInterval);
    Paint.canvasObjects.not('#canvas-template, #canvas-sketch').show();
    $('#playButton').show();
    $('#stopButton').hide();
    Paint.setFocus();
  },

  // ----------------------------------------
  keyEvent : function(e) {
    //console.log(e.keyCode);

    switch(e.keyCode) {
      case(16) :
        Paint.shiftKey = true;
        break;
    }

    if(e.keyCode == 17 && e.keyCode == 90) {
      Paint.undo();
    }
  },

  // ----------------------------------------
  saveImage : function() {

    Paint.stopAnimation();

    var count = Paint.spriteAreas.length;
    var width = Paint.canvasTemplate.width(); 
    var totalWidth = count * width;
    var height = Paint.canvasTemplate.height();
    
    Paint.spriteCanvas.attr('width', totalWidth).attr('height', height).show();
    var canvas = document.getElementById(Paint.spriteCanvas.attr('id'));
    var context = canvas.getContext('2d');

    // Merge canvases
    for (var i = 0; i < Paint.spriteAreas.length; i++) {;
      var area = Paint.spriteAreas[i];
      var xPos = i * width;
      context.drawImage(area.canvas, xPos, 0);
    };

    /*
    // Push to Server
    var imgData = Paint.spriteCanvas.toDataURL("image/png");
    $.post('/assets, {
          asset: {
            name : "dummy",
            frame_width : width,
            frame_height : height, 
            frame_count : count,
            image_data : imgData
          }
        },
    function(data) {});
    */
  },

  // ----------------------------------------
  // GETTER and SETTER
  // ----------------------------------------
  // Get Mouse Coordinates and return nears grid point
  getCoordinates : function(e) {
    
    var zoomCanvas = Paint.zoomTool.zoomCanvas;
    
    var x = e.pageX - zoomCanvas.offset().left;
    var y = e.pageY - zoomCanvas.offset().top;

    x = Math.floor(x / Paint.zoomTool.gridSize);
    y = Math.floor(y / Paint.zoomTool.gridSize);

    return {
      x: x,
      y: y
    };
  },

  // Set pencil line size
  setSize : function(_size) {
    if(!_size) return false;
    Paint.lineWidth = _size;
    Paint.cursorRect.css({ width: _size*4, height: _size*4 });
    $('#pencilSizePreview').css({width: _size, height: _size});
  },

  //
  setCurrentCanvas : function(_id) {
    if(!_id) return false;
    Paint.currentCanvas = _id;
    Paint.pixelDrawer.setCanvasContext(Paint.getCurrentCanvasDom()[0]);
    Paint.zoomTool.setTexture(Paint.getCurrentCanvasDom()[0]);
    Paint.setFocus();
  },

  // Returns current canvas as instanz
  getCurrentSpriteAreaInstance : function() {
    return Paint.getSpriteAreaByID(Paint.currentCanvas);
  },

  // Returns current canvas as DOM object
  getCurrentCanvasDom : function() {
    return $('#' + Paint.currentCanvas);
  },

  // Returns SpriteArea instanz - searched by id
  getSpriteAreaByID : function(_id) {
    for (var i = Paint.spriteAreas.length - 1; i >= 0; i--) {
      var area = Paint.spriteAreas[i];
      if(area.id == _id)
        return area;
    };
    return null;
  },

  // Sets focus on a canvas
  setFocus : function() {
    $('.canvas').removeClass('canvas-selected');
    Paint.getCurrentCanvasDom().addClass('canvas-selected');
  },

  // Puts overlaying canvas on the current canvas to draw lines temporarily
  showSketchCanvas : function() {
    var currentCanvasPosition = Paint.getCurrentCanvasDom();
    Paint.canvasToDraw = currentCanvasPosition;
    Paint.canvasSketch.css({  left: currentCanvasPosition.position().left, 
                              top: currentCanvasPosition.position().top,
                              width: currentCanvasPosition.width(),
                              height: currentCanvasPosition.height()
                          }).show();

    //var g = document.getElementById(Paint.canvasToDraw.attr('id'));
    //Paint.canvasSketchContext.drawImage(g, 0, 0);
    Paint.setCurrentCanvas(Paint.canvasSketch.attr("id"));
  },

  hideSketchCanvas : function() {
    //Paint.canvasSketchContext.clearRect(0, 0, Paint.pixelDrawer.canvas.width, Paint.pixelDrawer.canvas.height);
    Paint.setCurrentCanvas(Paint.canvasToDraw.attr("id"));
    Paint.canvasSketch.hide();
  },

  showCursorRect : function() {
    Paint.isCursorRect = true;
    console.log(Paint.isCursorRect, 'show');
    Paint.cursorRect.show();
  },

  hideCursorRect : function() {
    Paint.cursorRect.hide();
    Paint.isCursorRect = false;
  },

  resizeZoomCanvas : function () {
    Paint.zoomTool.resizeCanvas();
  }
};

// ----------------------------------------
$(document).ready(function() {
  Paint.init();

  /*
  $('#goToPaintButton').click(function() {
    //$('#introWrapper').hide();
    //$('#paintWrapper').show();
  });*/
  var slider = new SliderDiv({containerSelector: '#gfx-editor-wrapper'});

  $('#drawBackgroundCheckbox').click(function() {
    $('.canvas').css({
      width : 640, 
      height: 480
    }).attr('width', 640).attr('height', 480);
  });

});