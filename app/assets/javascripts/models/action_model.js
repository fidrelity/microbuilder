var ActionModel = Ember.Object.extend({
  
  type : null,
  
  gameObjectBinding : 'App.gameObjectsController.current',
  
  string : function() {
    
    return this.type
    
  }.property(),
  
  getData : function() {
  
    return { type: this.type }
  
  },
  
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
  
  'to location' : function() {
    
    App.actionController.addPlayerOption(
      'Drag <gameObject> to the location where it should move.',
      this.type,
      this.position,
      3
    );
    
    App.actionController.set( 'showSaveButton', true );
    
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
      target: this.position.getData(),
      angle: this.angle()
    }
  
  },
  
  string : function() {
    
    var type = this.type,
      name = this.gameObject.name,
      pos = this.position.string();
    
    if ( type === 'moveTo' ) {
      
      return name + ' moves to ' + pos;
      
    } else if ( type === 'jumpTo' ) {
      
      return name + ' jumps to ' + pos;
      
    } else if ( type === 'moveIn' ) {
      
      return name + ' moves in direction ' + this.angle();
      
    }
    
  }.property( 'type', 'position' )
  
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
    
    return this.gameObject.name + ' changes art to ' + this.graphic.name;
    
  }.property( 'gameObject', 'graphic' )
  
});

var WinLoseActionModel = ActionModel.extend({
  
  win : function() {
    
    this.set( 'type', 'win' );
    
    App.actionController.set( 'showSaveButton', true );
    
  },

  lose : function() {
    
    this.set( 'type', 'lose' );
    
    App.actionController.set( 'showSaveButton', true );
    
  }
  
});
