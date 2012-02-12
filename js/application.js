 Array.prototype.copy = function() {
        var tempClone = [];
        for (var i = 0; i < this.length; i++) {
          tempClone.push(this[i]);
        }
        return tempClone;
};

// ---------------------------------------
// SPRITEAREA CLASS
// ---------------------------------------
var SpriteArea = function(_id, _index, _sourceCanvas) {
  this.id = _id;
  this.index = _index;
  this.canvas = document.getElementById(this.id);
  this.context = this.canvas.getContext('2d');
  this.canvasObject = $('#' + this.id);

  this.lastPaintIndex = 0;
  this.undoArray = [];

  this.clickX     = [];
  this.clickY     = [];
  this.clickDrag  = [];
  this.clickColor = [];
  this.lineSizes  = [];
  this.lineWidth;
};
//
SpriteArea.prototype.redraw = function() {
    this.clearCanvas();
    //this.context.lineJoin = "round";

    for(var i=0; i < this.clickX.length; i++)
    {
      /*
        this.context.beginPath();
        if(this.clickDrag[i] && i){
            this.context.moveTo(this.clickX[i-1], this.clickY[i-1]);
        } else {
            this.context.moveTo(this.clickX[i]-1, this.clickY[i]);
        }
        this.context.lineTo(this.clickX[i], this.clickY[i]);
        this.context.closePath();
        this.context.strokeStyle = this.clickColor[i];
        this.context.lineWidth = this.lineSizes[i];
        this.context.stroke();
      */

      this.context.beginPath();
      this.context.rect(this.clickX[i], this.clickY[i], this.lineSizes[i], this.lineSizes[i]);
      this.context.fillStyle = this.clickColor[i]; //"#8ED6FF";
      this.context.fill();
      //this.context.lineWidth = 5;
      //this.context.strokeStyle = "black";
      //this.context.stroke();


    }
};
//
SpriteArea.prototype.clearCanvas = function(_reset) {
    this.canvas.width = this.canvas.width;
    if(_reset) {
        this.clickX = [];
        this.clickY = [];
        this.clickDrag = [];
        this.clickColor = [];
        this.lineSizes = [];
    }
};

//
SpriteArea.prototype.undo = function() {
  if(this.undoArray.length == 0) return false;

  var lastPaint = this.undoArray.pop();
  var startIndex = lastPaint[0];
  var stopIndex = lastPaint[1] - lastPaint[0];

  this.clickX.splice(startIndex, stopIndex);
  this.clickY.splice(startIndex, stopIndex);
  this.clickDrag.splice(startIndex, stopIndex);
  this.clickColor.splice(startIndex, stopIndex);
  this.lineSizes.splice(startIndex, stopIndex);

  this.redraw();
};


// ----------------------------------------
// PAINT CLASS
// ----------------------------------------
Paint = function(_canvas) {
    this.paintObject    = $('#paints');
    this.canvasObjects  =  $('.canvas');
    this.canvasTemplate = $('#canvas-template');

    this.shiftKey = false;
    this.init();
};

// ----------------------------------------
Paint.prototype.init = function() {
    this.color = "#df4b26";
    this.isPaint = false;
    this.lineWidth = 5;

    this.isZoom = false;
    this.spriteAreas = [];
    this.addCanvas();

    this.playInterval = null;
    this.playDelay = 100;
    // Dom Ojects
    this.toolButtons = $('.tool');
    this.pencilToolButton = $('#pencilToolButton');
    this.zoomInButton = $('#zoomInButton');
    // Events
    this.canvasObjects.live("mousedown",  $.proxy(this.mouseDown, this));
    this.canvasObjects.live("mousemove",  $.proxy(this.mouseMove, this));
    this.canvasObjects.live("mouseup",    $.proxy(this.mouseUp, this));
    this.canvasObjects.live("mouseleave", $.proxy(this.mouseUp, this));
    //
    this.toolButtons.live("click", $.proxy(this.highlightTool, this));
    this.pencilToolButton.live("click", $.proxy(this.activatePaintTool, this));
    this.zoomInButton.live("click", $.proxy(this.zoomIn, this));
    $('#undoButton').live("click", $.proxy(this.undo, this));
    // Key
    $(document).keydown($.proxy(this.keyEvent, this));
    //
    this.deactivateTools();
    this.activatePaintTool();
    this.pencilToolButton.addClass('active-tool');
};

// ---------------------------------------
Paint.prototype.setCurrentCanvas = function(_id) {
  this.currentCanvas = _id;
  this.setFocus();
};

//
Paint.prototype.getCurrentCanvasInstanz = function() {
  return this.getCanvasById(this.currentCanvas);
};

//
Paint.prototype.getCurrentCanvasDom = function() {
  return $('#' + this.currentCanvas);
};

//
Paint.prototype.getCanvasById = function(_id) {
  for (var i = this.spriteAreas.length - 1; i >= 0; i--) {
    var area = this.spriteAreas[i];
    if(area.id == _id)
      return area;
  };
  return null;
};

Paint.prototype.setFocus = function() {
  $('.canvas').removeClass('canvas-selected');
  this.getCurrentCanvasDom().addClass('canvas-selected');
};

// ----------------------------------------
Paint.prototype.deactivateTools = function() {
  this.selectTool = false;
  this.paintTool  = false;
  $('#pencilWrapper').hide();
};

Paint.prototype.activatePaintTool = function() {
  this.deactivateTools();
  this.paintTool = true;
  $('#pencilWrapper').show();
};

Paint.prototype.highlightTool = function(e) {
  this.toolButtons.removeClass('active-tool');
  $('#' + e.currentTarget.id).addClass('active-tool');
};

// ----------------------------------------
Paint.prototype.mouseDown = function(e) {
  this.setCurrentCanvas(e.currentTarget.id);

  if(this.paintTool) {
    this.isPaint = true;
    var x = this.isZoom ? e.pageX - 20 : e.pageX - this.getCurrentCanvasDom().offset().left;
    var y = this.isZoom ? e.pageY - 20 : e.pageY - this.getCurrentCanvasDom().offset().top;
    //console.log(x, y, this.getCurrentCanvasDom().offset().left, this.getCurrentCanvasDom().position().left, this.getCurrentCanvasDom().css('right'));
    this.getCurrentCanvasInstanz().lastPaintIndex = this.getCurrentCanvasInstanz().clickX.length;
    this.addClick(x, y);
    this.getCurrentCanvasInstanz().redraw();
  }
};

// ----------------------------------------
Paint.prototype.mouseMove = function(e) {
    if(this.isPaint){
      var x = this.isZoom ? e.pageX - 20 : e.pageX - this.getCurrentCanvasDom().offset().left;
      var y = this.isZoom ? e.pageY - 20 : e.pageY - this.getCurrentCanvasDom().offset().top;
      this.addClick(x, y, true);
      this.getCurrentCanvasInstanz().redraw();
    }
};

// ----------------------------------------
Paint.prototype.mouseUp = function(e) {
  this.isPaint = false;
  this.getCurrentCanvasInstanz().undoArray.push(new Array(this.getCurrentCanvasInstanz().lastPaintIndex, this.getCurrentCanvasInstanz().clickX.length));
};

// ----------------------------------------
Paint.prototype.setColor = function(_color) {
  if(!_color) return false;
  this.color = _color;
};

// ----------------------------------------
Paint.prototype.setSize = function(_size) {
  if(!_size) return false;
  this.lineWidth = _size;
  $('#pencilSizePreview').css({ width: _size, height: _size});
};
// ----------------------------------------
Paint.prototype.addCanvas = function(copyCanvas) {
  // Dom Object
  var clone = this.canvasTemplate.clone();
  var id = 'canvas' + $('.canvas').length;
  clone.attr('id', id).fadeIn();
  this.paintObject.append(clone);

  var spriteArea = new SpriteArea(id, this.spriteAreas.length);
  this.setCurrentCanvas(id);

  if(copyCanvas) {
    var canvasToCopy = this.spriteAreas.length == 0 ? null : this.spriteAreas[this.spriteAreas.length - 1];

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

  this.spriteAreas.push(spriteArea);
};

Paint.prototype.clearCanvas = function(_reset) {
  var spriteArea = this.getCurrentCanvasInstanz();

  if(spriteArea.lineSizes.length == 0)
    this.removeCanvas(spriteArea);
  else
    spriteArea.clearCanvas(true);
};

Paint.prototype.removeCanvas = function(spriteArea) {
  if(this.spriteAreas.length == 1) return false;

  var prev = $('#' + spriteArea.id).prev();
  this.setCurrentCanvas(prev.prop('id'));

  var index = spriteArea.index;
  this.getCurrentCanvasDom().remove();
  this.spriteAreas.splice(index, 1);
};

Paint.prototype.switchView = function() {
  if(this.spriteAreas.length == 1) return false;

  if($('.canvas').hasClass('canvas-over'))
    this.floatSprites();
  else
    this.overSprites();
}

Paint.prototype.floatSprites = function() {
  $('.canvas').removeClass('canvas-over').addClass('canvas-float');
};

Paint.prototype.overSprites = function() {
  $('.canvas').removeClass('canvas-float').addClass('canvas-over');
};

Paint.prototype.zoomIn = function() {
  this.isZoom = true;
  this.canvasOffsetLeft = this.getCurrentCanvasDom().offset().left;
  this.canvasOffsetTop = this.getCurrentCanvasDom().offset().top;

  zoom.in({
    element: document.querySelector('#' + this.getCurrentCanvasDom().attr('id'))
  });
};

Paint.prototype.zoomOut = function() {
  zoom.out();
  this.isZoom = false;
};

//
Paint.prototype.play = function() {
  this.overSprites();
  this.currentCanvasIndex = 1;
  this.playDelay = parseInt($('#playDelay').val());
  this.showFrame();
};

Paint.prototype.showFrame = function() {
  $('.canvas').hide();
  $('.canvas').eq(this.currentCanvasIndex).show();

  if($('.canvas:visible').index() == this.spriteAreas.length) {
    clearTimeout(this.playInterval);
    $('.canvas').not('#canvas-template').show();
    return false;
  }

  this.currentCanvasIndex++;

  var that = this;
  this.playInterval = setTimeout(function(){ that.showFrame() }, this.playDelay);
}

// ----------------------------------------
Paint.prototype.addClick = function(_x, _y, _dragging) {
  var centerize = (this.lineWidth / 2);
  this.getCurrentCanvasInstanz().clickX.push(_x - centerize);
  this.getCurrentCanvasInstanz().clickY.push(_y - centerize);
  this.getCurrentCanvasInstanz().clickDrag.push(_dragging);
  this.getCurrentCanvasInstanz().clickColor.push(this.color);
  this.getCurrentCanvasInstanz().lineSizes.push(this.lineWidth);
};

Paint.prototype.undo = function() {
  this.getCurrentCanvasInstanz().undo();
};

// ----------------------------------------
Paint.prototype.keyEvent = function(e) {
  //console.log(e.keyCode);

  switch(e.keyCode) {
    case(16) : this.shiftKey = true; break;
  }

  if(e.keyCode == 17 && e.keyCode == 90) {
    this.undo();
  }
};

// ----------------------------------------
Paint.prototype.saveImage = function(_speech, _author) {
  if(this.clickX.length < 50) {
      alert("Sorry, but it seems you didn't draw something!"); return false;
  }
  if(!_author) {
      alert("Please enter your name!"); return false;
  }

  //var img = this.canvas.toDataURL("image/png");
  //document.write('<img src="'+img+'"/>');

  /*
  var imageData = this.context.getImageData();
  $.post('/upload',
  {
          author : _author,
          img : this.canvas.toDataURL('image/jpeg')
  },
  function(data) {});
  */
};

// ----------------------------------------
$(document).ready(function() {
    var paint = new Paint('#canvas1');


    $('#playButton').click(function(){
        paint.play();
    });

    $('#switchViewButton').click(function(){
      paint.switchView();
    });

    $('#addCanvasButton').click(function(){
      paint.addCanvas();
    });

    $('#copyCanvasButton').click(function(){
      paint.addCanvas(true);
    });

    $('#clearCanvasButton').click(function(){
      paint.clearCanvas(true);
    });


    $('#selectToolButton').click(function(){
      paint.deactivateTools();
      paint.selectTool = true;
    });


    $('.colorBlock').click(function(){
      paint.setColor($(this).prop("id"));

      $('.colorBlock').removeClass("activeColor");
      $(this).addClass("activeColor");
    });

    $('.sizeBlock').click(function(){
        paint.setSize($(this).prop("id"));

        $('.sizeBlock').removeClass("activeColor");
        $(this).addClass("activeColor");
    });

    $('#saveButton').click(function() {

        var speech = $("#speechName").val();

        paint.saveImage(speech);
    });

    $("#sizeSlider").slider({
      value:5,
      min: 1,
      max: 40,
      step: 1,
      change: function( event, ui ) {
          paint.setSize(ui.value);
      }
    });

    $("#canvasSizeSlider").slider({
      value:64,
      min: 64,
      max: 256,
      step: 16,
      change: function( event, ui ) {
        $('#sizeSample').css({width : ui.value, height: ui.value});
        $('.canvas').css({width : ui.value, height: ui.value});
        $('canvas').attr('width', ui.value).attr('height', ui.value);
      }
    });

    $('#goToPaintButton').click(function() {
      $('#introWrapper').hide();
      $('#paintWrapper').show();
    });

});