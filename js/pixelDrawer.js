PixelDrawer = function(_canvas) {
  if(_canvas) {
    this.setCanvasContest(_canvas);
  }  
  else{
    this.canvas = null;
    this.context = null;
    this.imageData = null;
    this.data = null;
    this.dataWidth = 0;
    this.dataHeight = 0;
  }
}

PixelDrawer.prototype.setCanvasContext = function(_canvas) {
  this.canvas = _canvas;
  this.context = _canvas.getContext("2d");    
}

PixelDrawer.prototype.putPixel = function (_x, _y, _color) {
  
  var color = this.parseColor(_color);

  this.colorPixel(_x,_y,color);
}

PixelDrawer.prototype.fillRect = function(_x,_y, _width, _height, _color) {
  var color = this.parseColor(_color);
  for(var i = 0; i < _width; i++) {
    for(var j = 0; j < _height; j++) {
      this.colorPixel(_x+i,_y+j, color);
    }
  }
}
PixelDrawer.prototype.colorPixel = function (_x,_y,_color) {
  var colorIndex = ((_y*(this.dataHeight*4)) + (_x*4));
  
  this.data[colorIndex] = _color.r;
  this.data[colorIndex+1] = _color.g;
  this.data[colorIndex+2] = _color.b;
  this.data[colorIndex+3] = _color.a;
}

PixelDrawer.prototype.parseColor = function(_color) {
  return new function () {
    
    if(_color.charAt(0)=="#") 
      _color = _color.substring(1);
    
    this.r = parseInt(_color.substr(0,2), 16);
    this.g = parseInt(_color.substr(2,2), 16);
    this.b = parseInt(_color.substr(4,2), 16);
    this.a = parseInt(_color.substr(6,2), 16);
    
    if(!this.a) {
      this.a = 255;
    }
  };
}


PixelDrawer.prototype.popImageData = function() {
  try{
    this.imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    this.data = this.imageData.data;
    this.dataWidth = this.imageData.width;
    this.dataHeight = this.imageData.height;
  }
  catch(e) {
    console.log("could not pop imageData, canvas was not set.")
  }
}

PixelDrawer.prototype.pushImageData = function() {
  this.imageData.data = this.data;
  this.context.putImageData(this.imageData, 0, 0);
}