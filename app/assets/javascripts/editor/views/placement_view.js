var PlacementView = Ember.View.extend({
  
  templateName : 'editor/templates/placement_template',

  classNames : ['placementview', 'optionview'],
  
  type : 'location', // location, direction, area, offset, bounding, path, placing
  subtype : 'rect', // rect, circle
  
  observer : null,
  
  width : 640,
  height : 390,
  
  ctx : null,
  mouse : null,
  
  background : null,
  gameObjects : [],
  
  gameObject : null,
  graphic : null,
  
  object : null,
  object2 : null,
  
  area : null,

  path : null,  
  
  increment : { x : 96, y : 60 },
  scale : 2,

  directionAngle : 0,
  
  didInsertElement : function() {
    
    var canvas = this.$( '.placement' )[0],
      ctx = canvas.getContext( '2d' ),
      type = this.type,
      inc = this.increment,
      self = this;
      
    this.addObserver( 'directionAngle', function() {
           
      self.set("directionAngle", 90);
      
    });
    
    this.area = new Area;

    this.path = new Path;

    $( canvas ).css({ 'border' : '2px solid #AAA', 'background-color' : '#CCC' });
    
    $('.placement').addTouch();
    
    if ( type === 'location' || type === 'area' || type === 'path' || type === 'placing' ) {
      
      canvas.width = ( 640 + inc.x * 2 ) * 0.5;
      canvas.height = ( 390 + inc.y * 2 ) * 0.5;
      
      ctx.scale( 0.5, 0.5 );
      ctx.translate( inc.x, inc.y );
      
      ctx.lineWidth = 3;
      
    } else if ( type === 'direction' || type === 'offset') {
      
      canvas.width = canvas.height = 200;
      this.width = this.height = 400;
      
      ctx.scale( 0.5, 0.5 );
      
      ctx.lineWidth = 3;
      
      this.increment = { x : 0, y : 0 };
      
    } else if ( type === 'bounding' ) {
      
      this.width = this.gameObject.graphic.frameWidth + 50;
      this.height = this.gameObject.graphic.frameHeight + 50;
      
      canvas.width = this.width * 2;
      canvas.height = this.height * 2;
      
      ctx.scale( 2, 2 );
      
      ctx.lineWidth = 1;
      
      this.scale = 0.5;
      this.increment = { x : 0, y : 0 };
      
      this.addObserver( 'subtype', function() {
        
        self.setBoundingType();
        
      });
      
      if ( this.subtype === 'circle' ) {
        
        this.area = new Circle;
        
      }
      
    }
    
    this.ctx = ctx;
    
    this.mouse = new Mouse( this, canvas );
    this.mouse.handleDrag();
    
    this.doDraw = function() {
      
      if ( !self.redraw ) {
      
        self.redraw = true;
      
        requestAnimationFrame( function() {
        
          self.draw();
          
          self.redraw = false;
        
        });
      
      }
      
    }
    
    this.load();
    
  },
  
  load : function() {
  
    var objs = App.gameObjectsController.content, 
      type = this.type, 
      obs = this.observer, 
      img, i;
    
    if ( type === 'location' || type === 'area' || type === 'path' || type === 'placing' ) {
      
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
          
          this.gameObjects.push( img );
          
          if ( this.object === objs[i] ) {
            
            this.object = img;
            
            if ( obs.location ) {
              
              this.object.pos.copy( obs.location );
              
            }
            
          }
        
        }
        
        if ( this.graphic ) {
          
          img = new Image();
          
          img.src = this.graphic.imagePath;
          img.onload = this.doDraw;
          img.frameWidth = this.graphic.frameWidth;
          img.pos = this.observer.position;
          
          this.gameObjects.unshift( img );
          this.object = img;
          
        }
      
      }
      
    } else {
      
      this.object = this.getImage( this.object || this.gameObject );
      this.gameObjects = [this.object];
      
      this.object.pos.set( this.width * 0.5, this.height * 0.5 );
      
      if ( type === 'direction' ) {
      
        this.object.pos.addSelf( obs.location );       

      } else if ( type === 'offset' ) {
        
        this.object.pos.addSelf( obs.offset );
        
        img = this.getImage( this.object2 );
        img.pos.set( this.width * 0.5, this.height * 0.5 );
        
        this.gameObjects.push( img );
        
      } else if ( type === 'bounding' && this.gameObject.boundingArea ) {
        
        this.area = this.gameObject.boundingArea.clone();
        
        this.area.x += this.object.pos.x;
        this.area.y += this.object.pos.y;
        
        this.area.done = true;
        
        this.sendArea();
        
      }
      
    }
    
    if ( type === 'area' && obs.action && obs.action.area ) {
      
      this.area.copy( obs.action.area );
      this.area.done = true;
      
    }
    
    if ( type === 'path' ) {
      
      if ( obs.path ) {
        
        this.path.copy( obs.path );
        
      }
      
      this.path.points[0] = this.object.pos.getData();
      
    }
    
  },
  
  getImage : function( obj ) {
    
    var img = new Image();
    
    img.src = obj.graphic.imagePath;
    img.onload = this.doDraw;
    img.frameWidth = obj.graphic.frameWidth;
    img.pos = obj.position.clone();
    
    return img;
    
  },
  
  setBoundingType : function() {
    
    if ( this.subtype === 'circle' && !this.area.radius ) {
      
      this.area = new Circle();
      
    } else if ( this.subtype === 'rect' && !this.area.width ) {
      
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
  
  draw : function() {
    
    var ctx = this.ctx, i = this.increment, img, w, h;
    
    if ( i.x || i.y ) {
      
      ctx.clearRect( -i.x, -i.y, this.width + 2 * i.x, this.height + 2 * i.y );
      
    }
    
    if ( this.background ) {
    
      ctx.drawImage( this.background, 0, 0 );
    
    } else {
      
      ctx.fillStyle = '#FFF';
      ctx.fillRect( 0, 0, this.width, this.height );
      
    }
    
    for ( i = this.gameObjects.length - 1; i >= 0; i-- ) {
      
      img = this.gameObjects[i];
      w = img.frameWidth;
      h = img.height;
      
      ctx.drawImage( img, 0, 0, w, h, img.pos.x - w * 0.5, img.pos.y - h * 0.5, w, h );
      
    }
    
    if ( this.type === 'bounding' ) {
      
      img = this.object;
      w = img.frameWidth;
      h = img.height;
      
      ctx.strokeStyle = '#AAA';
      ctx.dashedRect( img.pos.x - w * 0.5, img.pos.y - h * 0.5, w, h, 7 );
      
      ctx.strokeStyle = '#000';
      this.area.draw( ctx );
      
    } else if ( this.object ) {
      
      img = this.object;
      w = img.frameWidth;
      h = img.height;
      
      ctx.strokeRect( img.pos.x - w * 0.5, img.pos.y - h * 0.5, w, h );
      
      if ( this.type === 'direction' ) {
        
        this.drawArrow( ctx );

        // var angle = new Vector( -this.width * 0.5, -this.height * 0.5 ).addSelf( this.object.pos ).angle();
        // this.set("directionAngle", Math.round( angle / Math.PI * 180) );
        
      } else if ( this.type === 'path' ) {
        
        ctx.fillStyle = ctx.strokeStyle = '#000';
        this.path.draw( ctx );
        
      }
      
    } else {
      
      this.area.draw( this.ctx );
      
    }
    
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
  
  mousedown : function( mouse ) {
 
    var obj = this.object,
      area = this.area;
    
    if ( this.type === 'path' ) {
      
      this.path.add( {x: mouse.pos.x, y: mouse.pos.y} );
      this.observer.setPath( this.path );
      this.doDraw();
      
    } else if ( obj && this.type !== 'bounding' ) {
      
      area.set( obj.pos.x - obj.frameWidth * 0.5, obj.pos.y - obj.height * 0.5, obj.frameWidth, obj.height );
      
      if ( !area.contains( mouse.pos ) ) {
        
        mouse.dragging = false;
        
      }
      
    } else if ( !area.contains( mouse.pos ) ) {
      
      area.set( mouse.pos.x, mouse.pos.y, 0, 0 );
      area.done = false;
      
      this.doDraw();
      
    }
    
  },
  
  mousemove : function( mouse ) {
    
    var obj = this.object,
      area = this.area;
    
    if ( this.type === 'path' ) {
      
      return;
      
    } else if ( obj && this.type !== 'bounding' ) {
      
      obj.pos.addSelf( mouse.move );
      
    } else {
    
      if ( area.done ) {
        
        area.move( mouse.move );
        
      } else {
        
        area.resize( mouse.pos );
        
      }
    
    }
    
    this.doDraw();
    
  },
  
  mouseup : function( mouse ) {
    
    var obj = this.object,
      area = this.area;
    
    if ( obj && this.type !== 'bounding' ) {
      
      if ( this.type === 'direction' ) {
        
        this.observer.setLocation( new Vector( -this.width * 0.5, -this.height * 0.5 ).addSelf( obj.pos ) );
        
      } else if ( this.type === 'offset' ) {
        
        this.observer.setOffset( new Vector( -this.width * 0.5, -this.height * 0.5 ).addSelf( obj.pos ) );
        
      } else if ( this.type === 'location' ) {
      
        this.observer.setLocation( obj.pos.clone() );
        
      }
      
    } else {
      
      area.adjust();
      area.done = true;
      
      if ( this.type === 'area' ) {
        
        this.observer.decide( area.clone() );
        
      } else {
        
        this.sendArea();
        
      }
      
    }
    
  },
  
  isPath : function() {
    
    return this.type === "path";
    
  }.property("type"),
  
  isDirection : function() {
    
    //return this.type === "direction";
    return false;
    
  }.property("direction"),

  // getDirectionAngle : function() {

  //   return 20;

  // }.observes("directionAngle"),

  clearPath : function() {
    
    this.path = new Path( [this.object.pos.getData()] );
    this.observer.setPath( this.path );
    this.doDraw();
    
  }
  
});
