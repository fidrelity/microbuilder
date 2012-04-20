var Player = function() {
  
  this.init();
  
  this.playTime = 5;
  
  this.debug = false;
  this.large = false;
  this.increment = 96;
  
  
  this.edit = false;
  
  this.objectsMoveable = false;
  this.areaSelectable = false;
  
  this.selectObject = null;
  this.selectArea = null;
  
  this.selectedObjectCallback = null;
  this.selectedObjectDragCallback = null;
  this.selectedAreaCallback = null;
  
};

Player.prototype = {
  
  init : function() {
    
    this.ctx = null;
    this.canvas = null;
    
    this.loader = null;
    this.game = null;
    
    this.fsm = new StateMachine( this );
    
    this.fsm.init({
      
      initial : 'init',
      
      states : [
        { name : 'init' },
        { name : 'load' },
        { name : 'ready', enter : this.enterReady },
        { name : 'play', enter : this.enterPlay },
        { name : 'end' },
        { name : 'edit' }
      ],
      
      transitions : [
        { name : 'parse', from : '*', to: 'load' },
        { name : 'run', from : 'load', to: 'ready', callback : this.run },
        { name : 'start', from : 'ready', to: 'play' },
        { name : 'win', from : 'play', to: 'end', callback : this.onWin },
        { name : 'lose', from : 'play', to: 'end', callback : this.onLose },
        { name : 'restart', from : 'end', to: 'ready' },
        { name : 'edit', from : '*', to: 'edit', callback : this.onEdit },
        { name : 'done', from : 'edit', to: 'ready', callback : this.onDone }
      ]
      
    });
    
  },
  
  setCanvas : function( canvas ) {
    
    var self = this,
      ctx = canvas.getContext( '2d' );
    
    ctx.debug = this.debug;
    
    this.ctx = ctx;
    this.canvas = canvas;
    
    this.large = false;
    
    this.mouse = new Mouse( this );
    this.mouse.handleClick();
    
  },

  parse : function( data, callback ) {
    
    var self = this;
    
    this.fsm.parse();
    
    this.game = new Game( this, this.mouse );
    
    Parser.parseData( data, this.game, function() {
      
      self.fsm.run();
      
      if ( self.edit ) {
      
        self.fsm.edit();
      
      }
      
      if ( callback ) {
        
        callback();
        
      }
      
    } );
    
  },
  
  run : function() {
    
    var self = this,
      stateName = this.fsm.currentState.name;
    
    if ( stateName === 'init' || stateName === 'load' ) {
    
      return;
    
    }
    
    if ( this.mouse.dragging ) {
      
      this.draw();
      
    }
    
    if ( stateName === 'play' ) {
    
      this.draw();
      this.update();
    
    }
    
    this.mouse.clicked = false;
    
    requestAnimationFrame( function() {
      
      self.run();
      
    });
    
  },
  
  update : function() {
    
    this.game.update();

    if ( this.game.timePlayed > this.playTime * 1000 ) {
  
      this.fsm.lose();
  
    }
    
  },
  
  draw : function() {
    
    var ctx = this.ctx;
    
    if ( this.large ) {
    
      var i = this.increment;
    
      ctx.clearRect( -i, -i, 640 + 2 * i, 390 + 2 * i );
    
    }
    
    ctx.lineWidth = 2;
    
    this.game.draw( ctx );
    
    if ( this.edit ) {
      
      if ( this.selectArea ) {
      
        this.selectArea.draw( ctx );
      
      }
      
      if ( this.selectObject ) {
        
        this.selectObject.draw( ctx );
        this.selectObject.getArea().draw( ctx );
        
      }
    
    }
    
  },
  
  reset : function() {
    
    this.mouse.clicked = false;
    
    if ( ( this.selectObject && !this.selectObject.stable ) || !this.selectObject ) {
    
      this.selectObject = null;
      this.selectArea = null;
    
    }
    
    this.game.reset();
    this.draw();
    
  },

  click : function() {
    
    if ( this.fsm.hasState( 'ready' ) ) {
      
      this.fsm.start();
      
    } else if ( this.fsm.hasState( 'end' ) ) {
      
      this.fsm.restart();
    
    }
    
  },

  mousedown : function( mouse ) {
    
    if ( this.selectObject && this.selectObject.stable && !this.selectObject.getArea().contains( mouse.pos ) ) {
      
      mouse.dragging = false;
      return;
      
    } 
    
    if ( this.objectsMoveable ) {
    
      this.selectObject = this.game.getGameObjectAt( mouse.pos );
      
      if ( this.selectObject && this.selectedObjectCallback ) {
        
        this.selectedObjectCallback( this.selectObject.ID );
        
      }
    
    }
    
    if ( !this.selectObject && this.areaSelectable ) {
      
      if ( !this.selectArea || !this.selectArea.contains( mouse.pos ) ) {
        
        this.selectArea = new Area( mouse.pos.x, mouse.pos.y, 0, 0 );
        
      }
      
    }
    
  },
  
  mousemove : function( mouse ) {
    
    if ( this.selectObject ) {
      
      this.selectObject.movePosition( mouse.move );
      
    } else if ( this.selectArea ) {
      
      if ( this.selectArea.done ) {
        
        this.selectArea.move( mouse.move );
        
      } else {
        
        this.selectArea.resize( mouse.move );
        
      }
      
    }
    
  },
  
  mouseup : function() {
    
    if ( this.selectArea ) {
      
      this.selectArea.adjust();
      this.selectArea.done = true;
      
      if ( this.selectedAreaCallback ) {
        
        this.selectedAreaCallback( this.selectArea );
        
      }
      
    }
    
    if ( this.selectObject && this.selectedObjectDragCallback ) {
      
      this.selectedObjectDragCallback( this.selectObject.ID, this.selectObject.position );
    
    }
    
  },
  
  enterReady : function() {
    
    this.reset();
    
    this.ctx.fillStyle = 'rgba(255,255,0,0.5)';
    this.ctx.fillRect( 320 - 64, 195 - 39, 128, 78 );
    
  },
  
  enterPlay : function() {
    
    this.reset();
    
  },

  onEdit : function() {
    
    this.enlarge();
    this.edit = true;
    
  },

  onDone : function() {
    
    this.reduce();
    this.edit = false;
    
  },
  
  onWin : function() {
    
    this.ctx.fillStyle = 'rgba(0,255,0,0.5)';
    this.ctx.fillRect( 320 - 64, 195 - 39, 128, 78 );
    
  },
  
  onLose : function() {
    
    this.ctx.fillStyle = 'rgba(255,0,0,0.5)';
    this.ctx.fillRect( 320 - 64, 195 - 39, 128, 78 );
    
  },
  
  enlarge : function() {
    
    var ctx = this.ctx,
      canvas = this.canvas,
      i = this.increment;
    
    if ( !this.large ) {
    
      canvas.width = 640 + 2 * i;
      canvas.height = 390 + 2 * i;
    
      ctx.save();
      ctx.translate( i, i );
      
      this.mouse.handleDrag();
      
      this.large = true;
    
    }
    
    this.reset();
    
  },
  
  reduce : function() {
    
    var ctx = this.ctx,
      canvas = this.canvas;
    
    if ( this.large ) {
    
      canvas.width = 640;
      canvas.height = 390;
    
      ctx.restore();
      
      this.mouse.handleClick();
      
      this.large = false;
    
    }
    
    this.reset();
    
  },
  
  setSelectObject : function( imagePath, callback ) {
    
    var image = new Image(),
      graphic = new Graphic( -1 ),
      gameObject = new GameObject( -1 ),
      self = this;
    
    image.src = imagePath;
    
    image.onload = function() {
    
      graphic.image = image;
      gameObject.startGraphic = graphic;
      gameObject.startPosition.set( Math.floor( Math.random() * 540 ), Math.floor( Math.random() * 290 ) );
      gameObject.stable = true;
    
      self.game.gameObjects.push( gameObject );
      self.selectObject = gameObject;
    
      self.reset();
      
      if ( callback ) {
        
        self.selectedObjectDragCallback = callback;
        callback( -1, gameObject.startPosition );
        
      }
    
    };
    
  },
  
  setSelectObjectID : function( gameObjectID, callback ) {
    
    var selectObject = this.game.getGameObjectWithID( gameObjectID );
    selectObject.stable = true;
    
    this.selectArea = selectObject.getArea().clone();
    this.selectObject = selectObject;
    
    if ( callback ) {
      
      this.selectedObjectDragCallback = callback;
      callback( selectObject.ID, selectObject.position );
      
    }
    
    this.reset();
    
  }
  
};