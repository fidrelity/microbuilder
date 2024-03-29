//= require ./../utilities/state_machine

var Player = function() {
  
  this.ID = Player.count++;
  
  this.ctx = null;
  this.canvas = null;
  
  this.timelineCanvas = null;
  this.timelineCtx = null;
  
  this.node = null;
  
  this.game = null;
  this.loader = null;
  
  this.mouse = null;
  
  this.fsm = new StateMachine( this );
  
  this.fsm.init({
  
    initial : 'init',
  
    states : [
      { name : 'init' },
      { name : 'load', enter : this.enterLoad, draw : this.drawLoad, exit : this.exitLoad },
      
      { name : 'ready', enter : this.enterReady },
      
      { name : 'play', enter : this.enterPlay, draw : this.draw, update : this.update, exit : this.exitPlay },
      { name : 'end', draw : this.draw, update : this.update },
      
      { name : 'error', enter : this.enterError }
    ],
  
    transitions : [
      { name : 'parse', from : '*', to : 'load' },
      { name : 'loaded', from : 'load', to : 'ready', callback : this.onReady },
      
      { name : 'start', from : 'ready', to : 'play', callback : this.onStart },
      { name : 'end', from : 'play', to : 'end', callback : this.onEnd },
      
      { name : 'restart', from : 'end', to : 'ready' },
      { name : 'error', from : '*', to : 'error' }
    ]
  
  });
  
  this.time = 0;
  this.timePlayed = 0;
  this.restTime = 0;
  
  this.hasLoaded = false;
  this.terminate = false;
  this.isRunning = false;
  
};

Player.prototype = {
  
  increment : { x : 0, y : 0 },
  scale : 1,
  loadAnimated : true,
  endDelay : 1000,
  
  init : function( _node ) {
    
    var canvas = $( '#playerCanvas', _node )[0],
      ctx = canvas.getContext( '2d' ),
      timeline = $( '.playerTimeline', _node )[0],
      i = this.increment,
      self = this;
    
    _node.disableSelection();
    
    canvas.width = 640 + 2 * i.x;
    canvas.height = 390 + 2 * i.y;
    
    ctx.save();
    ctx.translate( i.x, i.y );
    
    ctx.font = '20px sans-serif';
    
    this.ctx = ctx;
    this.canvas = canvas;
    
    ctx.player = this;
    
    this.mouse = new Mouse( this, canvas );
    
    ctx.debug = false;
    
    $( '.playButton', _node ).click( function( _e ) {
      
      self.fsm.start();
      _e.stopPropagation();
      
    });
    
    $( '.playerUI', _node ).click( function() {
      
      self.fsm.restart();
      
    });
    
    $('#player').addTouch();
    
    this.node = _node;
    
    if ( timeline ) {
      
      timeline.width = $( '.playerTimeline', _node ).width();
      timeline.height = $( '.playerTimeline', _node ).height();
      
      this.timelineCanvas = timeline;
      this.timelineCtx = timeline.getContext( '2d' );
      
    }

    $(document).bind('keypress', $.proxy(this.onKeyEvent, this));
    
  },

  onKeyEvent : function (e) {

    var mouseInstructionLayer = $('#mouseInstruction');

    // Show info message, when user tries to use keyboard
    if (this.isRunning && !mouseInstructionLayer.is(':visible') ) {
      mouseInstructionLayer.show().delay(1000).fadeOut(2500);
    }

  },
  
  startRunloop : function() {
    
    var self = this;
    
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
  
  run : function() {
    
    var dt, t = Date.now();
    
    dt = t - this.time;
    dt = dt > 100 ? 100 : dt;
    
    this.time = t;
    
    this.fsm.update( dt );
    this.fsm.draw( this.ctx );
    
    this.mouse.clicked = false;
    
    Player.updates[this.ID] = this.time;
    
  },
  
  reset : function() {
    
    this.timePlayed = 0;
    this.restTime = 0;

    this.mouse.clicked = false;
    
  },
  
  parse : function( data, callback, corsSave ) {
    
    var self = this;
    
    this.hasLoaded = false;
    
    this.fsm.parse();
    
    this.game = new Game( this, this.mouse );
    
    this.loader = new Loader( function() {
      
      self.hasLoaded = true;
      
      self.fsm.loaded();
      
      if ( callback ) {
        
        callback();
        
      }
        
    }, this.loadAnimated, corsSave );
    
    try {
    
      Parser.parseData( data, this.game, this.loader );
    
    } catch ( e ) {
      
      console.log( e, e.message, e.stack );
      this.fsm.error();
      
    }
    
  },
  
  update : function( dt ) {
    
    if ( this.fsm.hasState( 'play' ) ) {
      
      this.timePlayed += dt;
      
    }
    
    this.game.update( dt );
    
    if ( this.fsm.hasState( 'play' ) && this.timePlayed > this.game.duration ) {
    
      LoseAction.execute( this.game );
    
    }
    
  },
  
  draw : function( ctx ) {
    
    var rest;
    
    this.game.draw( ctx );
    
    if ( this.timePlayed ) {
    
      this.drawTimeline( this.timelineCtx );
    
      rest = Math.ceil( ( this.game.duration - this.timePlayed ) / 1000 );
    
      if ( this.restTime !== rest ) {
        
        this.showTime( rest );
        
        this.restTime = rest;
        
      }
    
    }
    
  },
  
  drawTimeline : function( ctx ) {
    
    ctx.fillStyle = this.game.isWon ? '#70B477' : this.game.isLost ? '#CD5654' : '#999';
    ctx.fillRect( 0, 0, Math.floor( this.timePlayed / this.game.duration * this.timelineCanvas.width ), this.timelineCanvas.height );
    
  },
  
  drawLoad : function( ctx ) {
    
    this.loader.draw( ctx );
    
  },
  
  click : function() {},
  
  enterLoad : function() {
    
    var node = this.node;
    
    $( '.playerUI', node ).show();
    $( '.loadScreen', node ).show();
    
    $( '.titleScreen', node ).hide();
    
    $( '.playButton', node ).removeClass( 'active' );
    $( '.titleBar', node ).removeClass( 'active' );
    $( '.instructionBar', node ).removeClass( 'active' );
    
  },
  
  exitLoad : function() {
    
    $( '.loadScreen', this.node ).hide();
    
    this.showTime( this.game.duration / 1000 );
    
  },
  
  enterReady : function() {
    
    var node = this.node;
    
    $( '.titleScreen', node ).show();
    $( '.endScreen', node ).fadeOut( 300 );
    
    $( '.playButton', node ).addClass( 'active' );
    $( '.titleBar', node ).addClass( 'active' );
    $( '.instructionBar', node ).addClass( 'active' );
    
  },
  
  onReady : function() {
    
    this.reset();
    this.game.reset();
    
    this.draw( this.ctx );
    
  },
  
  onStart : function() {
    
    var node = this.node;
    
    $( '.playButton', node ).removeClass( 'active' );
    $( '.titleBar', node ).removeClass( 'active' );
    $( '.instructionBar', node ).removeClass( 'active' );
    
    $( '.playerUI', node ).delay( 500 ).fadeOut( 0 );
    $( '.titleScreen', node ).delay( 500 ).fadeOut( 0 );
    
    this.reset();
    
    this.game.reset();
    this.game.start();

    this.isRunning = true;
    
  },
  
  enterPlay : function() {
    
    this.timelineCanvas.width = this.timelineCanvas.width;
    this.showTime( this.game.duration / 1000 );
    
    this.mouse.handleClick();
    
  },
  
  exitPlay : function() {
    
    this.mouse.unbind();
    
  },
  
  onEnd : function() {
    
    var self = this,
      msg;
    
    $( '.playerUI', this.node ).show();
    
    if ( this.game.isWon ) {
      
      msg = '.winScreen';
      
      this.onWin();
      
    } else {
      
      msg = '.loseScreen';
      
      this.onLose();
      
    }

    this.isRunning = false;
    
    $( '.endText', this.node ).hide();
    $( msg, this.node ).show();
    $( '.endScreen', this.node ).fadeIn( 200 );
    
    this.draw( this.ctx );
    
    setTimeout( function() {
    
      if ( self.onRestart( self.game.isWon ) ) {
        
        self.fsm.restart();
        
      }
    
    }, 1500 );
    
  },
  
  enterError : function() {
    
    $( '.titleScreen', this.node ).hide();
    $( '.startScreen', this.node ).hide();
    $( '.endScreen', this.node ).hide();
    
    $( '.errorScreen', this.node ).show();
    
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect( 0, 0, 640, 390 );
    this.showTime( 0 );
    
  },
  
  showTime : function( _seconds ) {
    
    $( '.playerTime', this.node ).html( timeString( _seconds ) );
    
  },
  
  debug : function() {
    
    this.ctx.debug = !this.ctx.debug;
    this.redraw = true;
    
  },
  
  onWin : function() { },
  onLose : function() { },
  
  onRestart : function() { return true; }
  
};

Player.count = 0;
Player.updates = [];