var ToolModel = Ember.Object.extend({
  
  mousedown : function( _mouse, _screenCtx, _toolCtx, _size ) {},
  mousemove : function( _mouse, _screenCtx, _toolCtx, _size ) {},
  mouseup : function( _mouse, _screenCtx, _toolCtx, _size ) {},
  
  clear : function( _ctx ) {
    
    _ctx.clearRect( 0, 0, App.paintController.width, App.paintController.height );
    
  }
  
});

var PencilToolModel = ToolModel.extend({

  oldX : 0,
  oldY : 0,
  
  mousedown : function( _mouse, _screenCtx, _toolCtx, _size ) {
    
    var size = App.paintController.size;
    
    this.oldX = _mouse.x;
    this.oldY = _mouse.y;
    
    _screenCtx.fillRect( _mouse.x - size / 2, _mouse.y - size / 2, size, size );
    
  },
  
  mousemove : function( _mouse, _screenCtx, _toolCtx, _size ) {
    
    var size = App.paintController.size;
    
    bresenham( function( _x, _y ) {
      
      _screenCtx.fillRect( _x - size / 2, _y - size / 2, size, size );
      
    }, _mouse.x, _mouse.y, this.oldX, this.oldY );
    
    this.oldX = _mouse.x;
    this.oldY = _mouse.y;
    
  }

});

var EraserToolModel = ToolModel.extend({

  oldX : 0,
  oldY : 0,
  
  mousedown : function( _mouse, _screenCtx, _toolCtx, _size ) {
    
    var size = App.paintController.size;
    
    this.oldX = _mouse.x;
    this.oldY = _mouse.y;
    
    _screenCtx.clearRect( _mouse.x - size / 2, _mouse.y - size / 2, size, size );
    
  },
  
  mousemove : function( _mouse, _screenCtx, _toolCtx, _size ) {
    
    var size = App.paintController.size;
    
    bresenham( function( _x, _y ) {
      
      _screenCtx.clearRect( _x - size / 2, _y - size / 2, size, size );
      
    }, _mouse.x, _mouse.y, this.oldX, this.oldY );
    
    this.oldX = _mouse.x;
    this.oldY = _mouse.y;
    
  }

});

var PipetteToolModel = ToolModel.extend({
  
  mouseup : function( _mouse, _screenCtx, _toolCtx, _size ) {
    
    var p = _screenCtx.getImageData( _mouse.x, _mouse.y, 1, 1 ).data;
    App.paintController.set( 'color', rgbToHex( p[0], p[1], p[2] ) )
    
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
    
    this.area.setPosition( _mouse.x, _mouse.y );
    this.circle.setPosition( _mouse.x, _mouse.y );
    
  },
  
  mousemove : function( _mouse, _screenCtx, _toolCtx, _size ) {
    
    this.clear( _toolCtx );
    this.draw( _toolCtx, _mouse );
    
  },
  
  mouseup : function( _mouse, _screenCtx, _toolCtx, _size ) {
    
    this.clear( _toolCtx );
    this.draw( _screenCtx, _mouse );
    
  },
  
  draw : function( _ctx, _mouse ) {},
  
  drawRect : function( _ctx, _mouse ) {
    
    var area = this.area.resize( _mouse );
    
    if ( this.fill ) {
    
      _ctx.fillRect( area.x, area.y, area.width, area.height );
    
    } else {
      
      _ctx.strokeRect( area.x, area.y, area.width, area.height );
      
    }
    
  },
  
  drawCircle : function( _ctx, _mouse ) {
    
    var circle = this.circle.resize( _mouse );
    
    if ( this.fill ) {
    
      _ctx.fillCircle( circle.x, circle.y, circle.radius );
    
    } else {
      
      _ctx.strokeCircle( circle.x, circle.y, circle.radius );
      
    }
    
  },
  
  drawLine : function( _ctx, _mouse ) {
    
    _ctx.drawLine( _mouse.x, _mouse.y, this.oldX, this.oldY );
    
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