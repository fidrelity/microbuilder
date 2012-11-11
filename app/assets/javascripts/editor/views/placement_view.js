var PlacementView = Ember.View.extend({
  
  templateName : 'editor/templates/placement_template',
  classNames : ['optionview'],
  
  observer : null,
  
  canvas : null,
  ctx : null,
  
  width : 640,
  height : 390,
  
  mouse : null,
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
  
  drawGame : function( _ctx ) {
    
    var inc = this.increment, i;
    
    _ctx.clearRect( -inc.x, -inc.y, this.width + 2 * inc.x, this.height + 2 * inc.y );
    
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
  
  mousedown : function( _mouse ) { return; },
  mousemove : function( _mouse ) { return; },
  mouseup : function( _mouse ) { return; }
  
});

// Object

var ObjectPlacementView = PlacementView.extend({
  
  initView : function( _canvas, _ctx ) {
    
    var img = new Image();
    
    this.initGame( _canvas, _ctx );
    
    img.src = this.graphic.imagePath;
    img.onload = this.doDraw;
    img.frameWidth = this.graphic.frameWidth;
    img.pos = this.observer.position;
    
    this.gameObjects.unshift( img );
    this.object = img;
    
  },
  
  draw : function( _ctx ) {
    
    this.drawGame( _ctx );
    
    this.drawImage( _ctx, this.object, true );
    
  },
  
  mousedown : function( _mouse ) {
  
    var obj = this.object,
      area = this.area;
    
    area.set( obj.pos.x - obj.frameWidth * 0.5, obj.pos.y - obj.height * 0.5, obj.frameWidth, obj.height );
    
    if ( !area.contains( _mouse.pos ) ) {
      
      _mouse.dragging = false;
      
    }
    
  },
  
  mousemove : function( _mouse ) {
    
    this.object.pos.addSelf( _mouse.move );
    
    this.doDraw();
    
  }
  
});

var LocationPlacementView = ObjectPlacementView.extend({

  startPosition : null,
  
  initView : function( _canvas, _ctx ) {
    
    var obs = this.observer;
    
    this.initGame( _canvas, _ctx );
    
    if ( obs.location ) {
      
      this.object.pos.copy( obs.location );
      
      this.startPosition = obs.parentGameObject.position;
    }    
    
  },
  
  draw : function( _ctx ) {    

    this.drawGame( _ctx );

    this.drawStartLocation( _ctx );
    
    this.drawImage( _ctx, this.object, true );
    
  },

  drawStartLocation : function( _ctx ) {

    var w = this.object.frameWidth,
        h = this.object.height,
        x = this.startPosition.x - w * 0.5,
        y = this.startPosition.y - h * 0.5;

    _ctx.strokeStyle = '#CCC';
    _ctx.dashedRect( x , y, w, h, 5);

    _ctx.save();
    _ctx.globalAlpha = 0.4;
    _ctx.drawImage( this.object, 0, 0, w, h, x, y, w, h );
    _ctx.restore();

  },
  
  mouseup : function( _mouse ) {
    
    this.observer.setLocation( this.object.pos.clone() );
    
  }
  
});

var DirectionPlacementView = ObjectPlacementView.extend({
  
  initView : function( _canvas, _ctx ) {
    
    this.initSole( _canvas, _ctx );
    
    this.object = this.getImage( this.object );
    
    this.object.pos.set( this.width * 0.5, this.height * 0.5 ).addSelf( this.observer.location );
    
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

var OffsetPlacementView = ObjectPlacementView.extend({
  
  initView : function( _canvas, _ctx ) {
    
    this.initSole( _canvas, _ctx );
    
    this.object = this.getImage( this.object );
    this.object.pos.set( this.width * 0.5, this.height * 0.5 ).addSelf( this.observer.offset );
    
    this.object2 = this.getImage( this.object2 );
    this.object2.pos.set( this.width * 0.5, this.height * 0.5 );
    
  },
  
  draw : function( _ctx ) {
    
    this.drawObject( _ctx, true );
    
  },
  
  mouseup : function( _mouse ) {
    
    this.observer.setOffset( new Vector( -this.width * 0.5, -this.height * 0.5 ).addSelf( this.object.pos ) );
    
  }
  
});

// Area

var AreaPlacementView = PlacementView.extend({
  
  area : null,
  
  initView : function( _canvas, _ctx ) {
    
    var obs = this.observer;
    
    this.initGame( _canvas, _ctx );
    
    if ( obs.action && obs.action.area ) {
      
      this.area.copy( obs.action.area );
      this.area.done = true;
      
    }
    
  },
  
  draw : function( _ctx ) {
    
    this.drawGame( _ctx );
    
    this.area.draw( _ctx );
    
  },
  
  mousedown : function( _mouse ) {
  
    var area = this.area;
    
    if ( !area.contains( _mouse.pos ) ) {
      
      area.set( _mouse.pos.x, _mouse.pos.y, 0, 0 );
      area.done = false;
      
      this.doDraw();
      
    }
    
  },
  
  mousemove : function( _mouse ) {
    
    var area = this.area;
    
    if ( area.done ) {
      
      area.move( _mouse.move );
      
    } else {
      
      area.resize( _mouse.pos );
      
    }
    
    this.doDraw();
    
  },
  
  mouseup : function( _mouse ) {
    
    var area = this.area;
    
    area.adjust();
    area.done = true;
    
    this.observer.decide( area.clone() );
    
  }
  
});

var BoundingPlacementView = AreaPlacementView.extend({
  
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
  
  sendArea : function() {
    
    var area = this.area.clone(),
      obj = this.object;
    
    area.x -= obj.pos.x;
    area.y -= obj.pos.y;
    
    area.adjust();
    
    this.observer.setArea( area );
    
  },
  
  mouseup : function( _mouse ) {
    
    var area = this.area;
    
    area.adjust();
    area.done = true;
    
    this.sendArea();
    
  }
  
});

// Path

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

  updatePath : function() {

    this.observer.setPath( this.path );
    this.doDraw();

  },
  
  clearPath : function() {
    
    this.path = new Path( [this.object.pos.getData()] );
    this.updatePath();
    
  },

  removeLastPath : function() {

    if(this.path.points.length === 1) {

      this.clearPath();      

    } else {

      this.path.points.pop();  

    }

    this.updatePath();

  },
  
  mousedown : function( _mouse ) {
    
    this.path.add( { x: _mouse.pos.x, y: _mouse.pos.y } );
    this.updatePath();
    
  }
  
});


var FlipView = ObjectPlacementView.extend({

  scaleX : 1,
  scaleY : 1,
  translateX : 0,
  translateY : 0,
  
  initView : function( _canvas, _ctx ) {
    
    this.initSole( _canvas, _ctx );
    
    this.object = this.getImage( this.object );

    this.width = this.object.frameWidth;
    this.height = this.object.height;
  
    this.canvas = _canvas;    
    _canvas.width = this.width;
    _canvas.height = this.height;
        
    _ctx.lineWidth = 1;

    this.object.pos.set( this.width * 0.5, this.height * 0.5);

    var self = this;

    var observer = this.observer;
    
    this.setTransformation();

    this.addObserver( 'observer.mode', function() {
      
      self.setTransformation();
      self.doDraw();
      
    });
    
  },

  
  draw : function( _ctx, _obj ) {
    
    this.canvas.width = this.canvas.width;

    _ctx.save();

    _ctx.translate(this.translateX, this.translateY);
    _ctx.scale(this.scaleX, this.scaleY);
        
    this.drawImage(_ctx, this.object, false);

    _ctx.restore();
    
  },

  setTransformation : function() {

    var mode = this.observer.mode;

    if ( mode === 'horizontally' ) {
      
      this.translateX = this.width;
      this.translateY = 0;

      this.scaleX = -1;
      this.scaleY = 1;

      
    } else if ( mode === 'vertically' ) {

      this.translateX = 0;
      this.translateY = this.height;
      
      this.scaleX = 1;
      this.scaleY = -1;
      
    } else if ( mode === 'both' ) {

      this.translateX = this.width;
      this.translateY = this.height;
      
      this.scaleX = -1;
      this.scaleY = -1;
      
    }    
    
  }
  
  
});