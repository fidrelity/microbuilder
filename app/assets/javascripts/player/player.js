//= require ./../utilities/state_machine

var Player = function() {
  
  this.ID = Player.count++;
  
  this.ctx = null;
  this.canvas = null;
  
  this.timelineCanvas = null;
  this.timelineCtx = null;
  
  this.node = null;
  
  this.game = null;
  this.mouse = null;
  this.game_id = null;
  
  this.fsm = new StateMachine( this );
  
  this.fsm.init({
  
    initial : 'init',
  
    states : [
      { name : 'init' },
      { name : 'load', enter : this.enterLoad, exit : this.exitLoad },
    
      { name : 'ready', enter : this.enterReady, draw : this.drawReady, exit : this.exitReady },
      { name : 'info', enter : this.enterInfo, exit : this.exitInfo },
      
      { name : 'play', enter : this.enterPlay, draw : this.draw, update : this.update, exit : this.exitPlay },
      { name : 'end' }
    ],
  
    transitions : [
      { name : 'parse', from : '*', to : 'load' },
      { name : 'loaded', from : 'load', to : 'ready', callback : this.onReady },
      { name : 'inform', from : 'ready', to : 'info' },
    
      { name : 'start', from : 'info', to : 'play', callback : this.reset },
      { name : 'end', from : 'play', to : 'end', callback : this.onEnd },
      
      { name : 'restart', from : 'end', to : 'ready', callback : this.onReady },
      { name : 'reset', from : '*', to : 'ready' }
    ]
  
  });
  
  this.time = 0;
  this.timePlayed = 0;
  
  this.terminate = false;
  
};

Player.prototype = {
  
  increment : { x : 0, y : 0 },
  scale : 1,
  
  init : function( _node ) {
    
    var canvas = $( '#playerCanvas', _node )[0],
      ctx = canvas.getContext( '2d' ),
      timeline = $( '.playerTimeline', _node )[0],
      i = this.increment,
      self = this;
    
    canvas.width = 640 + 2 * i.x;
    canvas.height = 390 + 2 * i.y;
    
    ctx.save();
    ctx.translate( i.x, i.y );
    
    ctx.font = '20px sans-serif';
    
    this.ctx = ctx;
    this.canvas = canvas;
    
    this.mouse = new Mouse( this, canvas );
    
    ctx.debug = false;
    
    $( '.playButton', _node ).click( function() {
      
      self.fsm.inform();
      
    });
    
    $( '.startScreen', _node ).click( function() {
      
      self.fsm.start();
      
    });
    
    this.node = _node;
    
    if ( timeline ) {
      
      timeline.width = $( '.playerTimeline', _node ).width();
      timeline.height = $( '.playerTimeline', _node ).height();
      
      this.timelineCanvas = timeline;
      this.timelineCtx = timeline.getContext( '2d' );
      
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
    dt = dt > 30 ? 30 : dt;
    
    this.time = t;
    this.timePlayed += dt;
    
    this.fsm.update( dt );
    this.fsm.draw( this.ctx );
    
    this.mouse.clicked = false;
    
    Player.updates[this.ID] = this.time;
    
  },
  
  reset : function() {
    
    this.time = 0;
    this.timePlayed = 0;
    
    this.mouse.clicked = false;
    
  },
  
  parse : function( data, callback, corsSave ) {
    
    var self = this;
    
    this.fsm.parse();
    
    this.game = new Game( this, this.mouse );
    
    Parser.parseData( data, this.game, function() {
      
      self.fsm.loaded();
      
      if ( callback ) {
        
        callback();
        
      }
        
    }, corsSave );
    
  },
  
  update : function( dt ) {
    
    this.game.update( dt );
    
    if ( this.timePlayed > this.game.duration ) {
    
      EndAction.execute( this.game );
    
    }
    
  },
  
  draw : function( ctx ) {
    
    var string;
    
    this.game.draw( ctx );
    
    // this.drawTimeline( ctx, this.timePlayed  );
    
    if ( this.timePlayed ) {
    
      ctx = this.timelineCtx;
    
      ctx.fillStyle = '#CD5654';
      ctx.fillRect( 0, 0, Math.floor( this.timePlayed / this.game.duration * this.timelineCanvas.width ), this.timelineCanvas.height );
    
      string = timeString( Math.ceil( ( this.game.duration - this.timePlayed ) / 1000 ) );
    
      if ( this.string !== string ) {
        
        $( '.playerTime', this.node ).html( string );
        
        this.string = string;
        
      }
    
    }
    
  },
  
  drawTimeline : function( ctx, timePlayed ) {
    
    var g = this.game;
    
    ctx.fillStyle = g.isWon ? 'rgba(0,255,0,0.5)' : ( g.isLost ? 'rgba(255,0,0,0.5)' : 'rgba(255,255,0,0.5)' );
    
    ctx.fillRect( 0, 386, 640 * timePlayed / g.duration, 4 );
    
  },
  
  click : function() {},
  
  enterLoad : function() {
    
    $( '.titleScreen', this.node ).show();
    $( '.loader', this.node ).show();
    
  },
  
  exitLoad : function() {
    
    $( '.loader', this.node ).hide();
    
    $( '.playerTime', this.node ).html( timeString( this.game.duration / 1000 ) );
    
  },
  
  enterReady : function() {
    
    $( '.titleScreen', this.node ).show();
    $( '.playButton', this.node ).show();
    
  },
  
  exitReady : function() {
    
    $( '.titleScreen', this.node ).hide();
    $( '.endScreen', this.node ).hide();
    
  },
  
  onReady : function() {
    
    this.reset();
    
    this.game.reset();
    this.game.start();
    
    this.draw( this.ctx );
    
  },
  
  enterInfo : function() {
    
    $( '.startScreen', this.node ).show();
    
    this.timelineCanvas.width = this.timelineCanvas.width;
    $( '.playerTime', this.node ).html( timeString( this.game.duration / 1000 ) );
    
  },
  
  exitInfo : function() {
    
    $( '.startScreen', this.node ).hide();
    
  },
  
  enterPlay : function() {
    
    this.mouse.handleClick();
    
  },
  
  exitPlay : function() {
    
    this.mouse.unbind();
    
  },
  
  onEnd : function() {
    
    var self = this;
    
    if ( this.game.isWon ) {
      
      $( '.winScreen', this.node ).show();
      
      this.increaseCounter( "win" );
      
      this.onWin();
      
    } else {
      
      $( '.loseScreen', this.node ).show();
      
      this.increaseCounter( "lose" );
      
      this.onLose();
      
    }
    
    this.draw( this.ctx );
    
    setTimeout( function() {
      
      self.fsm.restart();
      
    }, 1000 );
    
  },
  
  debug : function() {
    
    this.ctx.debug = !this.ctx.debug;
    this.redraw = true;
    
  },

  // Increases game counter
  increaseCounter : function(_state) {
    if(!this.game_id) return false;
    var state = _state === "win" ? true : false;

    $.ajax({
      url : '/games/'+this.game_id+'/played',
      data : { win : state },
      type : 'PUT',
      success : function() {}
    });
  },
  
  onWin : function() {},
  onLose : function() {}
  
};

Player.count = 0;
Player.updates = [];