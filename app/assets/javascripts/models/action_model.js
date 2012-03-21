//= require utilities/vector

var ActionModel = Ember.Object.extend({
  
  type : null,
  
  string : function() {
    
    return this.type
    
  }.property(),
  
  getData : function() {
  
    return { type: this.type }
  
  }
  
});

var MoveActionModel = ActionModel.extend({
  
  type : 'move',
  
  isMove : true,
  
  gameObject : null,
  
  position : new Vector(),
  
  
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
      target: this.position.getData()
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
      
      return name + ' moves in direction *';
      
    }
    
  }.property( 'type', 'gameObject', 'position' )
  
});

var ArtActionModel = ActionModel.extend({
  
  type : 'art',
  
  isArt : true,
  
  gameObject : null
  
});

var WinActionModel = ActionModel.extend({
  
  type : 'win',
  
  isWin : true
  
});

var LoseActionModel = ActionModel.extend({
  
  type : 'lose',
  
  isLose : true
  
});
