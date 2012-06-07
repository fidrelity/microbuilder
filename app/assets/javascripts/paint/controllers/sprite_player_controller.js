/*
  SpritePlayerController
  
  - Manages playing of sprites
*/
var SpritePlayerController = Ember.Object.extend({

  sprites : null,
  playDelay : 200,
  currentFrameIndex : 0,
  playInterval : null,

  init : function () {
    this.paintController = App.paintController;
  },

  hide : function() {
    $('#player').hide();
  },
  
  play : function() {
    $('#playButton').hide();
    $('#stopButton').show();
    $('.active-sprite').removeClass('active-sprite');
    this.playDelay = parseInt( $('#playDelay').val() ) || 200;
    this.currentFrameIndex = 0;
    this.overSprites();
    this.nextFrame();
  },

  nextFrame : function() {
    var canvasObjects = this.getSpritesObjects();
    canvasObjects.hide();
    canvasObjects.eq(this.currentFrameIndex).show();

    if(this.currentFrameIndex == (this.getSpriteCount()) ) {
      // Loop
      if( this.isLooping() ) {
        this.play();
        return false;
      // End
      } else {
        this.stop();
        return false;
      }
    }

    this.currentFrameIndex++;
    var that = this;
    this.playInterval = setTimeout(function(){
      that.nextFrame();
    }, this.playDelay);    
  },

  stop : function() {
    clearTimeout(this.playInterval);

    this.getSpritesObjects().show();
    this.floatSprites();
    $('#playButton').show();
    $('#stopButton').hide();

    this.paintController.setCurrentSpriteModel( this.paintController.getCurrentSpriteModel() );
  },

  floatSprites : function() {
    this.getSpritesObjects().removeClass('canvas-over').addClass('canvas-float');
  },

  overSprites : function() {
    this.getSpritesObjects().removeClass('canvas-float').addClass('canvas-over');
  },

  isLooping : function() {
    return $("#replayLoop").is(":checked");
  },

  getSpritesObjects : function() {
    return $('.canvas').not('#canvas-template, #canvas-sketch, #zoomCanvas');
  },

  getSpriteCount : function() {
    return this.getSpritesObjects().length;
  }

});