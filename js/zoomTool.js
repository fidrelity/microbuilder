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
  this.webGLRenderer.resizeCanvas(this.gridSize);
  this.canvas.width = this.webGLRenderer.canvas.width * this.gridSize;
  this.canvas.height = this.webGLRenderer.canvas.width * this.gridSize;
}

ZoomTool.prototype.zoomIn = function() {
  this.gridSize += 2;
  this.resizeCanvas();
};
  
ZoomTool.prototype.zoomOut = function() {
  this.gridSize -= 2;
  this.resizeCanvas();
};
