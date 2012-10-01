var PlacementView = Ember.View.extend({
  
  templateName : 'editor/templates/placement_template',
  classNames : ['optionview'],
  
  observer : null,
  
  canvas : null,
  ctx : null,
  
  mouse : null,
  
  width : 640,
  height : 390,
  
  area : null,
  
  redraw : false,
  increment : { x : 96, y : 60 },
  scale : 2,
  
  didInsertElement : function() {
    
    var canvas = this.$( '.placement' ),
      ctx = canvas[0].getContext( '2d' ),
      self = this;
      
    canvas.addTouch();
    
    this.canvas = canvas[0];
    this.ctx = ctx;
    
    this.mouse = new Mouse( this, canvas[0] );
    this.mouse.handleDrag();
    
    this.area = new Area;
    
    this.doDraw = function() {
      
      if ( !self.redraw ) {
      
        self.redraw = true;
      
        requestAnimationFrame( function() {
        
          self.draw( self.ctx );
          
          self.redraw = false;
        
        });
      
      }
      
    }
    
    this.initView( canvas[0], ctx );
    
  },
  
  initGame : function( _canvas, _ctx ) {
    
    var objs = App.gameObjectsController.content,
      obs = this.observer,
      inc = this.increment,
      img, i;
    
    _canvas.width = ( 640 + inc.x * 2 ) * 0.5;
    _canvas.height = ( 390 + inc.y * 2 ) * 0.5;
    
    _ctx.scale( 0.5, 0.5 );
    _ctx.translate( inc.x, inc.y );
    
    _ctx.lineWidth = 3;
    
    
    if ( App.game.background ) {
      
      img = new Image();
      img.src = App.game.background.imagePath;
      img.onload = this.doDraw;
      
      this.background = img;
      
    }
    
    if ( objs ) {
    
      this.gameObjects = [];
      
      for ( i = 0; i < objs.length; i++ ) {
        
        img = this.getImage( objs[i] );
        
        if ( this.object === objs[i] ) {
          
          this.object = img;
          this.gameObjects.unshift( img );
          
        } else {
          
          this.gameObjects.push( img );
          
        }
      
      }
    
    }
    
  },
  
  initSole : function( _canvas, _ctx ) {
    
    _canvas.width = _canvas.height = 200;
    this.width = this.height = 400;
    
    _ctx.scale( 0.5, 0.5 );
    
    _ctx.lineWidth = 3;
    
    this.increment = { x : 0, y : 0 };
    
  },
  
  getImage : function( _obj ) {
    
    var img = new Image();
    
    img.src = _obj.graphic.imagePath;
    img.onload = this.doDraw;
    img.frameWidth = _obj.graphic.frameWidth;
    img.pos = _obj.position.clone();
    
    return img;
    
  },
  
  sendArea : function() {
    
    var area = this.area.clone(),
      obj = this.object;
    
    area.x -= obj.pos.x;
    area.y -= obj.pos.y;
    
    area.adjust();
    
    this.observer.setArea( area );
    
  },
  
  drawGame : function( _ctx ) {
    
    var i = this.increment, img, w, h;
    
    _ctx.clearRect( -i.x, -i.y, this.width + 2 * i.x, this.height + 2 * i.y );
    
    if ( this.background ) {
    
      _ctx.drawImage( this.background, 0, 0 );
    
    } else {
      
      _ctx.fillStyle = '#FFF';
      _ctx.fillRect( 0, 0, this.width, this.height );
      
    }
    
    for ( i = this.gameObjects.length - 1; i >= 0; i-- ) {
      
      this.drawImage( _ctx, this.gameObjects[i] );
      
    }
    
  },
  
  drawObject : function( _ctx, _stroke ) {
    
    var img = this.object;
    
    _ctx.fillStyle = '#FFF';
    _ctx.fillRect( 0, 0, this.width, this.height );
    
    if ( this.object2 ) {
      
      this.drawImage( _ctx, this.object2 );
      
    }
    
    this.drawImage( _ctx, this.object, _stroke );
    
  },
  
  drawImage : function( _ctx, _obj, _stroke ) {
    
    var w = _obj.frameWidth,
      h = _obj.height;
    
    _ctx.drawImage( _obj, 0, 0, w, h, _obj.pos.x - w * 0.5, _obj.pos.y - h * 0.5, w, h );
    
    if ( _stroke ) {
      
      _ctx.strokeStyle = '#000';
      _ctx.strokeRect( _obj.pos.x - w * 0.5, _obj.pos.y - h * 0.5, w, h );
      
    }
    
  },
  
  mousedownObject : function( _mouse ) {
  
    var obj = this.object,
      area = this.area;
    
    area.set( obj.pos.x - obj.frameWidth * 0.5, obj.pos.y - obj.height * 0.5, obj.frameWidth, obj.height );
    
    if ( !area.contains( _mouse.pos ) ) {
      
      _mouse.dragging = false;
      
    }
    
  },
  
  mousedownArea : function( _mouse ) {
  
    var area = this.area;
    
    if ( !area.contains( _mouse.pos ) ) {
      
      area.set( _mouse.pos.x, _mouse.pos.y, 0, 0 );
      area.done = false;
      
      this.doDraw();
      
    }
    
  },
  
  mousemoveObject : function( _mouse ) {
    
    this.object.pos.addSelf( _mouse.move );
    
    this.doDraw();
    
  },
  
  mousemoveArea : function( _mouse ) {
    
    var area = this.area;
    
    if ( area.done ) {
      
      area.move( _mouse.move );
      
    } else {
      
      area.resize( _mouse.pos );
      
    }
    
    this.doDraw();
    
  }
  
});

var LocationPlacementView = PlacementView.extend({
  
  initView : function( _canvas, _ctx ) {
    
    var obs = this.observer;
    
    this.initGame( _canvas, _ctx );
    
    if ( obs.location ) {
      
      this.object.pos.copy( obs.location );
      
    }
    
    this.set( 'mousedown', this.mousedownObject );
    this.set( 'mousemove', this.mousemoveObject );
    
  },
  
  draw : function( _ctx ) {
    
    this.drawGame( _ctx );
    
    this.drawImage( _ctx, this.object, true );
    
  },
  
  mouseup : function( _mouse ) {
    
    this.observer.setLocation( this.object.pos.clone() );
    
  }
  
});

var DirectionPlacementView = PlacementView.extend({
  
  initView : function( _canvas, _ctx ) {
    
    this.initSole( _canvas, _ctx );
    
    this.object = this.getImage( this.object );
    
    this.object.pos.set( this.width * 0.5, this.height * 0.5 ).addSelf( this.observer.location );
    
    this.set( 'mousedown', this.mousedownObject );
    this.set( 'mousemove', this.mousemoveObject );
    
  },
  
  draw : function( _ctx ) {
    
    this.drawObject( _ctx, true );
    
    this.drawArrow( _ctx );
    
  },
  
  drawArrow : function( ctx ) {
    
    var i = new Vector( -this.width * 0.5, -this.height * 0.5 ).addSelf( this.object.pos ).angle();
    
    ctx.save();
    ctx.translate( this.width * 0.5, this.height * 0.5 );
    ctx.rotate( i );
    
    ctx.fillStyle = ctx.strokeStyle = '#000';
    ctx.drawArrow( 0, 0, 130, 0 );
    
    ctx.restore();
    
  },
  
  mouseup : function( _mouse ) {
    
    this.observer.setLocation( new Vector( -this.width * 0.5, -this.height * 0.5 ).addSelf( this.object.pos ) );
    
  }
  
});

var AreaPlacementView = PlacementView.extend({
  
  area : null,
  
  initView : function( _canvas, _ctx ) {
    
    var obs = this.observer;
    
    this.initGame( _canvas, _ctx );
    
    if ( obs.action && obs.action.area ) {
      
      this.area.copy( obs.action.area );
      this.area.done = true;
      
    }
    
    this.set( 'mousedown', this.mousedownArea );
    this.set( 'mousemove', this.mousemoveArea );
    
  },
  
  draw : function( _ctx ) {
    
    this.drawGame( _ctx );
    
    this.area.draw( _ctx );
    
  },
  
  mouseup : function( _mouse ) {
    
    var area = this.area;
    
    area.adjust();
    area.done = true;
    
    this.observer.decide( area.clone() );
    
  }
  
});

var OffsetPlacementView = PlacementView.extend({
  
  initView : function( _canvas, _ctx ) {
    
    this.initSole( _canvas, _ctx );
    
    this.object = this.getImage( this.object );
    this.object.pos.set( this.width * 0.5, this.height * 0.5 ).addSelf( this.observer.offset );
    
    this.object2 = this.getImage( this.object2 );
    this.object2.pos.set( this.width * 0.5, this.height * 0.5 );
    
    this.set( 'mousedown', this.mousedownObject );
    this.set( 'mousemove', this.mousemoveObject );
    
  },
  
  draw : function( _ctx ) {
    
    this.drawObject( _ctx, true );
    
  },
  
  mouseup : function( _mouse ) {
    
    this.observer.setOffset( new Vector( -this.width * 0.5, -this.height * 0.5 ).addSelf( this.object.pos ) );
    
  }
  
});

var BoundingPlacementView = PlacementView.extend({
  
  type : 'rect', // rect, circle
  gameObject : null,
  
  initView : function( _canvas, _ctx ) {
    
    var self = this;
    
    if ( this.type === 'circle' ) {
      
      this.area = new Circle;
      
    }
    
    this.addObserver( 'type', function() {
      
      self.setBoundingType();
      
    });
    
    this.width = this.gameObject.graphic.frameWidth + 50;
    this.height = this.gameObject.graphic.frameHeight + 50;
    
    _canvas.width = this.width * 2;
    _canvas.height = this.height * 2;
    
    _ctx.scale( 2, 2 );
    _ctx.lineWidth = 1;
    
    this.object = this.getImage( this.gameObject );
    this.object.pos.set( this.width * 0.5, this.height * 0.5 );
    
    if ( this.gameObject.boundingArea ) {
      
      this.area = this.gameObject.boundingArea.clone();
      
      this.area.x += this.width * 0.5;
      this.area.y += this.height * 0.5;
      
      this.area.done = true;
      
      this.sendArea();
      
    }
    
    this.scale = 0.5;
    this.increment = { x : 0, y : 0 };
    
    this.set( 'mousedown', this.mousedownArea );
    this.set( 'mousemove', this.mousemoveArea );
    
  },
  
  draw : function( _ctx ) {
    
    this.drawObject( _ctx );
    
    img = this.object;
    w = img.frameWidth;
    h = img.height;
    
    _ctx.strokeStyle = '#AAA';
    _ctx.dashedRect( img.pos.x - w * 0.5, img.pos.y - h * 0.5, w, h, 7 );
    
    _ctx.strokeStyle = '#000';
    this.area.draw( _ctx );
    
  },
  
  setBoundingType : function() {
    
    if ( this.type === 'circle' && !this.area.radius ) {
      
      this.area = new Circle();
      
    } else if ( this.type === 'rect' && !this.area.width ) {
      
      this.area = new Area();
      
    }
    
    this.sendArea();
    
    this.doDraw();
    
  },
  
  mouseup : function( _mouse ) {
    
    var area = this.area;
    
    area.adjust();
    area.done = true;
    
    this.sendArea();
    
  }
  
});

var PathPlacementView = PlacementView.extend({
  
  path : null,
  isPath : true,
  
  initView : function( _canvas, _ctx ) {
    
    var obs = this.observer;
    
    this.initGame( _canvas, _ctx );
    
    this.path = new Path;
    
    if ( obs.path ) {
      
      this.path.copy( obs.path );
      
    }
    
    this.path.points[0] = this.object.pos.getData();
    
  },
  
  draw : function( _ctx ) {
    
    this.drawGame( _ctx );
    
    this.drawImage( _ctx, this.object, true );
    
    _ctx.fillStyle = _ctx.strokeStyle = '#000';
    this.path.draw( _ctx );
    
  },
  
  clearPath : function() {
    
    this.path = new Path( [this.object.pos.getData()] );
    this.observer.setPath( this.path );
    this.doDraw();
    
  },
  
  mousedown : function( _mouse ) {
    
    this.path.add( { x: _mouse.pos.x, y: _mouse.pos.y } );
    this.observer.setPath( this.path );
    this.doDraw();
    
  },
  
  mousemove : function( _mouse ) { return; },
  mouseup : function( _mouse ) { return; }
  
});

var PlacingPlacementView = PlacementView.extend({
  
  initView : function( _canvas, _ctx ) {
    
    var img;
    
    this.initGame( _canvas, _ctx );
    
    img = new Image();
    
    img.src = this.graphic.imagePath;
    img.onload = this.doDraw;
    img.frameWidth = this.graphic.frameWidth;
    img.pos = this.observer.position;
    
    this.gameObjects.unshift( img );
    this.object = img;
    
    this.set( 'mousedown', this.mousedownObject );
    this.set( 'mousemove', this.mousemoveObject );
    
  },
  
  draw : function( _ctx ) {
    
    this.drawGame( _ctx );
    
    this.drawImage( _ctx, this.object, true );
    
  },
  
  mouseup : function( _mouse ) { return; }
  
});
