     

WebGLRenderer = function() {
  this.init();
}


WebGLRenderer.prototype.mainLoop = function() {
  this.update();
  this.render();
  requestAnimFrame(this.mainLoop.bind(this));
};

WebGLRenderer.prototype.resizeCanvas = function(width, height) {
  this.gl.viewportWidth = width;
  this.gl.viewportHeight = height;
  this.gl.viewport(0, 0,width ,height);
};

WebGLRenderer.prototype.init = function(){
  console.log("StartWebGL");
  this.vertexPositionBuffer = false;
  this.textureUVBuffer = false;
  this.vertexIndexBuffer = false;
  this.projectionMatrix = false;
  this.modelMatrix = false;
  this.viewMatrix = false;
  this.shaderProgram = false;
  this.texture = false;
  this.rotationY = false; 
  this.gl = false;
  
  this.canvas = document.getElementById("webglCanvas");
  this.gl = this.canvas.getContext("experimental-webgl");
  this.gl.viewportWidth = this.canvas.width;
  this.gl.viewportHeight = this.canvas.height;

  if ( this.gl ) {
    this.gl.clearColor(0.1,0.3,0.3,1.0);
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

    this.gl.enable(this.gl.DEPTH_TEST);

    this.projectionMatrix = mat4.create();
    this.modelMatrix = mat4.create();
    this.viewMatrix = mat4.create();

    this.initShaders();
    this.initBuffers();
    this.initTextures();
  }
  requestAnimFrame(this.mainLoop.bind(this));
};
      
WebGLRenderer.prototype.initTextures = function() {
  this.texture = this.gl.createTexture();
// this.texture.image.onload = this.initTextureParameters;
// this.texture.image.src = "fhslogo.png";
};

WebGLRenderer.prototype.setTexture = function(_canvas) {
  if(_canvas.width > 0 && _canvas.height > 0) {
    this.initTextureParameters(_canvas);
  }
};

WebGLRenderer.prototype.initTextureParameters = function(canvas)  {
  if(canvas){
    this.texture.image = canvas;
  } 
  this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
  this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
  this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.texture.image);
  this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
  this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
  this.gl.bindTexture(this.gl.TEXTURE_2D, null);
};

WebGLRenderer.prototype.initShaders = function()  {
  var vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);

  var vertexShaderSource = 
  "   attribute vec3 aVertexPosition; \n"+
  "attribute vec2 aTextureUVs; \n"+

  " uniform mat4 uViewMatrix; \n"+
  " uniform mat4 uModelMatrix; \n"+
  " uniform mat4 uProjectionMatrix; \n"+

  " varying vec2 vTextureCoords; \n"+

  "void main(void) { \n"+
  "  gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0); \n"+
  "  vTextureCoords = aTextureUVs; \n"+
  "} \n";

  this.gl.shaderSource(vertexShader, vertexShaderSource);
  this.gl.compileShader(vertexShader);
  if (!this.gl.getShaderParameter(vertexShader, this.gl.COMPILE_STATUS)) {
    alert(this.gl.getShaderInfoLog(vertexShader));
    return false;
  }

  var fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);

  var fragmentShaderSource = 
  "#ifdef GL_ES  \n"+
  "precision highp float; \n"+
  "#endif \n"+

  "varying vec2 vTextureCoords; \n"+

  "uniform sampler2D uSampler; \n"+

  "void main(void) { \n"+
  "  gl_FragColor = texture2D(uSampler, vec2(vTextureCoords.s, vTextureCoords.t)); \n"+
  "} \n";

  this.gl.shaderSource(fragmentShader, fragmentShaderSource);
  this.gl.compileShader(fragmentShader);

  this.shaderProgram = this.gl.createProgram();
  this.gl.attachShader(this.shaderProgram, vertexShader);
  this.gl.attachShader(this.shaderProgram, fragmentShader);
  this.gl.linkProgram(this.shaderProgram);

  this.gl.useProgram(this.shaderProgram);

  this.shaderProgram.vertexPositionAttribute = this.gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
  this.shaderProgram.textureCoordinateAttribute = this.gl.getAttribLocation(this.shaderProgram, "aTextureUVs");

  this.gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);
  this.gl.enableVertexAttribArray(this.shaderProgram.textureCoordinateAttribute);

  this.shaderProgram.uViewMatrix  = this.gl.getUniformLocation(this.shaderProgram, "uViewMatrix");
  this.shaderProgram.uModelMatrix = this.gl.getUniformLocation(this.shaderProgram, "uModelMatrix");
  this.shaderProgram.uProjectionMatrix = this.gl.getUniformLocation(this.shaderProgram, "uProjectionMatrix");
  this.shaderProgram.uSampler          = this.gl.getUniformLocation(this.shaderProgram, "uSampler");
};

WebGLRenderer.prototype.initBuffers = function() {
  this.vertexPositionBuffer = this.gl.createBuffer();
  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexPositionBuffer);

  vertices = [
  -1.0,-1.0, 0.0,  1.0,-1.0, 0.0,  1.0, 1.0, 0.0, -1.0, 1.0, 0.0
  ];
  this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
  this.vertexPositionBuffer.itemSize = 3;
  this.vertexPositionBuffer.numItems = 4;

  this.textureUVBuffer = this.gl.createBuffer();
  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureUVBuffer);
  
  var textureUVs = [
  0.0,0.0, 1.0,0.0, 1.0,1.0, 0.0,1.0
  ];
  this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(textureUVs), this.gl.STATIC_DRAW);
  this.textureUVBuffer.itemSize = 2;
  this.textureUVBuffer.numItems = 4;

  this.vertexIndexBuffer = this.gl.createBuffer();
  this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
 
  var vertexIndices = [
  0,  1,  2,  0,  2,  3
  ];
  this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), this.gl.STATIC_DRAW);
  this.vertexIndexBuffer.itemSize = 1;
  this.vertexIndexBuffer.numItems = 6;
};

WebGLRenderer.prototype.update = function() {
  if(this.texture.image) {
    this.initTextureParameters();
  }
};

WebGLRenderer.prototype.render = function() {     
  this.gl.clear(this.gl.COLOR_BUFFER_BIT);  
  this.gl.clear(this.gl.DEPTH_BUFFER_BIT);  

  var aspect = this.gl.viewportWidth / this.gl.viewportHeight;
  mat4.ortho(-1,1,-1,1,0.000001,10000,this.projectionMatrix);
  mat4.identity(this.viewMatrix);

  mat4.identity(this.modelMatrix);  

  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexPositionBuffer);
  this.gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, this.vertexPositionBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureUVBuffer);
  this.gl.vertexAttribPointer(this.shaderProgram.textureCoordinateAttribute, this.textureUVBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

  this.gl.activeTexture(this.gl.TEXTURE0);
  this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
  this.gl.uniform1i(this.shaderProgram.uSampler, 0);

  this.gl.uniformMatrix4fv(this.shaderProgram.uProjectionMatrix, false, this.projectionMatrix);
  this.gl.uniformMatrix4fv(this.shaderProgram.uViewMatrix, false, this.viewMatrix);
  this.gl.uniformMatrix4fv(this.shaderProgram.uModelMatrix, false, this.modelMatrix);

  this.gl.drawElements(this.gl.TRIANGLES, this.vertexIndexBuffer.numItems, this.gl.UNSIGNED_SHORT, 0);
};

window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
    window.setTimeout(callback, 1000/60);
  };
})();