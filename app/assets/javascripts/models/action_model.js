var ActionModel = Ember.Object.extend({
  
  type : null,
  
  parentGameObjectBinding : 'App.gameObjectsController.current',
  
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
      3
    );
    
    App.actionController.set( 'showSaveButton', true );
    
  },
  
  'to object' : function() {
    
    App.actionController.addObjectsOption(
      'Choose to which other object <gameObject> should move.',
      this,
      3
    );
    
  },
  
  select : function( gameObject ) {
    
    this.set( 'gameObject', gameObject );
    
    App.actionController.set( 'showSaveButton', true );
    
  },
  
  moveTo : function() {
  
    this.set( 'type', 'moveTo' );
    this.set( 'question', 'to what location should ' + this.parentGameObject.name + ' move?' );
  
  },
  
  moveIn : function() {
  
    this.set( 'type', 'moveIn' );
    this.set( 'question', 'in what direction, relative to it\'s position, should ' + this.parentGameObject.name + ' move?' );
  
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
      name = this.parentGameObject.name,
      other = this.get( 'position' ) ? this.position.string() : this.gameObject.name;
    
    if ( type === 'moveTo' ) {
      
      return name + ' moves to ' + other;
      
    } else if ( type === 'jumpTo' ) {
      
      return name + ' jumps to ' + other;
      
    } else if ( type === 'moveIn' ) {
      
      return name + ' moves in direction ' + this.angle();
      
    }
    
  }.property( 'type', 'position', 'gameObject' )
  
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
