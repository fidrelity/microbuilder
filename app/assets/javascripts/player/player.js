var Player = function() {
  
  this.init();
  
};

Player.prototype = {
  
  init : function() {
    
    this.context = null;
    
    this.loader = new Loader();
    this.game = new Game();
    
    this.fsm = new StateMachine( this );
    
    this.fsm.init({
      
      initial : 'init',
      
      states : [
        { name : 'init' },
        { name : 'load' },
        { name : 'ready', enter : this.enterShow },
        { name : 'play', enter : this.enterPlay },
        { name : 'end'}
      ],
      
      transitions : [
        { name : 'parse', from : '*', to: 'load' },
        { name : 'show', from : 'load', to: 'ready' },
        { name : 'start', from : 'ready', to: 'play' },
        { name : 'win', from : 'play', to: 'end', callback : this.onWin },
        { name : 'lose', from : 'play', to: 'end', callback : this.onLose },
        { name : 'restart', from : 'end', to: 'start' },
      ]
      
    });
    
  },
  
  setCanvas : function( canvas ) {
    
    this.context = canvas.getContext( '2d' );
    
    this.context.fillStyle = '#FFFFFF';
    this.context.fillRect( 0, 0, canvas.width, canvas.height );
    
  },
  
  update : function() {
    
    this.game.update( 25 );
    
  },
  
  draw : function() {
    
    if ( this.context ) {
    
      this.game.draw( this.context );
    
    }
    
  },
  
  parse : function( data ) {
    
    var self = this;
    
    this.fsm.parse();
    
    this.game = new Game();
    
    Parser.parseData( data, this.game, function() {
      
      self.fsm.show();
      
    } );
    
  },
  
  enterShow : function() {
    
    // this.context.drawImage( this.game.background, 0, 0 );
    
    this.context.fillStyle = '#FFFFFF';
    this.context.fillRect( 0, 0, 640, 390 );
    
    // this.game.reset();
    // 
    // this.draw();
    
    this.fsm.start();
    
  },
  
  enterPlay : function() {
    
    var self = this;
    
    this.game.reset();
    
    function animate() {
      
      if ( self.fsm.hasState( 'play' ) ) {
      
        requestAnimationFrame( animate );
      
        self.update();
        self.draw();
      
      }
      
    }
    
    animate();
    
  },
  
  start : function() {
    
    if ( this.fsm.hasState( 'play' ) ) {
      
      this.fsm.changeState( 'ready' );
      
    } else {
      
      this.fsm.start();
      
    }
    
  }
  
};