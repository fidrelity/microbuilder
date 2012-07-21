var TempCanvasModel = Ember.Object.extend({

  canvas : null,
  context : null,
  domObj : null,
  id : 'zoomCanvas',

  height : 0,
  width : 0,

  // Constr: width, height
  init : function() {

  },

  initDomReady : function() {

    this.canvas  = document.getElementById(this.id);
    this.context = this.zoomCanvas.getContext("2d");

    this.domObj = $('#' + this.id);

  },

  clear : function() {

    this.context.clearRect(0, 0, this.width, this.height);

  },


  updateToZoomCanvasSize : function () {
    
    this.canvas.style.width  = width + "px";
    this.canvas.style.height = height + "px";

  },

  // Set position of temp canvas and display it over zoomCanvas
  showTempCanvas : function() { 
    
    var canvasObject = $("#zoomCanvas");    
 
    var newLeft = $("#zoom-canvas-area")[0].scrollLeft + canvasObject.position().left,
        newTop = $("#zoom-canvas-area")[0].scrollTop + canvasObject.position().top;

    this.domObj.css({     

        left: newLeft,
        top: newTop,
        width: canvasObject.width(),
        height: canvasObject.height()

    }).show();

  },

  hide : function() {

    this.domObj.hide();

  },

 

});