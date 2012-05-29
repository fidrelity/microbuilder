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
    
  }.property(),
  
  notify : function( name ) {
    
    if ( this.get( name ) ) {
      
      this.get( name ).call( this );
      
    } else {
      
      console.log( 'unknown action command: ' + name );
      
    }
    
  }
  
});

var MoveActionModel = ActionModel.extend({
  
  type : 'move',
  
  gameObject : null,
  
  position : null,
  
  question : '',
  
  init : function() {
    
    this.set( 'position', new Vector() );
    
  },
  
  directional : function() {
  
    this.set( 'type', 'directional' );
    
    App.actionController.addButtonOption(
      'How should <gameObject> move directional?', 
      ['in direction', 'random direction', 'to location', 'to object'],
      this,
      2
    );
  
  },
  
  'move to' : function() {
    
    this.set( 'type', 'moveTo' );
    
    App.actionController.addButtonOption(
      'Where should <gameObject> move?', 
      ['to location', 'to object'],
      this,
      2
    );
    
  },
  
  'jump to' : function() {
  
    this.set( 'type', 'jumpTo' );
    
    App.actionController.addButtonOption(
      'Where should <gameObject> jump?', 
      ['to location', 'to object'],
      this,
      2
    );
  
  },
  
  moveTo : function() {
  
    this.set( 'type', 'moveTo' );
    this.set( 'question', 'to what location should ' + this.gameObject.name + ' move?' );
  
  },
  
  moveIn : function() {
  
    this.set( 'type', 'moveIn' );
    this.set( 'question', 'in what direction, relative to it\'s position, should ' + this.gameObject.name + ' move?' );
  
  },
  
  angle : function() {
    
    return this.position.angle().toFixed( 2 );
    
  },
  
  getData : function() {
  
    return {
      type: this.type,
      objectID: this.gameObject.ID,
      target: this.position.getData(),
      angle: this.angle()
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
      
      return name + ' moves in direction ' + this.angle();
      
    }
    
  }.property( 'type', 'gameObject', 'position' ),
  
  isComplete : function() {
    
    return ( this.get( 'type' ) !== 'move' && this.get( 'gameObject' ) && this.get( 'position' ) );
    
  }.property( 'type', 'gameObject', 'position' )
  
});

var ArtActionModel = ActionModel.extend({
  
  type : 'art',
  
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
