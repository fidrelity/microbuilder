var PaintController = Ember.ArrayController.extend({
  
  color : null,
  colorVals : null,
  
  zoom : 1,
  size : 10,
  
  width : 0,
  height : 0,
  
  content : [],
  sprite : null,
  tool : null,
  
  isBackground : false,

  notBackground : function() {
    
    return !this.isBackground;
    
  }.property( 'isBackground' ),
  
  screenCtx : null,
  toolCtx : null,
  
  rect : null,
  
  init : function() {
    
    this.addObserver( 'color', bind( this, this.updateColor ) );
    
    this.rect = new Area;
    
  },
  
  initSize : function() {
    
    this.clearGraphic();
    
    App.paintView.set( 'name', '' );
    App.paintView.set( 'public', true );
    
    App.paintView.remove();
    App.paintSizeView.appendTo('#content');
    
  },
  
  initPaint : function( _isBackground, _width, _height, _empty ) {
    
    this.setProperties({
      
      isBackground : _isBackground,
      width : _width,
      height : _height
      
    });
    
    this.set( 'zoom', _isBackground ? 1 : 2 );
    
    if ( !_empty ) {
      
      this.content.clear();
      this.addSprite();
      
    }
    
    App.paintSizeView.remove();
    App.paintView.appendTo( '#content' );
    
    if ( App.username === '' ) {
      
      Notifier.add( 'Your are not signed in. You can\'t save your image to your profile.', 'error' ).notify();
      
    }
    
  },
  
  initView : function( _screenCtx, _toolCtx ) {
    
    this.set( 'screenCtx', _screenCtx );
    this.set( 'toolCtx', _toolCtx );
    
    this.setColor( [0, 0, 0, 255] );
    
    this.tool = App.pencilTool;
    $( '.pencil' ).trigger( 'click' );
    
    this.initEvents();
    
  },
  
  initEvents : function() {
    
    $( document ).keydown( function( e ) {
      
      // console.log( e.keyCode );
      
      if ( e.keyCode === 17 || e.keyCode === 91 ) { // Ctrl || Cmd
        
        this.isCtrl = true;
        
      } else if ( e.keyCode === 16 ) { // Shift
        
        this.isShift = true;
        
      } else if ( e.keyCode === 90 && this.isCtrl && this.isShift ) { // Z -> redo
        
        App.paintController.redoTool();
        
      } else if ( e.keyCode === 90 && this.isCtrl ) { // Z -> undo
        
        App.paintController.undoTool();
        
      } else if ( e.keyCode === 46 ) { // DEL
        
        App.paintController.clearTool();
        
      } else if ( e.keyCode === 27 ) { // ESC
        
        App.paintController.resetTool();
        
      }
      
    });
    
    $( document ).keyup( function( e ) {
      
      if ( e.keyCode === 17 || e.keyCode === 91 ) { // Ctrl || Cmd
        
        this.isCtrl = false;
        
      } else if ( e.keyCode === 16 ) { // Shift
        
        this.isShift = false;
        
      }
      
    });
    
    if ( !window.File && !window.FileReader && !window.FileList && !window.Blob ) {
      
      $('#file').remove();
      
    } else {
      
      $( '#loadFileButton' ).click( function() {
        
        $( '#file' ).trigger( 'click' );
        
      });
      
      $( '#file' ).change( function( e ) {
        
        App.paintController.handleFile( e );
        
        $( '#reset' ).trigger( 'click' );
        
      });
      
    }
    
  },
  
  mousedown : function( mouse ) {
    
    if ( this.tool.mousedown( mouse, this.screenCtx, this.toolCtx, this.size ) ) {
      
      this.saveSprite();
      
    }    
    
  },
  
  mousemove : function( mouse, isDown ) {
    
    var rect = this.rect;
    
    if ( rect.dirty ) {
      
      this.toolCtx.clearRect( rect.x, rect.y, rect.width, rect.height );
      rect.dirty = false;
      
    }
    
    if ( isDown ) {
      
      if ( this.tool.mousemove( mouse, this.screenCtx, this.toolCtx, this.size ) ) {
        
        this.saveSprite();
        
      }
      
    } else if ( mouse.x >= 0 && mouse.y >= 0 && mouse.x <= this.width && mouse.y <= this.height ) {
      
      this.tool.preview( mouse, this.toolCtx, this.size, rect );
      
    }
    
  },
  
  mouseup : function( mouse ) {
    
    if ( this.tool.mouseup( mouse, this.screenCtx, this.toolCtx, this.size ) ) {
      
      this.saveSprite();
      
    }
    
  },
  
  setSpriteModel : function( _sprite ) {
    
    this.set( 'sprite', _sprite );
    
    this.loadSprite();
    
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
  
  add : function( _sprite ) {
    
    var i = this.content.indexOf( this.sprite );
    
    if ( this.content.length < 8 ) {
      
      _sprite = _sprite || SpriteModel.create();
      
      this.set( 'sprite', _sprite );
      this.content.insertAt( i + 1, _sprite );
      
    }
    
  },
  
  moveSprite : function( pos, pos2 ) {
    
    var sprite = this.content[pos];
    
    this.content.removeAt( pos );
    this.content.insertAt( pos2, sprite );
    
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
    this.saveGraphic();
    
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
  
  getTool : function() {
    
    return this.tool;
    
  },
  
  setTool : function( _tool ) {
    
    this.resetTool();
    
    $( '#paint-area' ).css({ cursor: 'crosshair' });
    
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
  
  updateColor : function() {
    
    var sCtx = this.screenCtx,
      tCtx = this.toolCtx;
    
    sCtx.fillStyle = tCtx.fillStyle = this.color;
    sCtx.strokeStyle = tCtx.strokeStyle = '#555';
    
  },
  
  updateZoom : function( _zoom ) {
    
    this.set( 'zoom', _zoom );
    
    this.screenCtx.scale( _zoom, _zoom );
    this.toolCtx.scale( _zoom, _zoom );
    
    this.screenCtx.lineCap = this.toolCtx.lineCap = 'round';
    this.screenCtx.lineWidth = this.toolCtx.lineWidth = 1;
    
    this.updateColor();
    
    this.loadSprite();
    
  },
  
  handleFile : function( e ) {
    
    var reader = new FileReader,
      file = e.target.files[0];
    
    if ( !file || !file.type.match( 'image.*' ) ) {
      
      alert( "You must select a valid image file!" );
      return;
      
    }
    
    reader.onload = function( e ) {
      
      var img = new Image;
      
      img.onload = function() {
        
        App.paintController.handleImage( img );
        
      };
      
      img.src = e.target.result;
      
    };
    
    reader.readAsDataURL( file );
    
  },
  
  handleImage : function( _img ) {
    
    var area = App.selectTool.area.clone();
    
    $( '.select' ).trigger( 'click' );
    
    App.selectTool.loadImage( this.toolCtx, _img, this.zoom, area );
    
  },
  
  selectTool : function() {
    
    this.setTool( App.selectTool );
    
  },
  
  pencilTool : function() {
    
    this.setTool( App.pencilTool );
    
    $( '#paint-area' ).css({ cursor: 'none' });
    
  },
  
  eraseTool : function() {
    
    this.setTool( App.eraserTool );
    
    $( '#paint-area' ).css({ cursor: 'none' });
    
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
    
    $( '#paint-area' ).css({ cursor: 'none' });
    
  },
  
  fillTool : function() {
    
    this.setTool( App.fillTool );
    
  },
  
  clearTool : function() {
    
    if ( this.tool.imageData ) {
      
      this.tool.clearRect( this.toolCtx );
      
    } else {
      
      this.resetTool();
      
      this.clear( this.screenCtx );
      this.clear( this.toolCtx );
      
    }
    
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
  
  flipVertical : function() { 
    
    if ( this.tool.imageData ) {
      
      this.tool.flipVertical( this.toolCtx );
      
    } else {
      
      this.transpose( 1, -1, 0, this.height, 0 );
      
    }
    
  },
  
  flipHorizontal : function() {     
    
    if ( this.tool.imageData ) {
      
      this.tool.flipHorizontal( this.toolCtx );
      
    } else {
      
      this.transpose( -1, 1, this.width, 0, 0 );
      
    }
    
  },
  
  rotateLeft : function() {
    
    if ( this.tool.imageData ) {
      
      this.tool.rotate( this.toolCtx, true );
      
    } else {
      
      this.transpose( 1, 1, 0, 0, -Math.PI / 2 );
      
    }
    
  },
  
  rotateRight : function() {
    
    if ( this.tool.imageData ) {
      
      this.tool.rotate( this.toolCtx, false );
      
    } else {
      
      this.transpose( 1, 1, 0, 0, Math.PI / 2 );
      
    }
    
  },
  
  transpose : function( _scaleX, _scaleY, _transX, _transY, _rotation ) { 
    
    var ctx = this.screenCtx,
      imageData = this.sprite.load(),
      width = this.width,
      height = this.height;
    
    this.clear( ctx );
    
    ctx.save();
    
    ctx.translate( _transX, _transY );
    ctx.scale( _scaleX, _scaleY );
    
    ctx.translate( Math.floor( width / 2 ), Math.floor( height / 2 ) );
    ctx.rotate( _rotation );
    ctx.translate( -Math.floor( width / 2 ), -Math.floor( height / 2 ) );
    
    ctx.putImageDataOverlap( imageData, 0, 0 );
    
    ctx.restore();
    
    this.saveSprite();
    
  },
  
  clear : function( _ctx ) {
    
    _ctx.clearRect( 0, 0, this.width, this.height );
    
  },
  
  pipetteTool : function() {
    
    this.setTool( App.pipetteTool );
    
  },
  
  save : function() {
    
    if ( App.username === '' ) {
      
      if ( confirm( 'You can\'t save your image, because you are not signed in.\n\nDo you want to sign in?\n(Your image will wait here)' ) ) {
      
        document.location.href = '/users/sign_in'; 
      
      }
      
      return;
      
    }
    
    Notifier.clear();
    
    var imageTitle = $( "#imageName" ).val(),
      makePublic = $( "#makePublic" ).is( ":checked" ) ? 1 : 0,
      count = this.content.length,
      canvas, ctx,
      imgData, i;
    
    this.resetTool();
    
    if ( !imageTitle ) {
      
      alert( "Image has no name!" );
      return false;
      
    }
    
    Notifier.showLoader( "Saving your image ..." );
    
    canvas = document.createElement( 'canvas' );
    ctx = canvas.getContext( '2d' );
    
    canvas.width = this.width * count;
    canvas.height = this.height;
    
    if ( this.isBackground ) {
      
      ctx.fillStyle = '#FFF';
      ctx.fillRect( 0, 0, this.width, this.height );
      
    }
    
    for ( i = 0; i < count; i++ ) {
      
      ctx.putImageDataOverlap( this.content[i].load(), i * this.width, 0 );
      
    }
    
    imgData = canvas.toDataURL( "image/png" );
    
    $.ajax({
      
      url: "/graphics",
      type: "post",
      
      data: { 
        graphic: {
          name : imageTitle,
          image_data: imgData,
          frame_count: count,
          frame_width: this.width,
          frame_height: this.height,
          public : makePublic,
          background : this.isBackground,
        }
      },
      
      success : function( data ) {
        
        App.paintController.initSize();
        Notifier.hideLoader();
        
      },
      
      error : function() {
        
        Notifier.hideLoader();
        alert( 'there was an error saving your image' );
        
      }
      
    });
    
  },
  
  goToTypeSelection : function() {
    
    if ( confirm( "Delete all and go back to type selection?" ) ) {
      
      Notifier.clear();
      this.initSize();
      
    }
    
  },
  
  clearGraphic : function() {
    
    Storage.write( 'graphic', null );
    
    for ( var i = 0; i < 8; i++ ) {
      
      Storage.write( 'graphicData' + i, null );
      
    }
    
  },
  
  saveGraphic : function() {
    
    // check sprites display mode
    
    var data = {
      name : $( "#imageName" ).val(),
      count : this.content.length,
      width : this.width,
      height : this.height,
      public : $( "#makePublic" ).is( ":checked" ) ? 1 : 0,
      background : this.isBackground,
    };
    
    for ( var i = 0; i < data.count; i++ ) {
      
      Storage.write( 'graphicData' + i, JSON.stringify( this.content[i].getImage() ) );
      
    }
    
    Storage.write( 'graphic', JSON.stringify( data ) );
    
  },
  
  loadGraphic : function( _data ) {
    
    var img, sprite;
    
    if ( !_data.width || !_data.height || !_data.count ) {
      
      return false;
      
    }
    
    this.initPaint( _data.background, _data.width, _data.height, true );
    
    for ( var i = 0; i < _data.count; i++ ) {
      
      img = new Image();
      img.src = JSON.parse( Storage.read( 'graphicData' + i ) );
      
      sprite = SpriteModel.create();
      
      img.onload = ( function( _sprite, _img ) {
        
        return function() { _sprite.saveImage( _img ); };
        
      })( sprite, img );
      
      this.content.push( sprite );
      
    }
    
    this.set( 'sprite', this.content[0] );
    
    App.paintView.set( 'name', _data.name );
    App.paintView.set( 'public', _data.public );
    
    return true;
    
  }

});
