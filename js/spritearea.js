// ---------------------------------------
// SPRITEAREA CLASS
// ---------------------------------------
var SpriteArea = function(_id, _index) {
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
};
//
SpriteArea.prototype.redraw = function(_drawAll) {
  var drawAll = _drawAll || false;

  var lastIndex = 0;
  if(!drawAll) {
    lastIndex = this.undoArray.length > 0 ? this.undoArray[this.undoArray.length - 1][0] : 0;
  } else {
    this.clearCanvas();
  }

  Paint.pixelDrawer.popImageData();
  for(var i = lastIndex; i < this.clickX.length; i++)  {
    Paint.pixelDrawer.fillRect(this.clickX[i], this.clickY[i], this.lineSizes[i], this.lineSizes[i], this.clickColor[i]);
  }
  Paint.pixelDrawer.pushImageData();
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
      this.undoArray = [];
  }
};

SpriteArea.prototype.eraseArea = function(x,y) {
  this.context.clearRect(x, y, 10, 10);
};

SpriteArea.prototype.getOutlinePoints = function() {
  var xPoints = [];
  var yPoints = [];
  for (var i = this.clickX.length - 1; i >= 0; i--) {
    xPoints.push(this.clickX[i] + this.lineSizes[i]);
    yPoints.push(this.clickY[i] + this.lineSizes[i]);
  };

  var xMin = Math.max(0, Array.min(xPoints));
  var yMin = Math.max(0, Array.min(yPoints));
  var xMax = Math.min(this.canvas.width, Array.max(xPoints));
  var yMax = Math.min(this.canvas.height, Array.max(yPoints));
  var size = Array.max(this.lineSizes);
  xMin -= size;
  yMin -= size;
  xMax += size;
  yMax += size;
  /*
    a - b
    |   |
    d - c
  */
  var a = { x: xMin, y: yMin};
  var b = { x: xMax, y: yMin};
  var c = { x: xMax, y: yMax};
  var d = { x: xMin, y: yMax};

  return [a, b, c, d];
};

SpriteArea.prototype.outlinePoints = function() {
  var points = this.getOutlinePoints();

  var bWidth = points[1].x - points[0].x;
  var bHeight = points[2].y - points[1].y;
  var bLeft = this.canvasObject.position().left + points[0].x;
  var bTop = this.canvasObject.position().left + points[0].y;

  $('#outlineBox').css({width: bWidth, height: bHeight, left: bLeft , top: bTop}).fadeIn();
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
  this.redraw(true);
};

SpriteArea.prototype.flip = function(_direction) {  
  //this.redraw(true);

  //var img = this.context.getImageData(0,0,this.canvas.width, this.canvas.height);
  //this.context.save();
  // Multiply the y value by -1 to flip vertically
  //this.context.scale(-1, 1);
  //this.redraw();
  //var imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
  //var data = imageData.data;
  //this.context.drawImage(this.canvas, 0, 0);
  // Start at (0, -height), which is now the bottom-left corner
  //this.context.drawImage(img, 0, -img.height);
  //this.context.restore();
};