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
  size : 10,
  
  width : 0,
  height : 0,
  
  content : [],
  sprite : null,
  tool : null,
  
  isBackground : false,
  
  screenCtx : null,
  toolCtx : null,
  
  init : function() {
    
    this.addObserver( 'color', bind( this, this.updateColor ) );
    
  },
  
  initType : function( _isBackground, _width, _height ) {
    
    this.setProperties({
      
      isBackground : _isBackground,
      width : _width,
      height : _height
      
    });
    
    this.content.clear();
    
    this.set( 'zoom', _isBackground ? 1 : 2 );
    
    this.addSprite();
    
  },
  
  initView : function( _screenCtx, _toolCtx ) {
    
    this.set( 'screenCtx', _screenCtx );
    this.set( 'toolCtx', _toolCtx );
    
    if ( this.isBackground ) {
      
      $('#sprites-area').hide();
      
    }
    
    this.setColor( [0, 0, 0, 255] );
    this.set( 'tool', App.pencilTool );
    
    this.initEvents();
    
  },
  
  updateColor : function() {
    
    var sCtx = this.screenCtx,
      tCtx = this.toolCtx;
    
    sCtx.fillStyle = tCtx.fillStyle = this.color;
    sCtx.strokeStyle = tCtx.strokeStyle = '#555';
    
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
      
      value: this.size,
      min: 1,
      max: 20,
      step: 1,
      
      slide: function( event, ui ) {
        
        App.paintController.setSize( ui.value );
        
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
  
  goToTypeSelection : function (_ask) {
    
    if ( _ask || typeof( _ask ) === "object" ) {
      
      if ( !confirm( "Delete all and go back to type selection?" ) ) {
        
        return false;
        
      }
      
    }
    
    App.paintView.remove();
    App.paintSizeView.appendTo( '#content' );
    
  },
  
  mousedown : function( mouse ) {
    
    var result = this.tool.mousedown( mouse, this.screenCtx, this.toolCtx, this.size );
    
    if ( result ) {
      
      this.saveSprite();
      
    }
    
  },
  
  mousemove : function( mouse ) {
    
    var result = this.tool.mousemove( mouse, this.screenCtx, this.toolCtx, this.size );
    
    if ( result ) {
      
      this.saveSprite();
      
    }
    
  },
  
  mouseup : function( mouse ) {
    
    var result = this.tool.mouseup( mouse, this.screenCtx, this.toolCtx, this.size );
    
    if ( result ) {
      
      this.saveSprite();
      
    }
    
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
    
    var imageData = this.sprite.load(),
      ctx = this.screenCtx;
    
    if ( !imageData ) {
      
      return;
      
    }
    
    if ( this.zoom === 1 ) {
      
      ctx.putImageData( imageData, 0, 0 );
      
    } else {
      
      ctx.clearRect( 0, 0, this.width, this.height );
      
      ctx.putImageDataOverlap( imageData, 0, 0 );
      
    }
    
  },
  
  add : function( _sprite ) {
    
    var i = this.content.indexOf( this.sprite );
    
    if ( this.content.length < 8 ) {
      
      _sprite = _sprite || NewSpriteModel.create();
      
      this.set( 'sprite', _sprite );
      this.content.insertAt( i + 1, _sprite );
      
    }
    
  },
  
  setSpriteModel : function( _sprite ) {
    
    this.set( 'sprite', _sprite );
    
    this.loadSprite();
    
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
  
  setTool : function( _tool ) {
    
    this.resetTool();
    
    this.set( 'tool', _tool );
    
  },
  
  resetTool : function() {
    
    if ( this.tool.reset( this.screenCtx, this.toolCtx ) ) {
      
      this.saveSprite();
      
    }
    
  },
  
  setSize : function( _size ) {
    
    this.set( 'size', _size );
    
  },
  
  setColor : function( _color ) {
    
    this.set( 'colorVals', _color );
    this.set( 'color', rgbToHex( _color[0], _color[1], _color[2] ) );
    
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
  
  selectTool : function() {
    
    this.setTool( App.selectTool );
    
  },
  
  pencilTool : function() {
    
    this.setTool( App.pencilTool );
    
  },
  
  eraseTool : function() {
    
    this.setTool( App.eraserTool );
    
  },
  
  drawRectTool : function() {
    
    App.drawTool.setDrawFunction( "rect" );
    this.setTool( App.drawTool );
    
  },
  
  drawRectFillTool : function() {
    
    App.drawTool.setDrawFunction( "fillrect" );
    this.setTool( App.drawTool );
    
  },
  
  drawCircleTool : function() {
    
    App.drawTool.setDrawFunction( "circle" );
    this.setTool( App.drawTool );
    
  },
  
  drawCircleFillTool : function() {
    
    App.drawTool.setDrawFunction( "fillcircle" );
    this.setTool( App.drawTool );
    
  },
  
  drawLineTool : function() {
    
    App.drawTool.setDrawFunction( "line" );
    this.setTool( App.drawTool );
    
  },
  
  fillTool : function() {
    
    this.setTool( App.fillTool );
    
  },
  
  clearTool : function() {
    
    this.resetTool();
    
    this.screenCtx.clearRect( 0, 0, this.width * this.zoom, this.height * this.zoom );
    this.toolCtx.clearRect( 0, 0, this.width * this.zoom, this.height * this.zoom );
    
    this.saveSprite();
    
  },
  
  undoTool : function() {
    
    this.resetTool();
    
    this.sprite.undo();
    
    this.loadSprite();
    
  },
  
  redoTool : function() {
    
    this.resetTool();
    
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
    
    this.add( null );
    
  },
  
  copySprite : function() {
    
    this.add( this.sprite.clone() );
    
  },
  
  removeSprite : function() {
    
    var i = this.content.indexOf( this.sprite ) || 1;
    
    if ( this.content.length > 1 ) {
      
      this.content.removeObject( this.sprite );
      this.setSpriteModel( this.content[i - 1] );
    
    }
    
  },
  
  pipetteTool : function() {
    
    this.setTool( App.pipetteTool );
    
  },
  
  updateZoom : function( _zoom ) {
    
    this.set( 'zoom', _zoom );
    
    this.screenCtx.scale( _zoom, _zoom );
    this.toolCtx.scale( _zoom, _zoom );
    
    this.screenCtx.lineCap = this.toolCtx.lineCap = 'round';
    this.screenCtx.lineWidth = this.toolCtx.lineWidth = 1;
    
    this.updateColor();
    
    this.loadSprite();
    
  }

});
