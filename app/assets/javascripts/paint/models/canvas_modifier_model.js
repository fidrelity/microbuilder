var CanvasModifierModel = Ember.Object.extend({


  flipVertical : function(context, width, height) { 

    this.flip(context, width, height, 1, -1, 0, width);
    
  },


  flipHorizontal : function(context, width, height) {     

    this.flip(context, width, height, -1, 1, height, 0);

  },

  flip : function(context, width, height, scaleW, scaleH, translateX, translateY) {

    var scale = 1;
    var imageData = context.getImageData(0, 0, width, height);
    
    // Copy to temp canvas
    var copiedCanvas = $("<canvas>").attr("width", width).attr("height", height)[0];
    copiedCanvas.getContext("2d").putImageData(imageData, 0, 0);

    context.save();
      
      context.translate(translateX, translateY);

      // Do Flip
      context.scale(scaleW, scaleH);

      context.clearRect(0, 0, width, height);      

      context.drawImage(copiedCanvas, 0, 0);

    context.restore();

  },


  rotate : function(_angle, context, width, height) {

    var angle = _angle || 90;

    var imageData = context.getImageData(0, 0, width, height);
    
    var copiedCanvas = $("<canvas>").attr("width", width).attr("height", height)[0];
    copiedCanvas.getContext("2d").putImageData(imageData, 0, 0);

    context.save();
      
      context.translate(width/2, height/2);
      context.rotate(angle * Math.PI / 180);      

      context.clearRect(0, 0, width, height);

      context.translate(-width/2, -height/2);
      context.drawImage(copiedCanvas, 0, 0);

    context.restore();

  },




});