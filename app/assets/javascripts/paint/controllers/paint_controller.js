/*
  PaintController

  Fix:
    - Fix: SelectTool in BG
    - Fix: FlipVH in BG
    - Fix: Remove sprite

  Refactor:
    - Save image to savemodel    

*/
var PaintController =  Ember.ArrayController.extend({
  
  color : null,
  zoom : 1,
  size : 1,
  
  width : 0,
  height : 0,
  
  content : [],
  sprite : null,
  tool : null,
  
  isBackground : false,
  
  screenCtx : null,
  toolCtx : null,
  
  init : function() {
    
    this.addSprite();
    
    this.addObserver( 'color', bind( this, this.updateColor ) );
    
  },
  
  initType : function( _isBackground, _width, _height ) {
    
    this.setProperties({
      
      isBackground : _isBackground,
      width : _width,
      height : _height
      
    });
    
  },
  
  initView : function( _screenCtx, _toolCtx ) {
    
    this.set( 'screenCtx', _screenCtx );
    this.set( 'toolCtx', _toolCtx );
    
    if ( this.isBackground ) {
      
      $('#sprites-area').hide();
      
    }
    
    this.set( 'color', '#000000' );
    this.set( 'tool', App.pencilTool );
    
    this.initEvents();
    
  },
  
  updateColor : function() {
    
    var sCtx = this.screenCtx,
      tCtx = this.toolCtx;
    
    sCtx.fillStyle = tCtx.fillStyle = sCtx.strokeStyle = tCtx.fillStyle = this.color;
    
  },
  
  initEvents : function() {
    
    // Key Events
    $(document).keyup(function(e) {
      if(e.keyCode === 17) this.isCtrl=true;
    });

    $(document).keydown(function(e) {

        var that = App.paintController;

        if(e.keyCode === 17) this.isCtrl = true;

        // Ctrl + Z
        if(e.keyCode === 90 && this.isCtrl) {
          that.undo();
        }        

        // Escape
        if(e.keyCode === 27) {
          try {
            that.getCurrentTool().reset();
          } catch(e) {
            console.log("Reset method does not exists for current tool");
          }
        } 
    });

    $( "#sizeSlider" ).slider({

      value: 1,
      min: 1,
      max: 20,
      step: 1,

      change: function( event, ui ) {
        App.paintController.setSize( ui.value );
      },

      slide: function( event, ui ) {
        $( '#slidervalue' ).html( ui.value );
      }

    });


    // Init file load
    if (!window.File && !window.FileReader && !window.FileList && !window.Blob) {

      $('#file').remove();

    } else {

      $("#loadFileButton").click(function() { 
        $('#file').trigger("click"); // trigger hidden file field
      });
      
      $('#file').change(function(e) {App.paintController.handleFile(e)});
    }

  },

  // ---------------------------------------
  // Save
  save : function() {

    var imageTitle = $("#imageName").val();
    var makePublic = $("#makePublic").is(":checked") ? 1 : 0;

    var count = this.content.length;
    var width = this.spriteSize.width;
    var totalWidth = count * width;
    var height = this.spriteSize.height;

    var isBackground = this.type === 'background' ? true : false;
    
    if(!imageTitle || !count) {alert("Image has no name!");return false;}

    Notifier.showLoader("Saving your image ...");

    this.finalCanvas.attr('width', totalWidth).attr('height', height).show();
    var canvas = this.finalCanvas[0];
    var context = canvas.getContext('2d');

    // Merge sprites into final canvas
    for (var i = 0; i < this.content.length; i++) {
      var area = this.content[i];
      var xPos = i * width;
      context.drawImage(area.canvas, xPos, 0);
    };
    
    // Push to Server
    var imgData = this.finalCanvas[0].toDataURL("image/png");

    $.ajax({
      url: "/graphics",
      type: "post",
      data: { 
        graphic: {
          name : imageTitle,
          image_data: imgData,
          frame_count: count,
          frame_width: width,
          frame_height: height,
          public : makePublic,
          background : isBackground,
        },
      },
      
      success : function( data ) {
        App.paintController.goToTypeSelection(false);
        Notifier.hideLoader();
      },

      error : function() {
        Notifier.hideLoader();
      }
      
    });    
    //this.stop();
  },

  // ---------------------------------------
  reset : function(_ask) {

    if(_ask) {
      var ok = confirm("Remove all sprites and reset paint editor?");
      if(!ok) return false;
    }
    
    for (var i = this.content.length - 1; i >= 0; i--) {
      this.remove(this.content[i]);
    };

    this.spriteCounter = 0;
    //this.zoom = this.isBackground ? 1 : 2; /* MovedTo: zoomCanvasModel.reset()*/
    this.set('content', []);

    this.zoomModel.reset();

  },

  // Resets paint and shows paintSizeView
  goToTypeSelection : function (_ask) {   

    if(_ask === true || typeof(_ask) === "object") {
      var ok = confirm("Delete all and go back to type selection?");
      if(!ok) return false;
    }
        
    this.reset();

    App.paintView.remove();
    App.paintSizeView.appendTo('#content');

  },


  // ---------------------------------------
  // Sprite Actions
  
  // Clear current SpriteModel
  clearCurrentSprite : function(clearZoomToo) {

    var clearZoom = clearZoomToo === undefined ? true : false;

    this.getCurrentSpriteModel().clear();

    if(clearZoom)
      this.zoomModel.clear();

  },

  erase : function(_x, _y, _w, _h) {        

    var w = _w || this.strokeSize;
    var h = _h || this.strokeSize;
    
    if(!this.isBackground) {

      this.zoomModel.eraseArea(_x, _y, w, h);
      //Moved: this.zoomContext.clearRect(_x, _y, w, h);

    } else {

      // Draw white rect if background
      App.pixelDrawer.popImageData();
      App.pixelDrawer.fillRect(_x, _y, _x + w, _y + h, "#FFFFFF");
      App.pixelDrawer.pushImageData();

    }

    // Erase on current SpriteModel
    this.getCurrentSpriteModel().erase(Math.floor(_x), Math.floor(_y), w, h);
  },
  
  mousedown : function( mouse ) {
    
    this.tool.mousedown( mouse, this.screenCtx, this.toolCtx, null );
    
  },
  
  mousemove : function( mouse ) {
    
    this.tool.mousemove( mouse, this.screenCtx, this.toolCtx, null );
    
  },
  
  mouseup : function( mouse ) {
    
    this.tool.mouseup( mouse, this.screenCtx, this.toolCtx, null );
    
    this.saveSprite();
    
  },
  
  saveSprite : function() {
    
    var width = this.width,
      height = this.height,
      zoom = this.zoom,
      imageData = this.screenCtx.getImageData( 0, 0, width, height ),
      zoomData, r, c, j;
    
    if ( this.zoom !== 1 ) {
      
      zoomData = this.screenCtx.getImageData( 0, 0, width * zoom, height * zoom );
      
      for ( r = 0; r < height; r++ ) {
        
        for ( c = 0; c < width; c++ ) {
          
          for ( j = 0; j < 4; j++ ) {
            
            imageData.data[ ( r * width + c ) * 4 + j ] = zoomData.data[ ( r * width * zoom + c ) * zoom * 4 + j ];
            
          }
          
        }
        
      }
      
    }
    
    this.sprite.save( imageData );
    
  },
  
  loadSprite : function() {
    
    var width = this.width,
      height = this.height,
      zoom = this.zoom,
      imageData = this.sprite.load(),
      ctx = this.screenCtx,
      r, c, i;
    
    if ( !imageData ) {
      
      return;
      
    }
    
    if ( this.zoom === 1 ) {
      
      ctx.putImageData( imageData, 0, 0 );
      
    } else {
      
      ctx.save();
      
      for ( r = 0; r < height; r++ ) {
        
        for ( c = 0; c < width; c++ ) {
          
          i = ( r * width + c ) * 4;
          
          ctx.fillStyle = 'rgba(' + imageData.data[i] + ',' + imageData.data[i+1] + ',' + imageData.data[i+2] + ',' + imageData.data[i+3] + ')';
          
          ctx.fillRect( c, r, 1, 1 );
          
        }
        
      }
      
      ctx.restore();
      
    }
    
  },
  
  add : function(copy) {
    
    if(this.content.length >= this.LIMIT) return false;
    var copyData = copy ? this.getCurrentSpriteModel().context.getImageData(0, 0, this.spriteSize.width, this.spriteSize.height) : null;
    
    var spriteModel = SpriteModel.create({

      index:    this.spriteCounter++,
      width:    this.spriteSize.width,
      height:   this.spriteSize.height,
      wrapper:  this.spriteWrapper,
      imgData : copyData

    });

    this.addObject(spriteModel);

    spriteModel.initView();
    $('.canvas').css({width: this.spriteSize.width, height: this.spriteSize.height});
    this.setCurrentSpriteModel(spriteModel);

    // Draw white background
    if(this.isBackground) this.zoomModel.fillBackground("#FFFFFF");

    if(copy) this.getCurrentSpriteModel().pushState();

    //this.updateZoom(true);
    this.zoomModel.updateZoom(spriteModel, true);

  },

  remove : function(_spriteModel) {

    if(this.content.length === 0) return false;

    var spriteModel = _spriteModel || this.getCurrentSpriteModel();

    this.removeObject(spriteModel);

    $("#" + spriteModel.id).remove();
    //this.content.splice(spriteModel.index, 1);
    //console.log("after del", this.content.length, spriteModel);
    // set currentSpriteModel

  },

  // Removes current sprite
  removeCurrent : function() {

    if(this.isBackground) return false;

    
    if(this.content.length === 1) {

      this.clearCurrentSprite();

    } else {

      this.remove(this.getCurrentSpriteModel());
      this.setCurrentSpriteModel(this.content[this.content.length - 1]);

    }

  },
  
  setSpriteModel : function( _sprite ) {
    
    this.set( 'sprite', _sprite );
    
  },
  
  getSpriteModel : function( i ) {
    
    if ( typeof i === 'number' && i < this.content.length ) {
      
      return this.content[i];
      
    }
    
    return this.sprite;
    
  },
  
  getTool : function() {
    
    return this.tool;
    
  },
 
  setSize : function( _size ) {
    
    this.set( 'size', _size );
    
    this.screenCtx.lineWidth = this.toolCtx.lineWidth = _size;
    
  },

  getStrokeSize : function() {

    return this.strokeSize;

  },


  // ---------------------------------------
  // View changing

  getColor : function() {

    return this.color;

  },

  // ---------------------------------------

  drawToSprite : function(canvas) {

    this.getCurrentSpriteModel().drawTo(this.zoomModel.canvas);

  },

  hideTempCanvas : function() {

    this.tempCanvas.hide();
    App.pixelDrawer.setCanvasContext(this.zoomModel.canvas);

  },

  // Loads file from hard drive to canvas
  handleFile : function(e) {

    var goon = confirm("This will overwrite your current canvas. Proceed?");
    if(!goon) return false;

    reader = new FileReader;

    reader.onload = function(event) {

      var w = App.paintController.spriteSize.width;
      var h = App.paintController.spriteSize.height;
      var img = new Image;
      
      img.width = w;
      img.height = h;

      img.onload = function() {
        
        App.paintController.zoomModel.context.drawImage(img, 0,0, w, h);      
        App.paintController.getCurrentSpriteModel().drawTo(App.paintController.zoomModel.canvas);

      };

      img.src = event.target.result;

    };

    reader.readAsDataURL(e.target.files[0]);
  },
  
  setCurrentTool : function( _tool ) {
    
    this.set( 'tool', _tool );
    
  },
  
  selectTool : function() {
    
    this.setCurrentTool( App.selectTool );
    this.click();
    
  },
  
  pencilTool : function() {
    
    this.setCurrentTool( App.pencilTool );
    
  },
  
  eraseTool : function() {
    
    this.setCurrentTool( App.pencilTool );
    
  },
  
  drawRectTool : function() {
    
    App.drawTool.setDrawFunction("rect");
    App.drawTool.click();
    this.setCurrentTool( App.drawTool );
    
  },

  drawRectFillTool : function() {
    
    App.drawTool.setDrawFunction("fillrect");
    App.drawTool.click();
    this.setCurrentTool( App.drawTool );
    
  },

  drawCircleTool : function() {
    
    App.drawTool.setDrawFunction("circle");
    App.drawTool.click();
    this.setCurrentTool( App.drawTool );
    
  },

  drawCircleFillTool : function() {
    
    App.drawTool.setDrawFunction("fillcircle");
    App.drawTool.click();
    this.setCurrentTool( App.drawTool );
    
  },

  drawLineTool : function() {
    
    App.drawTool.setDrawFunction("line");
    App.drawTool.click();
    this.setCurrentTool( App.drawTool );
    
  },
  
  fillTool : function() {
    
    App.fillTool.click();
    this.setCurrentTool( App.fillTool );
    
  },
  
  clearTool : function() {
    
    this.screenCtx.clearRect( 0, 0, this.width * this.zoom, this.height * this.zoom );
    this.toolCtx.clearRect( 0, 0, this.width * this.zoom, this.height * this.zoom );
    
    this.saveSprite();
    
  },
  
  undoTool : function() {
    
    this.sprite.undo();
    
    this.loadSprite();
    
  },
  
  redoTool : function() {
    
    this.sprite.redo();
    
    this.loadSprite();
    
  },
  
  flipVTool : function() {

    this.canvasModifier.flipVertical(this.zoomModel.context, this.spriteSize.width, this.spriteSize.height);

    this.clearCurrentSprite(false);
    this.drawToSprite();
   
  },

  flipHTool : function() {

    this.canvasModifier.flipHorizontal(this.zoomModel.context, this.spriteSize.width, this.spriteSize.height);

    this.clearCurrentSprite(false);
    this.drawToSprite();

  },

  rotateRightTool : function() {
    
    this.rotate( 90 );
        
  },

  rotateLeftTool : function() {
    
    this.rotate( -90 );
    
  },
  
  rotate : function(_angle) {

    this.canvasModifier.rotate(_angle, this.zoomModel.context, this.spriteSize.width, this.spriteSize.height);

    this.clearCurrentSprite(false);
    this.drawToSprite();

  },
  
  addSprite : function() {
    
    if ( this.content.length < 8 ) {
      
      this.set( 'sprite', NewSpriteModel.create() );
      this.content.addObject( this.sprite );
      
    }
    
  },
  
  copySprite : function() {
    
    alert( 'TODO' );
    
  },
  
  removeSprite : function() {
    
    if ( this.content.length > 1 ) {
    
      this.content.removeObject( this.sprite );
      this.set( 'sprite', this.content[0] );
    
    }
    
  },
  
  pipetteTool : function() {
    
    this.setCurrentTool( App.pipetteTool );
    this.click();
    
  },
  
  updateZoom : function( _zoom ) {
    
    this.set( 'zoom', _zoom );
    
    this.screenCtx.scale( _zoom, _zoom );
    this.toolCtx.scale( _zoom, _zoom );
    
    this.screenCtx.lineCap = this.toolCtx.lineCap = 'round';
    this.screenCtx.lineWidth = this.toolCtx.lineWidth = this.size;
    
    this.loadSprite();
    
  }

});
