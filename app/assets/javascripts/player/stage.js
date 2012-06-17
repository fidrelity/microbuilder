//= require ./../utilities/utilities

var Stage = function() {

  Player.call( this );
  
  this.selectObject = null;
  this.selectedObjectCallback = function() {};
  
  this.stageOffset = new Vector();

};

Stage.prototype = new Player();
Stage.prototype.constructor = Player;

extend( Stage.prototype, {
  
  increment : { x : 96, y : 60 },
  
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
    
      ctx.clearRect( -i.x, -i.y, 640 + 2 * i.x, 390 + 2 * i.y );
    
      ctx.save();
      ctx.translate( this.stageOffset.x, this.stageOffset.y );
    
      this.game.draw( ctx );
    
      if ( this.selectObject ) {
        
        this.selectObject.draw( ctx );
        
        ctx.strokeStyle = '#000';
        
        this.selectObject.getArea().draw( ctx );
      
      }
      
      ctx.restore();
      
      this.drawTimeline( ctx, 0, 'rgba(125,125,125,0.5)' );
      
      this.redraw = false;
    
    }
    
  },
  
  draw : function( ctx, color ) {
    
    var i = this.increment;
    
    ctx.clearRect( -i.x, -i.y, 640 + 2 * i.x, 390 + 2 * i.y );
    
    ctx.save();
    ctx.translate( this.stageOffset.x, this.stageOffset.y );
    
    this.game.draw( ctx );
    
    ctx.restore();
    
    this.drawTimeline( ctx, this.timePlayed, color || 'rgba(200,200,0,0.5)' );
    
  },
  
  drawTimeline : function( ctx, timePlayed, color ) {
    
    var i = this.increment;
    
    ctx.fillStyle = color;
    
    // ctx.fillRect( - i.x / 2, 390 + i.y / 2, 640 + i.x, 8 );
    // ctx.fillRect( ( 640 + i.x ) * timePlayed / this.game.duration - i.x / 2 - 8, 390 + i.y / 2 - 4, 16, 16 );
    
    ctx.fillRect( 0, 390 + i.y / 2, 640, 8 );
    ctx.fillRect( 640 * timePlayed / this.game.duration - 8, 390 + i.y / 2 - 4, 16, 16 );
    
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
    
    var object = this.selectObject,
      mousePos = mouse.pos.sub( this.stageOffset );
    
    if ( !object || !object.getArea().contains( mousePos ) ) {
      
      object = this.game.getGameObjectAt( mousePos );
      
    } 
    
    this.selectedObjectCallback( object ? object.ID : 0 );
    
    this.selectObject = object;
    
  },
  
  mousemove : function( mouse ) {
    
    var object = this.selectObject;
    
    if ( object ) {
      
      object.movement.movePosition( mouse.move );
      
    } else if ( this.ctx.debug ) {
      
      this.stageOffset.addSelf( mouse.move );
      
    }
    
  },
  
  mouseup : function() {
    
    var object = this.selectObject;
    
    if ( object ) {
    
      this.selectedObjectCallback( object.ID, object.getPosition() );
    
    }
    
  },
  
});