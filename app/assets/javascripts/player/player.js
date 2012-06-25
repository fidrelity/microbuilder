//= require ./../utilities/state_machine

var Player = function() {
  
  this.ID = Player.count++;
  
  this.ctx = null;
  this.canvas = null;
  
  this.game = null;
  this.mouse = null;
  this.game_id = null;
  
  this.fsm = new StateMachine( this );
  
  this.fsm.init({
  
    initial : 'init',
  
    states : [
      { name : 'init' },
      { name : 'load' },
    
      { name : 'ready', enter : this.enterReady, draw : this.drawReady },
      { name : 'play', enter : this.enterPlay, draw : this.draw, update : this.update },
      { name : 'end' }
    ],
  
    transitions : [
      { name : 'parse', from : '*', to : 'load' },
      { name : 'loaded', from : 'load', to : 'ready', callback : this.onReady },
    
      { name : 'start', from : '*', to : 'play', callback : this.reset },
      { name : 'end', from : 'play', to : 'end', callback : this.onEnd },
      
      { name : 'restart', from : 'end', to : 'play', callback : this.onReady },
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
  
  init : function( canvas ) {
    
    var ctx = canvas.getContext( '2d' ),
      mouse = new Mouse( this, canvas ),
      i = this.increment,
      self = this;
    
    mouse.handleClick();
    
    canvas.width = 640 + 2 * i.x;
    canvas.height = 390 + 2 * i.y;
    
    ctx.save();
    ctx.translate( i.x, i.y );
    
    this.ctx = ctx;
    this.canvas = canvas;
    this.mouse = mouse;
    
    ctx.debug = false;
    
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
    
    this.game.draw( ctx );
    
    this.drawTimeline( ctx, this.timePlayed  );
    
  },
  
  drawTimeline : function( ctx, timePlayed ) {
    
    var g = this.game;
    
    ctx.fillStyle = g.isWon ? 'rgba(0,255,0,0.5)' : ( g.isLost ? 'rgba(255,0,0,0.5)' : 'rgba(255,255,0,0.5)' );
    
    ctx.fillRect( 0, 386, 640 * timePlayed / g.duration, 4 );
    
  },
  
  click : function() {
    
    if ( this.fsm.hasState( 'ready' ) ) {
      
      $('.playerStartScreen').hide();
      
      this.fsm.start();
      
    } else if ( this.fsm.hasState( 'end' ) ) {
      
      $('.playerLoseScreen').hide();
      $('.playerWinScreen').hide();
      
      this.fsm.restart();
      
    }
    
  },
  
  onReady : function() {
    
    this.reset();
    
    this.game.reset();
    this.game.start();
    
    this.draw( this.ctx );
    
  },
  
  onEnd : function() {
    
    if ( this.game.isWon ) {
      
      $('.playerWinScreen').fadeTo( 600, 0.9 );
      
      this.increaseCounter( "win" );
      
    } else {
      
      $('.playerLoseScreen').fadeTo( 600, 0.9 );
      
      this.increaseCounter( "lose" );
      
    }
    
    this.draw( this.ctx );
    
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
  }
  
};

Player.count = 0;
Player.updates = [];