var PlacementView = Ember.View.extend({
  
  template : Ember.Handlebars.compile('<canvas class="placement"></canvas>'),
  
  type : 'location', // location, direction, area, offset
  
  observer : null,
  
  width : 640,
  height : 390,
  
  ctx : null,
  mouse : null,
  
  background : null,
  gameObjects : [],
  
  gameObject : null,
  area : null,
  
  increment : 96,
  scale : 2,
  
  didInsertElement : function() {
    
    var canvas = this.$( '.placement' )[0],
      ctx = canvas.getContext( '2d' ),
      type = this.type,
      inc = this.increment,
      self = this;
    
    this.area = new Area;
    
    $( canvas ).css({ 'border' : '2px solid black', 'background-color' : '#CCC' });
    
    if ( type === 'location' || type === 'area' ) {
      
      canvas.width = ( 640 + inc * 2 ) * 0.5;
      canvas.height = ( 390 + inc * 2 ) * 0.5;
      
      ctx.scale( 0.5, 0.5 );
      ctx.translate( inc, inc );
      
    } else if ( type === 'direction' || type === 'offset' ) {
      
      canvas.width = canvas.height = 200;
      this.width = this.height = 400;
      
      ctx.scale( 0.5, 0.5 );
      
      this.increment = 0;
      
    }
    
    ctx.lineWidth = 3;
    
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
    
    var img, objs = App.gameObjectsController.content, i, type = this.type;
    
    if ( type === 'location' || type === 'area' ) {
    
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
          
          if ( this.gameObject === objs[i] ) {
            
            this.gameObject = img;
            
          }
        
        }
      
      }
      
    } else {
      
      this.gameObject = this.getImage( this.gameObject );
      this.gameObjects = [this.gameObject];
      
      if ( this.type === 'direction' ) {
      
        this.gameObject.pos.set( this.width * 0.75, this.height * 0.5 );
      
      }
      
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
  
  draw : function() {
    
    var ctx = this.ctx, i = this.increment, img, w, h;
    
    if ( i ) {
      
      ctx.clearRect( -i, -i, this.width + 2 * i, this.height + 2 * i );
      
    }
    
    if ( this.background ) {
    
      ctx.drawImage( this.background, 0, 0 );
    
    } else {
      
      ctx.fillStyle = '#FFF';
      ctx.fillRect( 0, 0, this.width, this.height );
      
    }
    
    for ( i = 0; i < this.gameObjects.length; i++ ) {
      
      img = this.gameObjects[i];
      w = img.frameWidth;
      h = img.height;
      
      ctx.drawImage( img, 0, 0, w, h, img.pos.x - w * 0.5, img.pos.y - h * 0.5, w, h );
      
    }
    
    if ( this.gameObject ) {
      
      img = this.gameObject;
      w = img.frameWidth;
      h = img.height;
      
      ctx.strokeRect( img.pos.x - w * 0.5, img.pos.y - h * 0.5, w, h );
      
      if ( this.type === 'direction' ) {
        
        this.drawArrow( ctx );
        
      }
      
    } else {
      
      this.area.draw( this.ctx );
      
    }
    
  },
  
  drawArrow : function( ctx ) {
    
    var i = new Vector( -this.width * 0.5, -this.height * 0.5 ).addSelf( this.gameObject.pos ).angle();
    
    ctx.save();
    ctx.translate( this.width * 0.5, this.height * 0.5 );
    ctx.rotate( i );
    
    ctx.line( 0, 0, 130, 0 );
    
    ctx.translate( 130, 0 );
    
    ctx.beginPath();
    
    ctx.moveTo( -5, 0 );
    ctx.lineTo( -10, -12 );
    ctx.lineTo( 15, 0 );
    ctx.lineTo( -10, 12 );
    
    ctx.closePath();
    
    ctx.fillStyle = '#000';
    ctx.fill();
    
    ctx.restore();
    
  },
  
  mousedown : function( mouse ) {
    
    var obj = this.gameObject,
      area = this.area;
    
    if ( obj ) {
      
      area.set( obj.pos.x - obj.frameWidth * 0.5, obj.pos.y - obj.height * 0.5, obj.frameWidth, obj.height );
      
      if ( !area.contains( mouse.pos ) ) {
        
        mouse.dragging = false;
        
      }
      
    } else if ( !area.contains( mouse.pos ) ) {
      
      area.set( mouse.pos.x, mouse.pos.y, 0, 0 );
      area.done = false;
      
    }
    
  },
  
  mousemove : function( mouse ) {
    
    var obj = this.gameObject,
      area = this.area;
    
    if ( obj ) {
      
      obj.pos.addSelf( mouse.move );
      
    } else {
    
      if ( area.done ) {
        
        area.move( mouse.move );
        
      } else {
        
        area.resize( mouse.move );
        
      }
    
    }
    
    this.doDraw();
    
  },
  
  mouseup : function( mouse ) {
    
    var obj = this.gameObject,
      area = this.area;
    
    if ( obj ) {
      
      if ( this.type === 'direction' ) {
        
        this.observer.locate( new Vector( -this.width * 0.5, -this.height * 0.5 ).addSelf( obj.pos ) );
        
      } else {
      
        this.observer.locate( obj.pos );
        
      }
      
    } else {
      
      area.adjust();
      area.done = true;
      
      this.observer.contain( area );
      
    }
    
  }
  
});