//= require ./../utilities/utilities

var Stage = function() {

  Player.call( this );
  
  this.selectObject = null;
  this.selectedObjectCallback = function() {};

};

Stage.prototype = new Player();
Stage.prototype.constructor = Player;

extend( Stage.prototype, {
  
  increment : 96,
  
  init : function( canvas ) {
    
    Player.prototype.init.call( this, canvas );
    
    this.mouse.handleDrag();
    
    this.ctx.lineWidth = 2;
    
  },
  
  reset : function() {
    
    Player.prototype.reset.call( this );
    
    this.selectObject = null;
    this.redraw = true;
    
  },
  
  drawReady : function( ctx ) {
    
    var i = this.increment;
    
    if ( this.mouse.dragging || this.redraw ) {
    
      ctx.clearRect( -i, -i, 640 + 2 * i, 390 + 2 * i );
    
      this.game.draw( ctx );
    
      if ( this.selectObject ) {
        
        this.selectObject.draw( ctx );
        
        ctx.strokeStyle = '#000';
        
        this.selectObject.getArea().draw( ctx );
      
      }
      
      this.drawTimeline( ctx, 0, 'rgba(125,125,125,0.5)' );
      
      this.redraw = false;
    
    }
    
  },
  
  draw : function( ctx, color ) {
    
    var i = this.increment;
    
    ctx.clearRect( -i, -i, 640 + 2 * i, 390 + 2 * i );
    
    this.game.draw( ctx );
    
    this.drawTimeline( ctx, this.timePlayed, color || 'rgba(200,200,0,0.5)' );
    
  },
  
  drawTimeline : function( ctx, timePlayed, color ) {
    
    var i = this.increment;
    
    ctx.fillStyle = color;
    
    ctx.fillRect( - i / 2, 390 + i / 2, ( 640 + i ), 8 );
    ctx.fillRect( ( 640 + i ) * timePlayed / this.game.duration - i / 2 - 8, 390 + i / 2 - 4, 16, 16 );
    
  },
  
  onReady : function() {},
  
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
  
  onWin : function() {
    
    this.draw( this.ctx, 'rgba(0,255,0,0.5)' );
    
  },
  
  onLose : function() {
    
    this.draw( this.ctx, 'rgba(255,0,0,0.5)' );
    
  },
  
  click : function() {
    
    if ( this.fsm.hasState( 'end' ) ) {
      
      this.fsm.reset();
      
    }
    
  },
  
  mousedown : function( mouse ) {
    
    var object = this.selectObject;
    
    if ( !object || !object.getArea().contains( mouse.pos ) ) {
      
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