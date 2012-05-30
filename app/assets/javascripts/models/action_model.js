var ActionTriggerModel = Ember.Object.extend({
  
  type : null,
  
  parentGameObjectBinding : 'App.gameObjectsController.current',
  
  string : function() {
    
    return this.type
    
  }.property( 'type' ),
  
  getData : function() {
  
    return { type: this.type };
  
  },
  
  notify : function( name ) {
    
    if ( this.get( name ) ) {
      
      this.get( name ).call( this );
      
    } else {
      
      console.log( 'unknown action command: ' + name );
      
    }
    
  },
  
  select : function( gameObject ) {
    
    this.set( 'gameObject', gameObject );
    
    this.done();
    
  },
  
  done : function() {
    
    App.actionController.set( 'showSaveButton', true );
    
  }
  
});

var MoveActionModel = ActionTriggerModel.extend({
  
  gameObject : null,
  position : null,
  
  random : false,
  direction : false,
  
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
    
    this.done();
    
  },
  
  'random direction' : function() {
    
    this.set( 'random', true );
    
    App.actionController.updateDepth( 3 );
    this.done();
    
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
    this.done();
    
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
  
  swap : function() {
    
    this.set( 'type', 'swap' );
    
    App.actionController.addObjectsOption( 'Choose the object to swap with <gameObject>', this, 2 );
    
  },
  
  stop : function() {
    
    this.set( 'type', 'stop' );
    
    this.done();
    
  },
  
  angle : function() {
    
    return this.position.sub( this.parentGameObject.position ).angle().toFixed( 2 );
    
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
      
      obj.location = this.position.getData();
      
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
      
    } else if ( type === 'swap' ) {
      
      name += ' swaps position with ' + other;
      
    } else if ( type === 'stop' ) {
      
      name += ' stops';
      
    }
    
    return name;
    
  }.property( 'type', 'position', 'gameObject', 'random' )
  
});

var ArtActionModel = ActionTriggerModel.extend({
  
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

var WinLoseActionModel = ActionTriggerModel.extend({
  
  win : function() {
    
    this.set( 'type', 'win' );
    
    App.actionController.set( 'showSaveButton', true );
    
  },

  lose : function() {
    
    this.set( 'type', 'lose' );
    
    App.actionController.set( 'showSaveButton', true );
    
  }
  
});

var ClickTriggerModel = ActionTriggerModel.extend({
  
  type : 'click',
  
  'self' : function() {
    
    this.done();
    
  },
  
  'object' : function() {
    
    App.actionController.addObjectsOption( 'Choose the object to trigger the click', this, 2 );
    
  },
  
  // 'area' : function() {
  //   
  //   App.actionController.addAreaOption( 'Select the area to trigger the click', this, 2 );
  //   
  // },
  
  string : function() {
    
    if ( this.atArea ) {
      
      return 'click in area ' + this.area.string();
      
    } else if ( this.gameObject ) {
    
      return 'click on ' + this.gameObject.name;
    
    } else {
      
      return 'click on ' + this.parentGameObject.name;
      
    }
    
  }.property( 'gameObject', 'area' ),
  
  getData : function() {
    
    var data = { type : 'click' };
    
    if ( this.area ) {
    
      data.area = this.area.getData();
    
    } else if ( this.gameObject ) {
    
      data.objectID = this.gameObject.ID;
    
    }
    
    return data;
    
  }
  
});

var StartTriggerModel = ActionTriggerModel.extend({
  
  type : 'start'
  
});
