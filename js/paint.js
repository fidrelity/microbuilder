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
    Paint.pencilToolButton  = $('#pencilToolButton');

    // Init other classes
    ColorPalette.init();
    Paint.zoomTool = new ZoomTool;
    Paint.pixelDrawer = new PixelDrawer();

    // Init vars with default value
    Paint.isPaint       = false;
    Paint.paintTool     = false;
    Paint.lineWidth     = 4;
    Paint.gridSize      = 4;
    Paint.spriteAreas   = [];
    Paint.playInterval  = null;
    Paint.playDelay     = 100;
    Paint.areaId        = 0;

    // Events
    // Canvas
    Paint.canvasObjects.live("mousedown",  $.proxy(Paint.mouseDown, Paint));
    // Paint.canvasObjects.live("mousemove",  $.proxy(Paint.mouseMove, Paint));
    // Paint.canvasObjects.live("mouseup",    $.proxy(Paint.mouseUp, Paint));
    // Paint.canvasObjects.live("mouseleave", $.proxy(Paint.mouseUp, Paint));
    
    Paint.zoomTool.canvas.live("mousedown",  $.proxy(Paint.mouseDownZoom, Paint));
    Paint.zoomTool.canvas.live("mousemove",  $.proxy(Paint.mouseMove, Paint));
    Paint.zoomTool.canvas.live("mouseup",    $.proxy(Paint.mouseUp, Paint));
    Paint.zoomTool.canvas.live("mouseleave", $.proxy(Paint.mouseUp, Paint));
        
    // Tools
    Paint.toolButtons.live("click", $.proxy(Paint.highlightTool, Paint));
    Paint.pencilToolButton.live("click", $.proxy(Paint.activatePaintTool, Paint));
    $("#lineToolButton").live("click", $.proxy(Paint.activateLineTool, Paint));
    $('#eraserToolButton').live("click", $.proxy(Paint.activateEraserTool, Paint));
    $('#flipvButton').live("click", $.proxy(Paint.flipV, Paint));
    $('#undoButton').live("click", $.proxy(Paint.undo, Paint));    
    $('#switchViewButton').click(function(){
      Paint.switchView();
    });
    $('#addCanvasButton').click(function(){
      Paint.addCanvas();
    });
    $('#copyCanvasButton').click(function(){
      Paint.addCanvas(true);
    });
    $('#clearCanvasButton').click(function(){
      Paint.clearCanvas(true);
    });
    $('#removeCanvasButton').click(function(){
      Paint.removeCanvas();
    });
    
    $('#outlineButton').click(function(){
      Paint.getCurrentSpriteAreaInstance().outlinePoints();
    });
    $('#selectToolButton').click(function(){
      Paint.deactivateTools();
      Paint.selectTool = true;
    });

    $('#playButton').click(function(){
      Paint.initPlay();
    });
    $('#stopButton').click(function(){
      Paint.stopAnimation();
    });
    $("playDelay").change(function(){
      Paint.playDelay = parseInt($(this).val());
    });

    
    $('#zoomInButton').click(function(){
      Paint.zoomTool.zoomIn();
    });
    $('#zoomOutButton').click(function(){
      Paint.zoomTool.zoomOut();
    });
    
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

    var availableSizes = [32,64,128,256];
    $("#canvasSizeSlider").slider({
      value: 1, 
      min: 0, 
      max: 3, 
      step: 1,
      slide: function( event, ui ) {
        var size = availableSizes[ui.value];      
              
        $('#sizeSample').css({
          width : size, 
          height: size
        });
        $('.canvas').css({
          width : size, 
          height: size
        }).attr('width', size).attr('height', size);
      }
    });
    // Key
    $(document).keydown($.proxy(Paint.keyEvent, Paint));

    // Call Methods
    Paint.deactivateTools();
    Paint.activatePaintTool();
    Paint.pencilToolButton.addClass('active-tool');
    Paint.addCanvas();
  },

  // ----------------------------------------
  // TOOLS

  deactivateTools : function() {
    Paint.selectTool = false;
    Paint.paintTool  = false;
    Paint.eraserTool = false;
    Paint.closeOutlineBox();
    $('#pencilWrapper').hide();
  },

  activateLineTool : function() {
    Paint.deactivateTools();
    Paint.lineTool = true;
    $('#pencilWrapper').show();
  },

  activatePaintTool : function() {
    Paint.deactivateTools();
    Paint.paintTool = true;
    $('#pencilWrapper').show();
  },

  activateEraserTool : function() {
    Paint.deactivateTools();
    Paint.eraserTool = true;
  },

  highlightTool : function(e) {
    Paint.toolButtons.removeClass('active-tool');
    $('#' + e.currentTarget.id).addClass('active-tool');
  },

  // ----------------------------------------
  mouseDown : function(e) {
    Paint.setCurrentCanvas(e.currentTarget.id);
    Paint.closeOutlineBox();
  },

  mouseDownZoom : function(e) {

    var coordinates = Paint.getCoordinates(e);
    var currentInstanz = Paint.getCurrentSpriteAreaInstance();

    // Draw with pencil
    if(Paint.paintTool) {      
      Paint.isPaint = true;
      currentInstanz.lastPaintIndex = currentInstanz.clickX.length;
      Paint.addClick(coordinates.x, coordinates.y);
      currentInstanz.redraw();
    }

    // Draw line
    if(Paint.lineTool) {
      Paint.isPaint = false;
      Paint.isLine = true;
      currentInstanz.lastPaintIndex = currentInstanz.clickX.length;
      //_x1, _y1, _x2, _y2, _color
      Paint.coordX = coordinates.x;
      Paint.coordY = coordinates.y;
    //Paint.addClick(coordinates.x, coordinates.y);
    //currentInstanz.redraw();
    }

    // Erase tool
    if(Paint.eraserTool) {
      currentInstanz.eraseArea(coordinates.x, coordinates.y);
    }
  },

  //
  mouseMove : function(e) {
    var coordinates = Paint.getCoordinates(e);
    var currentCanvas = Paint.getCurrentSpriteAreaInstance();

    if(Paint.isPaint) {
      Paint.addClick(coordinates.x, coordinates.y, true);
      currentCanvas.redraw();
    }

    if(Paint.isLine) {
      Paint.pixelDrawer.popImageData();
      Paint.pixelDrawer.drawLine(Paint.coordX, Paint.coordY, coordinates.x, coordinates.y, ColorPalette.currentColor);
      Paint.pixelDrawer.pushImageData();
    }
  },

  //
  mouseUp : function(e) {
    Paint.isPaint = false;
    Paint.isLine = false;
    Paint.getCurrentSpriteAreaInstance().undoArray.push(new Array(Paint.getCurrentSpriteAreaInstance().lastPaintIndex, Paint.getCurrentSpriteAreaInstance().clickX.length));
  },

  // ----------------------------------------
  addCanvas : function(_copyCanvas) {
    // Dom Object
    var clone = Paint.canvasTemplate.clone();
    Paint.areaId++
    var id = 'canvas' + Paint.areaId;
    clone.attr('id', id).fadeIn();
    Paint.paintObject.append(clone);

    var spriteArea = new SpriteArea(id, Paint.spriteAreas.length);
    Paint.setCurrentCanvas(id);

    if(_copyCanvas) {
      var canvasToCopy = Paint.spriteAreas.length == 0 ? null : Paint.spriteAreas[Paint.spriteAreas.length - 1];

      var imagedata = canvasToCopy.canvas;
      spriteArea.context.drawImage(imagedata, 0, 0);

      var clickX     = canvasToCopy.clickX.copy();
      var clickY     = canvasToCopy.clickY.copy();
      var clickDrag  = canvasToCopy.clickDrag.copy();
      var clickColor = canvasToCopy.clickColor.copy();
      var lineSizes  = canvasToCopy.lineSizes.copy();

      spriteArea.clickX     = clickX;
      spriteArea.clickY     = clickY;
      spriteArea.clickDrag  = clickDrag;
      spriteArea.clickColor = clickColor;
      spriteArea.lineSizes  = lineSizes;
    }
    Paint.canvasObjects = $(".canvas");
    Paint.spriteAreas.push(spriteArea);
  },

  addClick : function(_x, _y, _dragging) {
    var centerize = Math.floor(Paint.lineWidth / 2);
    Paint.getCurrentSpriteAreaInstance().clickX.push(_x - centerize);
    Paint.getCurrentSpriteAreaInstance().clickY.push(_y - centerize);
    Paint.getCurrentSpriteAreaInstance().clickDrag.push(_dragging);
    Paint.getCurrentSpriteAreaInstance().clickColor.push(ColorPalette.currentColor);
    Paint.getCurrentSpriteAreaInstance().lineSizes.push(Paint.lineWidth);
  },

  undo : function() {
    Paint.getCurrentSpriteAreaInstance().undo();
  },

  clearCanvas : function(_reset) {
    var spriteArea = Paint.getCurrentSpriteAreaInstance();

    // No pixel data -> delete canvas
    if(spriteArea.lineSizes.length == 0)
      Paint.removeCanvas(spriteArea);
    else
      spriteArea.clearCanvas(true);

    Paint.closeOutlineBox();
  },

  removeCanvas : function(_spriteArea) {
    console.log(Paint.spriteAreas.length);
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
  // Canvas Operations
  flipV : function() {
    Paint.getCurrentSpriteAreaInstance().flip(-1);
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
    Paint.canvasObjects.removeClass('canvas-over').addClass('canvas-float');
  },

  overSprites : function() {
    Paint.canvasObjects.removeClass('canvas-float').addClass('canvas-over');
  },

  closeOutlineBox : function() {
    $('#outlineBox').hide();
  },

  // ----------------------------------------
  initPlay : function() {
    Paint.overSprites();
    $('#playButton').hide();
    $('#stopButton').show();
    Paint.play();
  },

  play : function() {
    Paint.currentCanvasIndex = 0;
    Paint.playDelay = parseInt($('#playDelay').val());
    Paint.showFrame();
  },

  showFrame : function() {
    Paint.canvasObjects.hide();

    var canvasObjects = $('.canvas').not('#canvas-template');
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
    Paint.canvasObjects.not('#canvas-template').show();
    $('#playButton').show();
    $('#stopButton').hide();
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
  saveImage : function(_speech, _author) {
    if(Paint.clickX.length < 50) {
      alert("Sorry, but it seems you didn't draw anything!");
      return false;
    }
  //var img = Paint.canvas.toDataURL("image/png");
  //document.write('<img src="'+img+'"/>');

  /*
    var imageData = Paint.context.getImageData();
    $.post('/upload',
    {
            author : _author,
            img : Paint.canvas.toDataURL('image/jpeg')
    },
    function(data) {});
    */
  },

  // ----------------------------------------
  // GETTER and SETTER
  // ----------------------------------------
  // Get Mouse Coordinates and return nears grid point
  getCoordinates : function(e) {
    
    var zoomCanvas = Paint.zoomTool.canvas;
    
    var x = e.pageX - zoomCanvas.offset().left;
    var y = e.pageY - zoomCanvas.offset().top;

    x = Math.floor(x / Paint.gridSize);
    y = Math.floor(y / Paint.gridSize);

    return {
      x: x, 
      y: y
    };
  },

  // Set pencil line size
  setSize : function(_size) {
    if(!_size) return false;
    Paint.lineWidth = _size;
    $('#pencilSizePreview').css({
      width: _size, 
      height: _size
    });
  },

  //
  setCurrentCanvas : function(_id) {
    if(!_id) return false;
    Paint.currentCanvas = _id;
    Paint.pixelDrawer.setCanvasContext(Paint.getCurrentCanvasDom()[0]);
    Paint.zoomTool.setTexture(Paint.getCurrentCanvasDom()[0]);
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
  
  resizeZoomCanvas : function () {
    Paint.zoomTool.resizeCanvas();
  }
};

// ----------------------------------------
$(document).ready(function() {
  Paint.init();

  $('#goToPaintButton').click(function() {
    $('#introWrapper').hide();
    $('#paintWrapper').show();
  });

  $('#drawBackgroundCheckbox').click(function() {
    $('.canvas').css({
      width : 640, 
      height: 480
    }).attr('width', 640).attr('height', 480);
  });

});