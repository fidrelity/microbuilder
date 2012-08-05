var ToolModel = Ember.Object.extend({
  
  mousedown : function( _mouse, _screenCtx, _toolCtx, _size ) {},
  mousemove : function( _mouse, _screenCtx, _toolCtx, _size ) {},
  mouseup : function( _mouse, _screenCtx, _toolCtx, _size ) {
    
    return true;
    
  },
  
  clear : function( _ctx ) {
    
    _ctx.clearRect( 0, 0, App.paintController.width, App.paintController.height );
    
  },
  
  reset : function() {}
  
});

var PencilToolModel = ToolModel.extend({

  oldX : 0,
  oldY : 0,
  
  mousedown : function( _mouse, _screenCtx, _toolCtx, _size ) {
    
    this.oldX = _mouse.x;
    this.oldY = _mouse.y;
    
    _screenCtx.fillRect( _mouse.x - _size / 2, _mouse.y - _size / 2, _size, _size );
    
  },
  
  mousemove : function( _mouse, _screenCtx, _toolCtx, _size ) {
    
    bresenham( function( _x, _y ) {
      
      _screenCtx.fillRect( _x - _size / 2, _y - _size / 2, _size, _size );
      
    }, _mouse.x, _mouse.y, this.oldX, this.oldY );
    
    this.oldX = _mouse.x;
    this.oldY = _mouse.y;
    
  }

});

var EraserToolModel = ToolModel.extend({

  oldX : 0,
  oldY : 0,
  
  mousedown : function( _mouse, _screenCtx, _toolCtx, _size ) {
    
    this.oldX = _mouse.x;
    this.oldY = _mouse.y;
    
    _screenCtx.clearRect( _mouse.x - _size / 2, _mouse.y - _size / 2, _size, _size );
    
  },
  
  mousemove : function( _mouse, _screenCtx, _toolCtx, _size ) {
    
    bresenham( function( _x, _y ) {
      
      _screenCtx.clearRect( _x - _size / 2, _y - _size / 2, _size, _size );
      
    }, _mouse.x, _mouse.y, this.oldX, this.oldY );
    
    this.oldX = _mouse.x;
    this.oldY = _mouse.y;
    
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
    
    if ( this.fill ) {
      
      _ctx.fillRect( area.x, area.y, area.width, area.height );
      
    } else {
      
      _ctx.fillRect( area.x, area.y, area.width, _size );
      _ctx.fillRect( area.x, area.y, _size, area.height );
      _ctx.fillRect( area.x + area.width - _size, area.y, _size, area.height );
      _ctx.fillRect( area.x, area.y + area.height - _size, area.width, _size );
      
    }
    
  },
  
  drawCircle : function( _ctx, _mouse, _size ) {
    
    var circle = this.circle.resize( _mouse );
    
    if ( this.fill ) {
    
      _ctx.fillCircle( circle.x, circle.y, circle.radius );
    
    } else {
      
      _ctx.strokeCircle( circle.x, circle.y, circle.radius );
      
    }
    
  },
  
  drawLine : function( _ctx, _mouse, _size ) {
    
    bresenham( function( _x, _y ) {
      
      _ctx.fillRect( _x - _size / 2, _y - _size / 2, _size, _size );
      
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
  mouse : null,
  
  imageData : null,
  
  dragging : false,
  
  init : function() {
    
    this.area = new Area;
    this.mouse = new Vector;
    
  },
  
  mousedown : function( _mouse, _screenCtx, _toolCtx, _size ) {
    
    var area = this.area,
      zoom = App.paintController.zoom,
      result = false;
    
    this.mouse.copy( _mouse );
    
    if ( area.contains( _mouse ) ) {
      
      this.dragging = true;
      
      if ( !this.imageData ) {
      
        this.imageData = _screenCtx.getImageData( area.x * zoom, area.y * zoom, area.width * zoom, area.height * zoom );
        _screenCtx.clearRect( area.x, area.y, area.width, area.height );
        
        this.clear( _toolCtx );
        area.draw( _toolCtx );
        _toolCtx.putImageData( this.imageData, area.x * zoom, area.y * zoom );
      
      }
      
    } else {
      
      if ( this.imageData ) {
        
        this.reset( _screenCtx );
        result = true;
        
      }
      
      this.clear( _toolCtx );
      
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
      
      area.draw( _toolCtx );
      _toolCtx.putImageData( this.imageData, area.x * zoom, area.y * zoom );
      
    } else {
      
      area.resize( _mouse );
      area.draw( _toolCtx );
      
    }
    
    this.mouse.copy( _mouse );
    
  },
  
  mouseup : function( _mouse, _screenCtx, _toolCtx, _size ) {
    
    this.dragging = false;
    
    this.area.adjust();
    
  },
  
  reset : function( _screenCtx, _toolCtx ) {
    
    var zoom = App.paintController.zoom;
    
    if ( this.imageData ) {
      
      _screenCtx.save();
      _screenCtx.setTransform( 1, 0, 0, 1, 0, 0 );
      
      _screenCtx.putImageDataOverlap( this.imageData, this.area.x * zoom, this.area.y * zoom );
      
      _screenCtx.restore();
      
      this.clear( _toolCtx );
      
      this.imageData = null;
      
      return true;
      
    }
    
  }

});