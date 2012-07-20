var SpriteModel = Ember.Object.extend({
  id : 0,
  index : 0,
  width : 0,
  height : 0,  
  wrapper : null,
  //
  states : [],
  //
  canvas : null,
  context : null,
  //
  stateLimit : 5,
  imgData : null,

  init : function() {    
    this.states = [];
    this.id = "sprite" + this.index;
    //    
    this.appendToWrapper();
    //
  },

  initView : function() {
    this.canvas = document.getElementById(this.id);
    this.context = this.canvas.getContext("2d");

    if(this.imgData)
      this.context.putImageData(this.imgData, 0, 0);
  },

  appendToWrapper : function() {
    var canvasElement = document.createElement("canvas");
    // Set Attributes
    var canvasId = document.createAttribute("id");
    canvasId.nodeValue = this.id;
    var canvasWidth = document.createAttribute("width");
    canvasWidth.nodeValue = this.width;
    var canvasHeight = document.createAttribute("height");
    canvasHeight.nodeValue = this.height;
    var canvasStyle = document.createAttribute("class");
    canvasStyle.nodeValue = "canvas";
    var dataIndex = document.createAttribute("data-index");
    dataIndex.nodeValue = this.index;
    //
    canvasElement.setAttributeNode(canvasId);
    canvasElement.setAttributeNode(canvasWidth);
    canvasElement.setAttributeNode(canvasHeight);
    canvasElement.setAttributeNode(canvasStyle);
    canvasElement.setAttributeNode(dataIndex);
    //
    document.getElementById(this.wrapper).appendChild(canvasElement);
  },

  highlight : function() {
    $('.canvas').removeClass("active-sprite");
    $("#" + this.id).addClass("active-sprite");
  },

  reset : function() {
    this.states = [];
    this.clear();
  },

  clear : function() {
    this.canvas.width = this.canvas.width;
  },

  erase : function(_x, _y, _w, _h) {
    var h = _h || _w;
    this.context.clearRect(_x, _y, _w, h);
  },

  flipV: function() {
    this.context.scale(-1,1);
  },

  flipH: function() {
    console.log("here")

    var scale = 1;

    var imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.width);
    
    var copiedCanvas = $("<canvas>").attr("width", this.canvas.width).attr("height", this.canvas.width)[0];
    copiedCanvas.getContext("2d").putImageData(imageData, 0, 0);

    var newWidth = this.canvas.width * scale;
    var newHeight = this.canvas.height * scale;

    this.context.save();
      //this.context.translate(-((newWidth-this.canvas.width)/2), -((newHeight-this.canvas.height)/2));
      this.context.translate(this.canvas.width, 0);
      this.context.scale(-scale, scale);      
      //this.context.rotate();
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.drawImage(copiedCanvas, 0, 0);
    this.context.restore();
  },

  pushState : function() {
    if(this.states.length > this.stateLimit) {
      this.states.splice(0,1);
    }
    
    var imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    this.states.push(imageData);
  },

  popState : function() {
    if(!this.states.length) { this.states = []; return false; }

    if(this.states.length > 1) this.states.pop();
    var imageData = this.states[this.states.length - 1];
    this.context.putImageData(imageData, 0, 0);
        
  }
});
