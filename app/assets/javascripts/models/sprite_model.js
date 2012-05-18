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

  erase : function(_x, _y, _size) {
    this.context.clearRect(_x, _y, _size, _size);
  },

  flipV: function() {
    this.context.translate(-1,1);
  },

  flipH: function() {
    this.context.translate(1,-1);
  },

  pushState : function() {
    if(this.states.length > this.stateLimit) {
      this.states.splice(0,1);
    }

    var imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    this.states.push(imageData);
  },

  popState : function() {
    if(!this.states.length) return false;

    if(this.states.length === 1) {
      this.states.pop();
      this.clear();
    } else {
      this.states.pop();
      var imageData = this.states[this.states.length - 1];
      this.context.putImageData(imageData, 0, 0);
    }
  }
});