var Player = function() {
  
  this.ID = Player.count++;
  
  this.ctx = null;
  this.canvas = null;
  
  this.game = null;
  this.mouse = null;
  
  this.fsm = new StateMachine( this );
  
  this.fsm.init({
    
    initial : 'init',
    
    states : [
      { name : 'init' },
      { name : 'load' },
      
      { name : 'ready', enter : this.enterReady },
      { name : 'play', enter : this.enterPlay, draw : this.draw, update : this.update },
      { name : 'end' },
      
      { name : 'edit', draw : this.drawEdit },
      { name : 'trial', draw : this.drawTrial, update : this.update }
    ],
    
    transitions : [
      { name : 'parse', from : '*', to: 'load' },
      { name : 'loaded', from : 'load', to: 'ready' },
      { name : 'edit', from : 'load', to: 'edit', callback : this.onEdit },
      
      { name : 'start', from : 'ready', to: 'play' },
      { name : 'win', from : 'play', to: 'end', callback : this.onWin },
      { name : 'lose', from : 'play', to: 'end', callback : this.onLose },
      { name : 'restart', from : 'end', to: 'ready' },
      
      { name : 'try', from : 'edit', to: 'trial', callback : this.onTrial },
      { name : 'stop', from : 'trial', to: 'edit', callback : this.onStop }
      
    ]
    
  });
  
  this.edit = false;
  this.increment = 96;
  
  this.time = 0;
  this.timePlayed = 0;
  this.playTime = 5000;
  
  this.objectsMoveable = false;
  this.areaSelectable = false;
  
  this.showTimeline = false;
  
  this.selectObject = null;
  this.selectArea = null;
  
  this.selectedObjectCallback = function() {};
  this.selectedObjectDragCallback = function() {};
  this.selectedAreaCallback = function() {};
  
  this.terminate = false;
  
};

Player.prototype = {
  
  setCanvas : function( canvas ) {
    
    var ctx = canvas.getContext( '2d' ),
      mouse = new Mouse( this, canvas ),
      i = this.increment,
      self = this;
    
    if ( this.edit ) {
      
      mouse.handleDrag();
      
    } else {
      
      i = 0;
      
      mouse.handleClick();
      
    }
    
    
    canvas.width = 640 + 2 * i;
    canvas.height = 390 + 2 * i;
    
    extend( ctx, CanvasUtilities );
    
    
    ctx.save();
    ctx.translate( i, i );
    
    
    this.ctx = ctx;
    this.canvas = canvas;
    this.mouse = mouse;
    
    ctx.debug = false;
    
    function run() {
      
      if ( self.terminate ) {
        
        // console.log( 'terminated player ' + this.ID );
        return;
        
      }
      
      self.run();
      
      requestAnimationFrame( run );
    
    };
    
    run();
    
  },
  
  parse : function( data, callback ) {
    
    var self = this;
    
    this.fsm.parse();
    
    this.game = new Game( this, this.mouse );
    
    Parser.parseData( data, this.game, function() {
      
      if ( self.edit ) {
        
        self.fsm.edit();
        
      } else {
        
        self.fsm.loaded();
        
      }
      
      if ( callback ) {
        
        callback();
        
      }
      
    });
    
  },
  
  run : function() {
    
    var dt, t = Date.now();
    
    dt = t - this.time;
    dt = dt > 30 ? 30 : dt;
    
    this.time = t;
    this.timePlayed += dt;
    
    this.fsm.update( dt );
    this.fsm.draw( this.ctx );
    
    this.mouse.clicked = false;
    
    Player.updates[this.ID] = this.time;
    
  },
  
  update : function( dt ) {
    
    this.game.update( dt );
    
    if ( this.timePlayed > this.playTime ) {
    
      this.fsm.lose();
      this.fsm.stop();
    
    }
    
  },
  
  draw : function( ctx ) {
    
    this.game.draw( ctx );
    
    if ( this.timePlayed ) {
      
      this.ctx.fillStyle = 'rgba(255,255,0,0.5)';
      this.ctx.fillRect( 0, 386, 640 * this.timePlayed / this.playTime, 4 );
      
    }
    
  },
  
  drawEdit : function( ctx ) {
    
    var i = this.increment;
    
    if ( this.mouse.dragging || this.redraw ) {
    
      ctx.clearRect( -i, -i, 640 + 2 * i, 390 + 2 * i );
    
      ctx.lineWidth = 2;
    
      this.game.draw( ctx );
    
      if ( this.selectArea ) {
      
        ctx.strokeStyle = '#000';
        this.selectArea.draw( ctx );
      
      }
    
      if ( this.selectObject ) {
      
        this.selectObject.draw( ctx );
        
        ctx.strokeStyle = '#000';
        this.selectObject.getArea().draw( ctx );
      
      }
      
      if ( this.showTimeline ) {
        
        ctx.fillStyle = 'rgba(125,125,125,0.5)';
        
        ctx.fillRect( - i / 2, 390 + i / 2, ( 640 + i ), 8 );
        ctx.fillRect( - i / 2 - 8, 390 + i / 2 - 4, 16, 16 );
        
        this.redraw = false;
        
      }
    
    }
    
  },
  
  drawTrial : function( ctx ) {
    
    var i = this.increment;
    
    ctx.clearRect( -i, -i, 640 + 2 * i, 390 + 2 * i );
    
    ctx.lineWidth = 2;
    
    this.game.draw( ctx );
    
    if ( this.showTimeline ) {
      
      ctx.fillStyle = 'rgba(255,0,0,0.5)';
      
      ctx.fillRect( - i / 2, 390 + i / 2, ( 640 + i ), 8 );
      ctx.fillRect( ( 640 + i ) * this.timePlayed / this.playTime - i / 2 - 8, 390 + i / 2 - 4, 16, 16 );
      
    }
    
  },
  
  reset : function() {
    
    this.time = 0;
    this.timePlayed = 0;
    
    this.mouse.clicked = false;
    
    if ( ( this.selectObject && !this.selectObject.stable ) || !this.selectObject ) {
    
      this.selectObject = null;
      this.selectArea = null;
    
    }
    
    this.game.reset();
    
    this.draw( this.ctx );
    this.redraw = true;
    
  },

  click : function() {
    
    if ( this.fsm.hasState( 'ready' ) ) {
      
      this.fsm.start();
      
    } else if ( this.fsm.hasState( 'end' ) ) {
      
      this.fsm.restart();
    
    }
    
  },

  mousedown : function( mouse ) {
    
    var object = this.selectObject,
      area = this.selectArea;
    
    if ( object && object.stable && !object.getArea().contains( mouse.pos ) ) {
      
      mouse.dragging = false;
      return;
      
    } 
    
    if ( this.objectsMoveable ) {
    
      object = this.game.getGameObjectAt( mouse.pos );
    
    }
    
    if ( !object && this.areaSelectable ) {
      
      if ( !area || !area.contains( mouse.pos ) ) {
        
        this.selectArea = new Area( mouse.pos.x, mouse.pos.y, 0, 0 );
        
      }
      
    }
    
    this.selectedObjectCallback( object ? object.ID : -1 );
    
    this.selectObject = object;
    
  },
  
  mousemove : function( mouse ) {
    
    var object = this.selectObject,
      area = this.selectArea;
    
    if ( object ) {
      
      object.movePosition( mouse.move );
      
    } else if ( area ) {
      
      if ( area.done ) {
        
        area.move( mouse.move );
        
      } else {
        
        area.resize( mouse.move );
        
      }
      
    }
    
  },
  
  mouseup : function() {
    
    var object = this.selectObject,
      area = this.selectArea;
    
    if ( area ) {
      
      area.adjust();
      area.done = true;
      
      this.selectedAreaCallback( area );
      
    }
    
    if ( object ) {
      
      this.selectedObjectDragCallback( object.ID, object.position );
    
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
    
    this.reset();
    
    if ( this.game.gameObjects.length ) {
      
      this.selectObject = this.game.gameObjects[this.game.gameObjects.length - 1];
      this.selectedObjectCallback( this.selectObject.ID );
      
    }
    
  },
  
  onWin : function() {
    
    this.ctx.fillStyle = 'rgba(0,255,0,0.5)';
    this.ctx.fillRect( 320 - 64, 195 - 39, 128, 78 );
    
  },
  
  onLose : function() {
    
    this.ctx.fillStyle = 'rgba(255,0,0,0.5)';
    this.ctx.fillRect( 320 - 64, 195 - 39, 128, 78 );
    
  },
  
  onTrial : function() {
    
    this.mouse.handleClick();
    this.reset();
    
  },
  
  onStop : function() {
    
    this.mouse.handleDrag();
    this.reset();
    
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
    
  },
  
  debug : function() {
    
    this.ctx.debug = !this.ctx.debug;
    this.redraw = true;
    
  }
  
};

Player.count = 0;
Player.updates = [];