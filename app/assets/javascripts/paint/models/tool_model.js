var ToolModel = Ember.Object.extend({
  
  mousedown : function( _mouse, _screenCtx, _toolCtx, _size ) {},
  mousemove : function( _mouse, _screenCtx, _toolCtx, _size ) {},
  mouseup : function( _mouse, _screenCtx, _toolCtx, _size ) {
    
    return true;
    
  },
  
  clear : function( _ctx ) {
    
    _ctx.clearRect( 0, 0, App.paintController.width, App.paintController.height );
    
  },
  
  reset : function( _screenCtx, _toolCtx ) {},
  
  preview : function( _mouse, _toolCtx, _size, _rect ) {}
  
});

var PencilToolModel = ToolModel.extend({

  oldX : 0,
  oldY : 0,
  
  mousedown : function( _mouse, _screenCtx, _toolCtx, _size ) {
    
    this.oldX = _mouse.x;
    this.oldY = _mouse.y;
    
    _screenCtx.fillRect( _mouse.x - Math.floor( _size / 2 ), _mouse.y - Math.floor( _size / 2 ), _size, _size );
    
  },
  
  mousemove : function( _mouse, _screenCtx, _toolCtx, _size ) {
    
    bresenham( function( _x, _y ) {
      
      _screenCtx.fillRect( _x - Math.floor( _size / 2 ), _y - Math.floor( _size / 2 ), _size, _size );
      
    }, _mouse.x, _mouse.y, this.oldX, this.oldY );
    
    this.oldX = _mouse.x;
    this.oldY = _mouse.y;
    
  },
  
  preview : function( _mouse, _toolCtx, _size, _rect ) {
    
    _rect.set( _mouse.x - Math.floor( _size / 2 ), _mouse.y - Math.floor( _size / 2 ), _size, _size );
    _rect.dirty = true;
    
    _toolCtx.fillRect( _rect.x, _rect.y, _rect.width, _rect.height );
    
  }

});

var EraserToolModel = ToolModel.extend({

  oldX : 0,
  oldY : 0,
  
  mousedown : function( _mouse, _screenCtx, _toolCtx, _size ) {
    
    this.oldX = _mouse.x;
    this.oldY = _mouse.y;
    
    _screenCtx.clearRect( _mouse.x - Math.floor( _size / 2 ), _mouse.y - Math.floor( _size / 2 ), _size, _size );
    
  },
  
  mousemove : function( _mouse, _screenCtx, _toolCtx, _size ) {
    
    bresenham( function( _x, _y ) {
      
      _screenCtx.clearRect( _x - Math.floor( _size / 2 ), _y - Math.floor( _size / 2 ), _size, _size );
      
    }, _mouse.x, _mouse.y, this.oldX, this.oldY );
    
    this.oldX = _mouse.x;
    this.oldY = _mouse.y;
    
  },
  
  preview : function( _mouse, _toolCtx, _size, _rect ) {
    
    var zoom = App.paintController.zoom;
    
    _rect.set( _mouse.x - Math.floor( _size / 2 ), _mouse.y - Math.floor( _size / 2 ), _size, _size );
    _rect.dirty = true;
    
    _toolCtx.save();
    _toolCtx.setTransform( 1, 0, 0, 1, 0.5, 0.5 );
    
    _toolCtx.strokeRect( _rect.x * zoom, _rect.y * zoom, _rect.width * zoom - 1, _rect.height * zoom - 1 );
    
    _toolCtx.restore();
    
  }

});

var PipetteToolModel = ToolModel.extend({
  
  mouseup : function( _mouse, _screenCtx, _toolCtx, _size ) {
    
    var zoom = App.paintController.zoom;
    
    App.paintController.setColor( _screenCtx.getImageData( _mouse.x * zoom, _mouse.y * zoom, 1, 1 ).data );
    
  }
  
});

var DrawToolModel = ToolModel.extend({

  oldX : 0,
  oldY : 0,
  
  area : null,
  circle : null,
  
  init : function() {
    
    this.area = new Area;
    this.circle = new Circle;
    
  },
  
  mousedown : function( _mouse, _screenCtx, _toolCtx, _size ) {
    
    this.oldX = _mouse.x;
    this.oldY = _mouse.y;
    
    this.area.set( _mouse.x, _mouse.y, 0, 0 );
    this.circle.set( _mouse.x, _mouse.y, 0 );
    
  },
  
  mousemove : function( _mouse, _screenCtx, _toolCtx, _size ) {
    
    this.clear( _toolCtx );
    this.draw( _toolCtx, _mouse, _size );
    
  },
  
  mouseup : function( _mouse, _screenCtx, _toolCtx, _size ) {
    
    this.clear( _toolCtx );
    this.draw( _screenCtx, _mouse, _size );
    
    return true;
    
  },
  
  draw : function( _ctx, _mouse, _size ) {},
  
  drawRect : function( _ctx, _mouse, _size ) {
    
    var area = this.area.setPosition( this.oldX, this.oldY );
    
    area.resize( _mouse ).adjust();
    
    if ( this.fill || this.area.width <= 2 * _size || this.area.height <= 2 * _size ) {
      
      _ctx.fillRect( area.x, area.y, area.width, area.height );
      
    } else {
      
      _ctx.fillRect( area.x, area.y, area.width, _size );
      _ctx.fillRect( area.x, area.y, _size, area.height );
      _ctx.fillRect( area.x + area.width - _size, area.y, _size, area.height );
      _ctx.fillRect( area.x, area.y + area.height - _size, area.width, _size );
      
    }
    
  },
  
  drawCircle : function( _ctx, _mouse, _size ) {
    
    var s = Math.floor( _size / 2 ),
      line = function( _x, _y, _x2, _y2 ) {
        
        _x = Math.floor( _x );
        _x2 = Math.floor( _x2 );
        _y = Math.floor( _y );
        
        _ctx.fillRect( _x, _y, _x2 - _x, 1 );
        
      };
    
    if ( this.fill ) {
      
      ellipse( line, _mouse.x, _mouse.y, this.oldX, this.oldY );
      
    } else if ( _size === 1 ) {
      
      ellipse( function( _x, _y, _x2, _y2 ) {
        
        _x = Math.floor( _x );
        _x2 = Math.floor( _x2 );
        _y = Math.floor( _y );
        _y2 = Math.floor( _y2 );
        
        _ctx.fillRect( _x, _y, 1, 1 );
        _ctx.fillRect( _x2, _y2, 1, 1 );
        
      }, _mouse.x, _mouse.y, this.oldX, this.oldY );
      
    } else {
      
      ellipse( function( _x, _y, _x2, _y2 ) {
        
        _x = Math.floor( _x );
        _x2 = Math.floor( _x2 );
        _y = Math.floor( _y );
        _y2 = Math.floor( _y2 );
        
        ellipse( line, _x - s, _y - s, _x - s + _size, _y - s + _size );
        ellipse( line, _x2 - s, _y2 - s, _x2 - s + _size, _y2 - s + _size );
        
      }, _mouse.x, _mouse.y, this.oldX, this.oldY );
      
    }
    
  },
  
  drawLine : function( _ctx, _mouse, _size ) {
    
    bresenham( function( _x, _y ) {
      
      _ctx.fillRect( _x - Math.floor( _size / 2 ), _y - Math.floor( _size / 2 ), _size, _size );
      
    }, _mouse.x, _mouse.y, this.oldX, this.oldY );
    
  },
  
  setDrawFunction : function( _fnc ) {
    
    switch ( _fnc ) {
      
      case "rect" : this.draw = this.drawRect; this.fill = false; break;
      
      case "fillrect" : this.draw = this.drawRect; this.fill = true; break;
      
      case "circle" : this.draw = this.drawCircle; this.fill = false; break;
      
      case "fillcircle" : this.draw = this.drawCircle; this.fill = true; break;
      
      case "line" : this.draw = this.drawLine; break;
      
    }
    
  },
  
  preview : function( _mouse, _toolCtx, _size, _rect ) {
    
    if ( this.draw === this.drawLine ) {
      
      _rect.set( _mouse.x - Math.floor( _size / 2 ), _mouse.y - Math.floor( _size / 2 ), _size, _size );
      _rect.dirty = true;
      
      _toolCtx.fillRect( _rect.x, _rect.y, _rect.width, _rect.height );
      
    }
    
  }

});

var FillToolModel = ToolModel.extend({
  
  mousedown : function( _mouse, _screenCtx, _toolCtx, _size ) {
    
    var zoom = App.paintController.zoom,
      color = _screenCtx.getImageData( _mouse.x * zoom, _mouse.y * zoom, 1, 1 ).data,
      newColor = App.paintController.colorVals,
      tempColor = [ 0, 0, 0, 0 ],
      imageData = App.paintController.sprite.load(),
      width = imageData.width,
      height = imageData.height,
      stack = [],
      x, y;
    
    if ( this.compare( color, newColor ) || 
      _mouse.x < 0 || _mouse.x >= width || _mouse.y < 0 || _mouse.y >= height ) {
      
      return false;
      
    }
    
    this.setPixel( imageData, _mouse.x, _mouse.y, newColor );
    stack.push( _mouse.x, _mouse.y );
    
    while ( stack.length ) {
      
      x = stack.shift();
      y = stack.shift();
      
      if ( x + 1 < width && this.compare( color, this.getPixel( imageData, x + 1, y, tempColor ) ) ) {
        
        this.setPixel( imageData, x + 1, y, newColor );
        stack.push( x + 1, y );
        
      }
      
      if ( x - 1 >= 0 && this.compare( color, this.getPixel( imageData, x - 1, y, tempColor ) ) ) {
        
        this.setPixel( imageData, x - 1, y, newColor );
        stack.push( x - 1, y );
        
      }
      
      if ( y + 1 < height && this.compare( color, this.getPixel( imageData, x, y + 1, tempColor ) ) ) {
        
        this.setPixel( imageData, x, y + 1, newColor );
        stack.push( x, y + 1 );
        
      }
      
      if ( y - 1 >= 0 && this.compare( color, this.getPixel( imageData, x, y - 1, tempColor ) ) ) {
        
        this.setPixel( imageData, x, y - 1, newColor );
        stack.push( x, y - 1 );
        
      }
      
    }
    
    App.paintController.sprite.save( imageData );
    App.paintController.loadSprite();
    
    return true;
    
  },
  
  compare : function( c, c2 ) {
    
    return c[0] === c2[0] && c[1] === c2[1] && c[2] === c2[2] && c[3] === c2[3];
    
  },
  
  getPixel : function( imageData, x, y, color ) {
    
    var i = ( y * imageData.width + x ) * 4;
    
    color[0] = imageData.data[i];
    color[1] = imageData.data[i + 1];
    color[2] = imageData.data[i + 2];
    color[3] = imageData.data[i + 3];
    
    return color;
    
  },
  
  setPixel : function( imageData, x, y, color ) {
    
    var i = ( y * imageData.width + x ) * 4;
    
    imageData.data[i] = color[0];
    imageData.data[i + 1] = color[1];
    imageData.data[i + 2] = color[2];
    imageData.data[i + 3] = color[3];
    
  }
  
});

var SelectToolModel = ToolModel.extend({

  area : null,
  area2 : null,
  
  mouse : null,
  
  imageData : null,
  
  dragging : false,
  
  init : function() {
    
    this.area = new Area;
    this.area2 = new Area;
    this.mouse = new Vector;
    
  },
  
  mousedown : function( _mouse, _screenCtx, _toolCtx, _size ) {
    
    var area = this.area,
      result = false;
    
    this.mouse.copy( _mouse );
    
    if ( area.contains( _mouse ) ) {
      
      this.dragging = true;
      
    } else {
      
      result = this.reset( _screenCtx, _toolCtx );
      
      area.set( _mouse.x, _mouse.y, 0, 0 );
      this.dragging = false;
      
    }
    
    return result;
    
  },
  
  mousemove : function( _mouse, _screenCtx, _toolCtx, _size ) {
    
    var area = this.area,
      zoom = App.paintController.zoom;
    
    this.clear( _toolCtx );
    
    if ( this.dragging ) {
      
      area.move( this.mouse.subSelf( _mouse ).mulSelf( -1 ) );
      this.drawArea( _toolCtx );
      
    } else {
      
      area.resize( _mouse );
      this.drawArea( _toolCtx );
      
    }
    
    this.mouse.copy( _mouse );
    
  },
  
  mouseup : function( _mouse, _screenCtx, _toolCtx, _size ) {
    
    var area = this.area,
      zoom = App.paintController.zoom;
    
    this.dragging = false;
    
    area.adjust();
    
    if ( !this.imageData && area.width && area.height ) {
    
      this.imageData = _screenCtx.getImageData( area.x * zoom, area.y * zoom, area.width * zoom, area.height * zoom );
      _screenCtx.clearRect( area.x, area.y, area.width, area.height );
      
      this.drawArea( _toolCtx );
      
    }
    
  },
  
  reset : function( _screenCtx, _toolCtx ) {
    
    var zoom = App.paintController.zoom;
    
    this.clear( _toolCtx );
    
    if ( this.imageData ) {
      
      _screenCtx.save();
      _screenCtx.setTransform( 1, 0, 0, 1, 0, 0 );
      
      _screenCtx.putImageDataOverlap( this.imageData, this.area.x * zoom, this.area.y * zoom );
      
      _screenCtx.restore();
      
      this.imageData = null;
      this.area.set( 0, 0, 0, 0 );
      
      return true;
      
    }
    
  },
  
  drawArea : function( _ctx ) {
    
    var zoom = App.paintController.zoom,
      rect = this.area2.copy( this.area ).adjust();
    
    _ctx.clearRect( rect.x, rect.y, rect.width, rect.height );
    
    if ( this.imageData ) {
      
      _ctx.putImageData( this.imageData, rect.x * zoom, rect.y * zoom );
      
    }
    
    _ctx.save();
    _ctx.setTransform( 1, 0, 0, 1, 0.5, 0.5 );
    
    _ctx.strokeRect( rect.x * zoom, rect.y * zoom, rect.width * zoom - 1, rect.height * zoom - 1 );
    
    _ctx.restore();
    
  },
  
  flipVertical : function( _ctx ) { 
    
    this.flip( _ctx, 1, -1, 0, this.imageData.height );
    
  },
  
  flipHorizontal : function( _ctx ) {
    
    this.flip( _ctx, -1, 1, this.imageData.width, 0 );
    
  },
  
  flip : function( _ctx, _scaleX, _scaleY, _transX, _transY ) { 
    
    var canvas = document.createElement( 'canvas' ),
      ctx = canvas.getContext( '2d' ),
      data = this.imageData;
    
    canvas.width = data.width;
    canvas.height = data.height;
    
    ctx.translate( _transX, _transY );
    ctx.scale( _scaleX, _scaleY );
    
    ctx.putImageDataOverlap( this.imageData, 0, 0 );
    
    this.imageData = ctx.getImageData( 0, 0, data.width, data.height );
    
    this.drawArea( _ctx );
    
  },
  
  rotate : function( _ctx, _left ) {
    
    var canvas = document.createElement( 'canvas' ),
      ctx = canvas.getContext( '2d' ),
      rect = this.area,
      data = this.imageData,
      swap;
    
    canvas.width = data.height;
    canvas.height = data.width;
    
    if ( _left ) {
      
      ctx.rotate( -Math.PI / 2 );
      ctx.translate( -data.width, 0 );
      
    } else {
      
      ctx.rotate( Math.PI / 2 );
      ctx.translate( 0, -data.height );
      
    }
    
    ctx.putImageDataOverlap( this.imageData, 0, 0 );
    
    this.imageData = ctx.getImageData( 0, 0, data.height, data.width );
    
    _ctx.clearRect( rect.x, rect.y, rect.width, rect.height );
    
    swap = rect.width;
    rect.width = rect.height;
    rect.height = swap;
    
    this.drawArea( _ctx );
    
  },
  
  clearRect : function( _ctx ) {
    
    this.imageData = null;
    this.area.set( 0, 0, 0, 0 );
    
    this.clear( _ctx );
    
  },
  
  loadImage : function( _ctx, _img, _zoom ) {
    
    var canvas = document.createElement( 'canvas' ),
      ctx = canvas.getContext( '2d' ),
      rect = this.area.copy( this.area2 ),
      size = _img;
    
    if ( rect.width && rect.height ) {
      
      size = rect;
      
    } else {
      
      rect.set( 0, 0, size.width, size.height );
      
    }
    
    canvas.width = size.width * _zoom;
    canvas.height = size.height * _zoom;
    
    ctx.scale( _zoom * size.width / _img.width, _zoom * size.height / _img.height );
    ctx.drawImage( _img, 0, 0 );
    
    this.imageData = ctx.getImageData( 0, 0, size.width * _zoom, size.height * _zoom );
    
    this.drawArea( _ctx );
    
  }

});