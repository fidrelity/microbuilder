var Player = function() {
  
  this.init();
  
  this.playTime = 5;
  
  this.debug = false;
  this.large = false;
  
  this.edit = false;
  this.moveObjects = false;
  this.selectArea = false;
  
  this.dragObject = null;
  this.dragArea = null;
  
  this.positionChangeCallback = null;
  
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
    
      ctx.clearRect( -128, -128, 896, 646 );
    
    }
    
    ctx.lineWidth = 2;
    
    this.game.draw( ctx );
    
    if ( this.edit ) {
      
      if ( this.dragArea ) {
    
        this.dragArea.draw( ctx );
      
      }
      
      if ( this.dragObject ) {
        
        this.dragObject.getArea().draw( ctx );
        
      }
    
    }
    
  },
  
  reset : function() {
    
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
    
    if ( this.dragObject && this.dragObject.stable ) {
      
      if ( !this.dragObject.getArea().contains( mouse.pos ) ) {
        
        mouse.dragging = false;
        
      }
      
    } else if ( this.moveObjects ) {
    
      this.dragObject = this.game.getGameObjectAt( mouse.pos );
    
    }
    
    if ( !this.dragObject && this.selectArea ) {
      
      if ( !this.dragArea || !this.dragArea.contains( mouse.pos ) ) {
        
        this.dragArea = new Area( mouse.pos.x, mouse.pos.y, 0, 0 );
        
      }
      
    }
    
  },
  
  mousemove : function( mouse ) {
    
    if ( this.dragObject ) {
      
      this.dragObject.movePosition( mouse.move );
      
    } else if ( this.dragArea ) {
      
      if ( this.dragArea.done ) {
        
        this.dragArea.move( mouse.move );
        
      } else {
        
        this.dragArea.resize( mouse.move );
        
      }
      
    }
    
  },
  
  mouseup : function() {
    
    if ( this.dragArea ) {
      
      this.dragArea.adjust();
      this.dragArea.done = true;
      
    }
    
    if ( this.dragObject ) {
      
      if ( this.positionChangeCallback ) {
        
        this.positionChangeCallback( this.dragObject.ID, this.dragObject.position );
        
      }
      
      if ( !this.dragObject.stable ) {
    
        this.dragObject = null;
      
      }
    
    }
    
  },
  
  enterReady : function() {
    
    this.reset();
    
    this.ctx.fillStyle = '#FFFFCC';
    this.ctx.fillRect( 200, 100, 240, 190 );
    
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
    
    this.ctx.fillStyle = '#CCFFCC';
    this.ctx.fillRect( 200, 100, 240, 190 );
    
  },
  
  onLose : function() {
    
    this.ctx.fillStyle = '#FFCCCC';
    this.ctx.fillRect( 200, 100, 240, 190 );
    
  },
  
  enlarge : function() {
    
    var ctx = this.ctx,
      canvas = this.canvas;
    
    if ( !this.large ) {
    
      canvas.width = 256 + 640;
      canvas.height = 256 + 390;
    
      ctx.save();
      ctx.translate( 128, 128 );
      
      this.mouse.handleDrag();
      
      this.large = true;
      
      this.reset();
    
    }
    
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
      
      this.reset();
    
    }
    
  },
  
  setDragObject : function( imagePath ) {
    
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
      self.dragObject = gameObject;
    
      self.reset();
    
    };
    
  },
  
  setDragObjectID : function( gameObjectID ) {
    
    var dragObject = this.game.getGameObjectWithID( gameObjectID );
    dragObject.stable = true;
    
    this.dragArea = dragObject.getArea().clone();
    this.dragObject = dragObject;
    
    this.reset();
    
  }
  
};