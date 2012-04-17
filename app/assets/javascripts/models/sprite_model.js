var SpriteModel = Ember.Object.extend({
  id : 0,
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

  init : function() {    
    this.states = [];
    this.id = "sprite" + this.id;
    //    
    this.appendToWrapper();
    //
    this.canvas = document.getElementById(this.id);
    this.context = this.canvas.getContext("2d");
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
    //
    canvasElement.setAttributeNode(canvasId);
    canvasElement.setAttributeNode(canvasWidth);    
    canvasElement.setAttributeNode(canvasHeight);        
    canvasElement.setAttributeNode(canvasStyle);
    //
    document.getElementById(this.wrapper).appendChild(canvasElement);    
  },

  clear : function() {
    this.states = [];
  },

  pushState : function() {
    if(this.states.length > this.stateLimit) {
      this.states.splice(0,1);
    }

    var imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    this.states.push(imageData);    
  },

  popState : function() {
    if(!imageData.length) return false;
    var imageData = this.states.pop();
    this.context.putImageData(imageData, 0, 0);
  },
});