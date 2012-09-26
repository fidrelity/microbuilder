//= require ./../utilities/utilities
//= require ./player

var Stage = function() {

  Player.call( this );
  
  this.selectObject = null;
  this.selectedObjectCallback = function() {};
  
  this.fsm = new StateMachine( this );
  
  this.fsm.init({
  
    initial : 'init',
  
    states : [
      { name : 'init' },
      { name : 'load' },
    
      { name : 'ready', enter : this.enterReady, draw : this.drawReady },
      { name : 'play', enter : this.enterPlay, draw : this.draw, update : this.update },
      { name : 'end', draw : this.draw, update : this.update },
      
      { name : 'fin' }
    ],
  
    transitions : [
      { name : 'parse', from : '*', to : 'load' },
      { name : 'loaded', from : 'load', to : 'ready' },
    
      { name : 'start', from : '*', to : 'play', callback : this.reset },
      { name : 'end', from : 'play', to : 'end', callback : this.onEnd },
    
      { name : 'finish', from : 'end', to : 'fin' },
    
      { name : 'reset', from : '*', to : 'ready' }
    ]
  
  });

};

Stage.prototype = new Player();
Stage.prototype.constructor = Player;

extend( Stage.prototype, {
  
  increment : { x : 149, y : 60 },
  loadAnimated : false,
  
  init : function( _node ) {
    
    Player.prototype.init.call( this, _node );
    
    this.mouse.handleDrag();
    
    this.ctx.lineWidth = 2;
    
  },
  
  reset : function() {
    
    Player.prototype.reset.call( this );
    
    this.timelineCanvas.width = this.timelineCanvas.width;
    
    this.selectObject = null;
    this.redraw = true;
    
  },
  
  drawReady : function( ctx ) {
    
    var i = this.increment;
    
    if ( this.mouse.dragging || this.redraw ) {
    
      ctx.clearRect( -i.x, -i.y, 640 + 2 * i.x, 390 + 2 * i.y );
    
      this.game.draw( ctx );
    
      if ( this.selectObject ) {
        
        this.selectObject.draw( ctx );
        
        ctx.strokeStyle = '#000';
        
        this.selectObject.getGraphicArea().draw( ctx );
      
      }
      
      this.drawTimeline( ctx, 0 );
      
      this.redraw = false;
    
    }
    
  },
  
  draw : function( ctx ) {
    
    var i = this.increment;
    
    ctx.clearRect( -i.x, -i.y, 640 + 2 * i.x, 390 + 2 * i.y );
    
    this.game.draw( ctx );
    
    this.drawTimeline( this.timelineCtx );
    
  },
  
  enterReady : function() {
    
    this.reset();
    
    this.game.reset();
    
    this.mouse.handleDrag();
    
    this.redraw = true;
    
  },
  
  enterPlay : function() {
    
    this.mouse.handleClick();
    
    this.reset();
    
    this.game.reset();
    this.game.start();
    
  },
  
  onEnd : function() {
    
    var self = this;
    
    this.draw( this.ctx );
    
    setTimeout( function() {
      
      self.fsm.finish();
      
    }, this.endDelay );
    
  },
  
  click : function() {
    
    if ( this.fsm.hasState( 'end' ) || this.fsm.hasState( 'fin' ) ) {
      
      this.fsm.reset();
      
    }
    
  },
  
  mousedown : function( mouse ) {
    
    var object = this.selectObject;
    
    if ( !object || !object.getGraphicArea().contains( mouse.pos ) ) {
      
      object = this.game.getGameObjectAt( mouse.pos );
      
    } 
    
    this.selectedObjectCallback( object ? object.ID : 0 );
    
    this.selectObject = object;
    
  },
  
  mousemove : function( mouse ) {
    
    var object = this.selectObject;
    
    if ( object ) {
      
      object.movement.movePosition( mouse.move );
      
    }
    
  },
  
  mouseup : function() {
    
    var object = this.selectObject;
    
    if ( object ) {
    
      this.selectedObjectCallback( object.ID, object.getPosition() );
    
    }
    
  },
  
});