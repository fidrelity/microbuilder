ZoomTool = function() {
  this.init();
}

ZoomTool.prototype.init = function() {
  this.zoomCanvas = $('#zoomCanvas');
   
  if($.browser.webkit) {  
    this.useChrome = true;
    this.webGLRenderer = new WebGLRenderer();
  }  

  this.gridSize = 4;
}

ZoomTool.prototype.setTexture = function(_canvas) {
  this.textureCanvas = _canvas;
  this.textureWidth = this.textureCanvas.width;
  this.textureHeight = this.textureCanvas.height;
  
  if(this.useChrome) {
    this.webGLRenderer.setTexture(Paint.getCurrentCanvasDom()[0]);
  }
  else {
    var ctx = this.textureCanvas.getContext("2d");
    var ctx2 = this.zoomCanvas[0].getContext("2d");
    
    var imageData = ctx.getImageData(0, 0, this.textureWidth, this.textureHeight);
    ctx2.putImageData(imageData, 0, 0);
  }
}

ZoomTool.prototype.updateTexture = function(){
  if(this.useChrome) {
    this.webGLRenderer.updateTexture(Paint.getCurrentCanvasDom()[0]);
  }
  else {
    var ctx = this.textureCanvas.getContext("2d");
    var ctx2 = this.zoomCanvas[0].getContext("2d");
    
    var imageData = ctx.getImageData(0, 0, this.textureWidth, this.textureHeight);
    ctx2.putImageData(imageData, 0, 0);
  }
}

ZoomTool.prototype.resizeCanvas = function () {
  this.textureWidth = this.textureCanvas.width;
  this.textureHeight = this.textureCanvas.height;
  
  var newWidth = this.textureWidth * this.gridSize;
  var newHeight = this.textureHeight * this.gridSize;
  
  if(this.useChrome) {
  
    this.zoomCanvas.css({
      width : newWidth, 
      height: newHeight
    }).attr('width', newWidth).attr('height', newHeight);
    this.webGLRenderer.resizeCanvas(newWidth, newHeight);
  }
  else {
    var context = this.zoomCanvas[0].getContext('2d');
    
    this.zoomCanvas.css({
      width : newWidth, 
      height: newHeight
    }).attr('width', this.textureWidth).attr('height', this.textureHeight);
    
  }
}

ZoomTool.prototype.zoomIn = function() {
  if(this.gridSize <= 10) {
    this.gridSize += 2;
    this.resizeCanvas();
  }
};
  
ZoomTool.prototype.zoomOut = function() {
  if(this.gridSize <= 2) {
    this.gridSize = 1;
  }
  else{
    this.gridSize -= 2;
  }
  this.resizeCanvas();
};
