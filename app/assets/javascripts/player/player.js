var Player = function() {
  
  this.init();
  
  this.playTime = 5;
  
};

Player.prototype = {
  
  init : function() {
    
    this.context = null;
    
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
        { name : 'show', from : 'load', to: 'ready' },
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
    
    var self = this;
    
    this.context = canvas.getContext( '2d' );
    this.context.canvas = canvas;
    
    $( canvas ).click( function( e ) {
        
        var offset = $(this).offset();
        
        e.stopPropagation();
        
        self.click( new Vector( e.pageX - offset.left, e.pageY - offset.top ) );
        
    });
    
  },
  
  update : function() {
    
    this.game.update();
    
    if ( this.game.timePlayed > this.playTime * 1000 ) {
      
      this.fsm.lose();
      
    }
    
  },
  
  draw : function() {
    
    if ( this.context ) {
    
      this.game.draw( this.context );
    
    }
    
  },
  
  parse : function( data ) {
    
    var self = this;
    
    this.fsm.parse();
    
    this.game = new Game( this.fsm );
    
    Parser.parseData( data, this.game, function() {
      
      self.fsm.show();
      
    } );
    
  },
  
  enterReady : function() {
    
    this.game.reset();
    
    this.draw();
    
    this.context.fillStyle = '#FFFFCC';
    this.context.fillRect( 200, 100, 240, 190 );
    
  },
  
  enterPlay : function() {
    
    var self = this;
    
    this.game.reset();
    
    function animate() {
      
      self.update();
      
      if ( self.fsm.hasState( 'play' ) ) {
      
        requestAnimationFrame( animate );
        
        self.draw();
      
      }
      
    }
    
    animate();
    
  },

  enterEdit : function() {
    
    var self = this,
      ctx = this.context,
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
      ctx = this.context,
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
    
    this.context.fillStyle = '#CCFFCC';
    this.context.fillRect( 200, 100, 240, 190 );
    
  },
  
  onLose : function() {
    
    this.context.fillStyle = '#FFCCCC';
    this.context.fillRect( 200, 100, 240, 190 );
    
  },
  
  click : function( mouse ) {
    
    if ( this.fsm.hasState( 'play' ) ) {
      
      this.game.mouse = mouse;
      
    } else if ( this.fsm.hasState( 'ready' ) ) {
      
      this.fsm.start();
      
    } else if ( this.fsm.hasState( 'end' ) ) {
      
      this.fsm.restart();
    
    } else if ( this.fsm.hasState( 'edit' ) ) {
      
      mouse.x -= 128;
      mouse.y -= 128;
      
    }
    
  }
  
};