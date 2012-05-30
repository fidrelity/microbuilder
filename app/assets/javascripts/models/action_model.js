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
  
  gameObject : null,
  position : null,
  
  random : false,
  direction : true,
  
  init : function() {
    
    this.set( 'position', new Vector() );
    
  },
  
  directional : function() {
  
    this.set( 'type', 'moveIn' );
    
    App.actionController.addButtonOption(
      'How should <gameObject> move directional?', 
      ['in direction', 'random direction', 'to location', 'to object'],
      this,
      2
    );
  
  },
  
  'in direction' : function() {
    
    this.set( 'direction', true );
    
    App.actionController.addLocationOption( 
      'Drag <gameObject> to it\'s relative direction from where it is', 
      this.type, 
      3 
    );
    
    App.actionController.set( 'showSaveButton', true );
    
  },
  
  'random direction' : function() {
    
    this.set( 'random', true );
    
    App.actionController.updateDepth( 3 );
    App.actionController.set( 'showSaveButton', true );
    
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
    
    var type = this.type,
      question;
    
    if ( type === 'moveIn' ) {
    
      question = 'Drag <gameObject> to the location in which direction it should move.';
    
    } else if ( type === 'moveTo' ) {
      
      question = 'Drag <gameObject> to the location where it should move.';
      
    } else if ( type === 'jumpTo' ) {
      
      question = 'Drag <gameObject> to the location where it should jump.';
      
    }
    
    App.actionController.addLocationOption( question, type, 3 );
    App.actionController.set( 'showSaveButton', true );
    
  },
  
  'to object' : function() {
    
    var type = this.type,
      question;
    
    if ( type === 'moveIn' ) {
    
      question = 'Choose to which the direction of which other object <gameObject> should move.';
    
    } else if ( type === 'moveTo' ) {
      
      question = 'Choose to which other object <gameObject> should move.';
      
    } else if ( type === 'jumpTo' ) {
      
      question = 'Choose to which other object <gameObject> should jump.';
      
    }
    
    App.actionController.addObjectsOption( question, this, 3 );
    
  },
  
  select : function( gameObject ) {
    
    this.set( 'gameObject', gameObject );
    
    App.actionController.set( 'showSaveButton', true );
    
  },
  
  angle : function() {
    
    return this.position.angle().toFixed( 2 );
    
  },
  
  getData : function() {
    
    var obj = { type : this.type };
    
    if ( this.random ) {
      
      obj.random = 1;
    
    } else if ( this.direction ) {
      
      obj.angle = this.angle();
      
    } else if ( this.gameObject ) {
      
      obj.objectID = this.gameObject.ID;
      
    } else {
      
      obj.target = this.position.getData();
      
    }
    
    return obj;
  
  },
  
  string : function() {
    
    var type = this.type,
      name = this.parentGameObject.name,
      other = this.gameObject ? this.gameObject.name : this.position.string();
    
    if ( type === 'moveTo' ) {
      
      name += ' moves to ' + other;
      
    } else if ( type === 'jumpTo' ) {
      
      name += ' jumps to ' + other;
      
    } else if ( type === 'moveIn' ) {
      
      if ( this.random ) {
        
        name += ' move in random direction';
        
      } else if ( this.direction ) {
      
        name += ' moves in direction ' + this.angle();
      
      } else {
        
        name += ' moves in direction of ' + other;
        
      }
      
    }
    
    return name;
    
  }.property( 'type', 'position', 'gameObject', 'random' )
  
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
