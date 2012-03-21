//= require utilities/vector

var MoveActionModel = Ember.Object.extend({
  
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
  
  }
  
});

var ArtActionModel = Ember.Object.extend({
  
  type : 'art',
  
  isArt : true,
  
  gameObject : null
  
});

var WinActionModel = Ember.Object.extend({
  
  type : 'win',
  
  isWin : true,
  
  getData : function() {
  
    return {
      type: 'win'
    }
  
  }
  
});

var LoseActionModel = Ember.Object.extend({
  
  type : 'lose',
  
  isLose : true,
  
  getData : function() {
  
    return {
      type: 'lose'
    }
  
  }
  
});
