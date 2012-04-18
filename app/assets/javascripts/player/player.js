var Player = function() {
  
  this.init();
  
  this.playTime = 5;
  
  this.debug = true;
  
};

Player.prototype = {
  
  init : function() {
    
    this.ctx = null;
    
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
        { name : 'end'},
        { name : 'edit', enter : this.enterEdit, exit : this.exitEdit }
      ],
      
      transitions : [
        { name : 'parse', from : '*', to: 'load' },
        { name : 'run', from : 'load', to: 'ready' },
        { name : 'start', from : 'ready', to: 'play' },
        { name : 'win', from : 'play', to: 'end', callback : this.onWin },
        { name : 'lose', from : 'play', to: 'end', callback : this.onLose },
        { name : 'restart', from : 'end', to: 'ready' },
        { name : 'edit', from : '*', to: 'edit' },
        { name : 'done', from : 'edit', to: 'ready' }
      ]
      
    });
    
  },
  
  setCanvas : function( canvas ) {
    
    var self = this,
      ctx = canvas.getContext( '2d' );
    
    ctx.canvas = canvas;
    ctx.debug = this.debug;
    
    this.ctx = ctx;
    
    this.mouse = new Mouse( canvas );
    this.mouse.handleClick();
    
  },

  parse : function( data ) {
    
    var self = this;
    
    this.fsm.parse();
    
    this.game = new Game( this, this.mouse );
    
    Parser.parseData( data, this.game, function() {
      
      self.fsm.run();
      self.run();
      
    } );
    
  },
  
  run : function() {
    
    var self = this,
      stateName = this.fsm.currentState.name;
    
    if ( stateName === 'init' || stateName === 'load' ) {
    
      return;
    
    }
    
    if ( this.mouse.clicked ) {
      
      this.click();
      
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
    
    this.game.draw( this.ctx );
    
  },

  click : function( mouse ) {
    
    if ( this.fsm.hasState( 'ready' ) ) {
      
      this.fsm.start();
      
    } else if ( this.fsm.hasState( 'end' ) ) {
      
      this.fsm.restart();
    
    }
    
  },
  
  enterReady : function() {
    
    this.game.reset();
    this.draw();
    
    this.ctx.fillStyle = '#FFFFCC';
    this.ctx.fillRect( 200, 100, 240, 190 );
    
  },
  
  enterPlay : function() {
    
    this.game.reset();
    this.draw();
    
  },

  enterEdit : function() {
    
    var self = this,
      ctx = this.ctx,
      canvas = ctx.canvas;
    
    if ( canvas.width === 640 ) {
    
      canvas.width = 256 + 640;
      canvas.height = 256 + 390;
    
      ctx.save();
      ctx.translate( 128, 128 );
    
      this.game.reset();
      this.draw();
    
    }
    
  },

  exitEdit : function() {
    
    var self = this,
      ctx = this.ctx,
      canvas = ctx.canvas;
    
    if ( canvas.width !== 640 ) {
    
      canvas.width = 640;
      canvas.height = 390;
    
      ctx.restore();
    
      this.game.reset();
      this.draw();
    
    }
    
  },
  
  onWin : function() {
    
    this.ctx.fillStyle = '#CCFFCC';
    this.ctx.fillRect( 200, 100, 240, 190 );
    
  },
  
  onLose : function() {
    
    this.ctx.fillStyle = '#FFCCCC';
    this.ctx.fillRect( 200, 100, 240, 190 );
    
  }
  
};