var Player = function() {
  
  this.init();
  
  this.playTime = 5;
  
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
        { name : 'ready', enter : this.enterReady },
        { name : 'play', enter : this.enterPlay },
        { name : 'end'}
      ],
      
      transitions : [
        { name : 'parse', from : '*', to: 'load' },
        { name : 'show', from : 'load', to: 'ready' },
        { name : 'start', from : 'ready', to: 'play' },
        { name : 'win', from : 'play', to: 'end', callback : this.onWin },
        { name : 'lose', from : 'play', to: 'end', callback : this.onLose },
        { name : 'restart', from : 'end', to: 'ready' },
      ]
      
    });
    
  },
  
  setCanvas : function( canvas ) {
    
    var self = this;
    
    this.context = canvas.getContext( '2d' );
    
    canvas.addEventListener( 'click', function( e ) {
      
      var mouse = new Vector();
      
      if ( e.pageX || e.pageY ) {
        
        mouse.set( e.pageX, e.pageY );
        
      } else {
        
        mouse.set( 
          e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft,
          e.clientY + document.body.scrollTop + document.documentElement.scrollTop
        );
      
      }
      
      mouse.x -= canvas.offsetLeft;
      mouse.y -= canvas.offsetTop;
      
      self.click( mouse );
      
    }, false );
    
  },
  
  update : function() {
    
    this.game.update();
    
    if ( this.game.timePlayed > this.playTime * 1000 ) {
      
      this.fsm.lose();
      this.fsm.restart();
      
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
    
    this.game = new Game();
    
    Parser.parseData( data, this.game, function() {
      
      self.fsm.show();
      
    } );
    
  },
  
  enterReady : function() {
    
    this.game.reset();
    
    this.draw();
    
    // this.fsm.start();
    
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
  
  click : function( mouse ) {
    
    if ( this.fsm.hasState( 'play' ) ) {
      
      this.game.mouse = mouse;
      
    } else if ( this.fsm.hasState( 'ready' ) ) {
      
      this.fsm.start();
      
    }
    
  }
  
};