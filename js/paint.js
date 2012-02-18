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
    Paint.webGLRenderer = new WebGLRenderer();

    // Init vars with default value
    Paint.isPaint       = false;
    Paint.lineWidth     = 4;
    Paint.gridSize      = 4;
    Paint.isZoom        = false;
    Paint.spriteAreas   = [];
    Paint.playInterval  = null;
    Paint.playDelay     = 100;

    // Events
    // Canvas
    Paint.canvasObjects.live("mousedown",  $.proxy(Paint.mouseDown, Paint));
    Paint.canvasObjects.live("mousemove",  $.proxy(Paint.mouseMove, Paint));
    Paint.canvasObjects.live("mouseup",    $.proxy(Paint.mouseUp, Paint));
    Paint.canvasObjects.live("mouseleave", $.proxy(Paint.mouseUp, Paint));
    // Tools
    Paint.toolButtons.live("click", $.proxy(Paint.highlightTool, Paint));
    Paint.pencilToolButton.live("click", $.proxy(Paint.activatePaintTool, Paint));
    $('#eraserToolButton').live("click", $.proxy(Paint.activateEraserTool, Paint));
    $('#flipvButton').live("click", $.proxy(Paint.flipV, Paint));
    $('#undoButton').live("click", $.proxy(Paint.undo, Paint));
    $('#playButton').click(function(){ Paint.play(); });
    $('#switchViewButton').click(function(){ Paint.switchView(); });
    $('#addCanvasButton').click(function(){ Paint.addCanvas(); });
    $('#copyCanvasButton').click(function(){ Paint.addCanvas(true); });
    $('#clearCanvasButton').click(function(){ Paint.clearCanvas(true);});
    $('#outlineButton').click(function(){ Paint.getCurrentCanvasInstanz().outlinePoints();});
    $('#selectToolButton').click(function(){ Paint.deactivateTools(); Paint.selectTool = true;});
    // Slider
    $("#sizeSlider").slider({
      value: Paint.lineWidth, min: 1, max: 40, step: 4,
      change: function( event, ui ) {
        Paint.setSize(ui.value);
      }
    });
    $("#canvasSizeSlider").slider({
      value: 64, min: 64, max: 256, step: 64,
      slide: function( event, ui ) {
        $('#sizeSample').css({width : ui.value, height: ui.value});
        $('.canvas').css({width : ui.value, height: ui.value});
        $('.canvas').attr('width', ui.value).attr('height', ui.value);
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

    var coordinates = Paint.getCooridnates(e);
    var currentInstanz = Paint.getCurrentCanvasInstanz();

    // Draw with pencil
    if(Paint.paintTool) {
      Paint.isPaint = true;
      currentInstanz.lastPaintIndex = currentInstanz.clickX.length;
      Paint.addClick(coordinates.x, coordinates.y);
      currentInstanz.redraw();
    }

    // Erase tool
    if(Paint.eraserTool) {
      currentInstanz.eraseArea(coordinates.x, coordinates.y);
    }

  },

  //
  mouseMove : function(e) {
    var coordinates = Paint.getCooridnates(e);

    if(Paint.isPaint) {
      Paint.addClick(coordinates.x, coordinates.y, true);
      Paint.getCurrentCanvasInstanz().redraw();
    }
  },

  //
  mouseUp : function(e) {
    Paint.isPaint = false;
    Paint.getCurrentCanvasInstanz().undoArray.push(new Array(Paint.getCurrentCanvasInstanz().lastPaintIndex, Paint.getCurrentCanvasInstanz().clickX.length));
  },

  // ----------------------------------------
  addCanvas : function(copyCanvas) {
    // Dom Object
    var clone = Paint.canvasTemplate.clone();
    var id = 'canvas' + $('.canvas').length;
    clone.attr('id', id).fadeIn();
    Paint.paintObject.append(clone);

    var spriteArea = new SpriteArea(id, Paint.spriteAreas.length);
    Paint.setCurrentCanvas(id);

    if(copyCanvas) {
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

    Paint.spriteAreas.push(spriteArea);
  },

  addClick : function(_x, _y, _dragging) {
    var centerize = (Paint.lineWidth / 2);
    Paint.getCurrentCanvasInstanz().clickX.push(_x - centerize);
    Paint.getCurrentCanvasInstanz().clickY.push(_y - centerize);
    Paint.getCurrentCanvasInstanz().clickDrag.push(_dragging);
    Paint.getCurrentCanvasInstanz().clickColor.push(ColorPalette.currentColor);
    Paint.getCurrentCanvasInstanz().lineSizes.push(Paint.lineWidth);
  },

  undo : function() {
    Paint.getCurrentCanvasInstanz().undo();
  },

  clearCanvas : function(_reset) {
    var spriteArea = Paint.getCurrentCanvasInstanz();

    if(spriteArea.lineSizes.length == 0)
      Paint.removeCanvas(spriteArea);
    else
      spriteArea.clearCanvas(true);

    Paint.closeOutlineBox();
  },

  removeCanvas : function(spriteArea) {
    if(Paint.spriteAreas.length == 1) return false;

    var prev = $('#' + spriteArea.id).prev();
    Paint.setCurrentCanvas(prev.prop('id'));

    var index = spriteArea.index;
    Paint.getCurrentCanvasDom().remove();
    Paint.spriteAreas.splice(index, 1);
  },

  // ----------------------------------------
  // Canvas Operations

  flipV : function() {
    Paint.getCurrentCanvasInstanz().flip(-1);
  },

  switchView : function() {
    if(Paint.spriteAreas.length == 1) return false;

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

  //
  play : function() {
    Paint.overSprites();
    Paint.currentCanvasIndex = 1;
    Paint.playDelay = parseInt($('#playDelay').val());
    Paint.showFrame();
  },

  showFrame : function() {
    Paint.canvasObjects.hide();
    Paint.canvasObjects.eq(Paint.currentCanvasIndex).show();

    if($('.canvas:visible').index() == Paint.spriteAreas.length) {
      clearTimeout(Paint.playInterval);
      Paint.canvasObjects.not('#canvas-template').show();
      return false;
    }

    Paint.currentCanvasIndex++;

    var that = Paint;
    Paint.playInterval = setTimeout(function(){ that.showFrame() }, Paint.playDelay);
  },

  // ----------------------------------------
  keyEvent : function(e) {
    //console.log(e.keyCode);

    switch(e.keyCode) {
      case(16) : Paint.shiftKey = true; break;
    }

    if(e.keyCode == 17 && e.keyCode == 90) {
      Paint.undo();
    }
  },

  // ----------------------------------------
  saveImage : function(_speech, _author) {
    if(Paint.clickX.length < 50) {
        alert("Sorry, but it seems you didn't draw anything!"); return false;
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
  getCooridnates : function(e) {
    var x = e.pageX - Paint.getCurrentCanvasDom().offset().left;
    var y = e.pageY - Paint.getCurrentCanvasDom().offset().top;

    gridX = Math.floor(x / Paint.gridSize);
    gridY = Math.floor(y / Paint.gridSize);

    x = gridX * Paint.gridSize;
    y = gridY * Paint.gridSize;

    return {x: x, y: y};
  },

  // Set pencil line size
  setSize : function(_size) {
    if(!_size) return false;
    Paint.lineWidth = _size;
    $('#pencilSizePreview').css({ width: _size, height: _size});
  },

  //
  setCurrentCanvas : function(_id) {
    Paint.currentCanvas = _id;
    Paint.webGLRenderer.setTexture(Paint.getCurrentCanvasInstanz());
    Paint.setFocus();
  },

  // Returns current canvas as instanz
  getCurrentCanvasInstanz : function() {
    return Paint.getCanvasById(Paint.currentCanvas);
  },

  // Returns current canvas as DOM object
  getCurrentCanvasDom : function() {
    return $('#' + Paint.currentCanvas);
  },

  // Returns SpriteArea instanz - searched by id
  getCanvasById : function(_id) {
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
};

// ----------------------------------------
$(document).ready(function() {
  Paint.init();

  $('#goToPaintButton').click(function() {
    $('#introWrapper').hide();
    $('#paintWrapper').show();
  });
});