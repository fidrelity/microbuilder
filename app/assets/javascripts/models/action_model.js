//= require utilities/vector

var ActionModel = Ember.Object.extend({
  
  type : null,
  
  string : function() {
    
    return this.type
    
  }.property(),
  
  getData : function() {
  
    return { type: this.type }
  
  },
  
  isComplete : function() {
    
    return true;
    
  }.property()
  
});

var MoveActionModel = ActionModel.extend({
  
  type : 'move',
  
  isMove : true,
  
  gameObject : null,
  
  position : null,
  
  init : function() {
    
    this.set( 'position', new Vector() );
    
  },
  
  
  angle : function() {
    
    return this.get( 'position' ).angle().toFixed( 2 );
    
  }.property( 'position' ),
  
  
  isMoveTo : function() {
    
    return this.get( 'type' ) === 'moveTo';
    
  }.property( 'type' ),
  
  isMoveIn : function() {
    
    return this.get( 'type' ) === 'moveIn';
    
  }.property( 'type' ),
  
  isJumpTo : function() {
    
    return this.get( 'type' ) === 'jumpTo';
    
  }.property( 'type' ),
  
  
  getData : function() {
  
    return {
      type: this.type,
      objectID: this.gameObject.ID,
      target: this.position.getData(),
      angle: this.get( 'angle' )
    }
  
  },
  
  string : function() {
    
    var type = this.get( 'type' ),
      name = this.get( 'gameObject' ).name,
      pos = this.get( 'position' ).string();
    
    if ( type === 'moveTo' ) {
      
      return name + ' moves to ' + pos;
      
    } else if ( type === 'jumpTo' ) {
      
      return name + ' jumps to ' + pos;
      
    } else if ( type === 'moveIn' ) {
      
      return name + ' moves in direction ' + this.get( 'angle' );
      
    }
    
  }.property( 'type', 'gameObject', 'position' ),
  
  isComplete : function() {
    
    return ( this.get( 'type' ) !== 'move' && this.get( 'gameObject' ) && this.get( 'position' ) );
    
  }.property( 'type', 'gameObject', 'position' )
  
});

var ArtActionModel = ActionModel.extend({
  
  type : 'art',
  
  isArt : true,
  
  gameObject : null,
  graphic : null,
  
  getData : function( graphics ) {
  
    if ( graphics.indexOf( this.graphic ) < 0 ) {
      
      graphics.push( this.graphic.getData() );
      
    }
  
    return {
      type: 'changeArt',
      objectID: this.gameObject.ID,
      graphicID: this.graphic.ID
    }
  
  },
  
  string : function() {
    
    return this.get( 'gameObject' ).name + ' changes art to ' + this.get( 'graphic' ).name;
    
  }.property( 'gameObject', 'graphic' ),
  
  isComplete : function() {
    
    return ( this.get( 'gameObject' ) && this.get( 'graphic' ) );
    
  }.property( 'gameObject', 'graphic' )
  
});

var WinActionModel = ActionModel.extend({
  
  type : 'win',
  
  isWin : true
  
});

var LoseActionModel = ActionModel.extend({
  
  type : 'lose',
  
  isLose : true
  
});
