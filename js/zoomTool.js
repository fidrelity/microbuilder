ZoomTool = function() {
  this.init();
}

ZoomTool.prototype.init = function() {
  this.canvas = $('#webglCanvas');
  this.webGLRenderer = new WebGLRenderer();
  this.gridSize = 4;
}

ZoomTool.prototype.setTexture = function(canvas) {
  this.webGLRenderer.setTexture(Paint.getCurrentCanvasDom()[0]);
}

ZoomTool.prototype.resizeCanvas = function () {
  var newWidth = this.webGLRenderer.texture.image.width * this.gridSize;
  var newHeight = this.webGLRenderer.texture.image.height * this.gridSize;
  
  this.canvas.css({
      width : newWidth, 
      height: newHeight
    }).attr('width', newWidth).attr('height', newHeight);
  this.canvas.height = this.webGLRenderer.canvas.width * this.gridSize;
  
  this.webGLRenderer.resizeCanvas(newWidth, newHeight);
}

ZoomTool.prototype.zoomIn = function() {
  this.gridSize += 2;
  this.resizeCanvas();
};
  
ZoomTool.prototype.zoomOut = function() {
  this.gridSize -= 2;
  this.resizeCanvas();
};
