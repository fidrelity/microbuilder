//= require ./action_trigger_model

var MoveActionModel = ActionTriggerModel.extend({
  
  gameObject : null,
  position : null,
  offset : null,
  
  random : false,
  direction : false,
  
  init : function() {
    
    this._super();
    
    this.set( 'position', this.position || new Vector );
    this.set( 'offset', this.offset || new Vector );
    
  },
  
  setOffset : function( vector ) {
    
    this.set( 'offset', vector.clone() );
    
  },
  
  directional : function() {
  
    this.set( 'type', 'moveIn' );
    
    App.actionController.addButtonOption(
      'How should ' + this.parentGameObject.name + ' move directional?', 
      ['in direction', 'random direction', 'to location', 'to object'],
      this,
      2
    );
  
  },
  
  'in direction' : function() {
    
    this.set( 'direction', true );
    
    App.actionController.addDirectionOption( 
      'Drag ' + this.parentGameObject.name + ' to set the direction',
      this,
      3 
    );
    
    this.set( 'addSpeed', 4 );
    
    this.done();
    
  },
  
  'random direction' : function() {
    
    this.set( 'random', true );
    
    this.set( 'addSpeed', 3 );
    
    this.done();
    
  },
  
  'move to' : function() {
    
    this.set( 'type', 'moveTo' );
    
    App.actionController.addButtonOption(
      'Where should ' + this.parentGameObject.name + ' move?', 
      ['to location', 'to object'],
      this,
      2
    );
    
  },
  
  'jump to' : function() {
  
    this.set( 'type', 'jumpTo' );
    
    App.actionController.addButtonOption(
      'Where should ' + this.parentGameObject.name + ' jump?', 
      ['to location', 'to object', 'to area'],
      this,
      2
    );
  
  },
  
  'to location' : function() {
    
    var type = this.type,
      question;
    
    if ( type === 'moveIn' ) {
    
      question = 'Drag ' + this.parentGameObject.name + ' to the location in which direction it should move';
    
    } else if ( type === 'moveTo' ) {
      
      question = 'Drag ' + this.parentGameObject.name + ' to the location where it should move';
      
    } else if ( type === 'jumpTo' ) {
      
      question = 'Drag ' + this.parentGameObject.name + ' to the location where it should jump';
      
    }
    
    App.actionController.addLocationOption( question, this, 3 );
    
    if ( type !== 'jumpTo' ) {
    
      this.set( 'addSpeed', 4 );
    
    }
    
    this.done();
    
  },
  
  'to object' : function() {
    
    var type = this.type,
      name = this.parentGameObject.name,
      depth = 3,
      question;
    
    if ( type === 'moveIn' ) {
    
      question = 'Choose the object in which direction ' + name + ' should move';
    
    } else if ( type === 'moveTo' ) {
      
      question = 'Choose to which other object ' + name + ' should move';
      
    } else if ( type === 'jumpTo' ) {
      
      question = 'Choose to which other object ' + name + ' should jump';
      
    }
    
    App.actionController.addObjectsOption( question, this, depth++ );
    
    if ( type !== 'moveIn' ) {
    
      this.set( 'addOffset', depth++ );
    
    }
    
    if ( type !== 'jumpTo' ) {
    
      this.set( 'addSpeed', depth++ );
    
    }
    
  },
  
  'to area' : function() {
    
    App.actionController.addAreaOption( 'Select the area where ' + this.parentGameObject.name + ' should randomly jump', this, 3 );
    
  },
  
  roam : function() {
    
    this.set( 'type', 'roam' );
    
    App.actionController.addButtonOption( 'Which type of roaming?',
     ['wiggle', 'reflect', 'insect', 'bounce'],
     this, 2 );
    
  },
  
  chooseMode : function( mode ) {
    
    this.set( 'mode', mode );
    
    App.actionController.addAreaOption( 'Select the area where ' + this.parentGameObject.name + ' should roam in', this, 3 );
    
    this.set( 'addSpeed', 4 );
    
  },
  
  wiggle : function() { this.chooseMode( 'wiggle' ); },
  reflect : function() { this.chooseMode( 'reflect' ); },
  insect : function() { this.chooseMode( 'insect' ); },
  bounce : function() { this.chooseMode( 'bounce' ); },
  
  swap : function() {
    
    this.set( 'type', 'swap' );
    
    App.actionController.addObjectsOption( 'Choose the object to swap position with ' + this.parentGameObject.name, this, 2 );
    
  },
  
  stop : function() {
    
    this.set( 'type', 'stop' );
    
    this.done();
    
  },
  
  angle : function() {
    
    return this.position.angle().toFixed( 2 );
    
  },
  
  clone : function() {
    
    return MoveActionModel.create({
      
      type : this.type,
      
      gameObject : this.gameObject,
      position : this.position.clone(),
      offset : this.offset.clone(),
      region : this.region ? this.region.clone() : null,
      
      random : this.random,
      direction : this.direction,
      
      speed : this.speed,
      addSpeed : this.addSpeed
      
    });
    
  },
  
  getData : function() {
    
    var obj = { 
      type : this.type, 
      speed : this.speed
    };
    
    if ( this.random ) {
      
      obj.random = 1;
    
    } else if ( this.direction ) {
      
      obj.angle = this.angle();
      
    } else if ( this.gameObject ) {
      
      obj.objectID = this.gameObject.ID;
      
    } else if ( this.mode ) {
      
      obj.mode = this.mode;
      obj.area = this.region.getData();
      
    } else if ( this.region ) {
      
      obj.area = this.region.getData();
      
    } else {
      
      obj.location = this.position.getData();
      
    }
    
    if ( this.offset.norm() ) {
      
      obj.offset = this.offset.getData();
      
    }
    
    return obj;
  
  },
  
  parse : function( data ) {
    
    var d = data;
    
    this.setProperties({ 
      type : d.type,
      position : d.location ? new Vector( d.location.x, d.location.y ) : new Vector( 1, 0 ).rotateSelf( d.angle ),
      offset : d.offset ? new Vector( d.offset.x, d.offset.y ) : new Vector(),
      gameObject : App.gameObjectsController.getObject( d.objectID ),
      region : d.area ? new Area().copy( d.area ) : null,
      mode : d.mode,
      speed : d.speed,
      random : d.random
    });
    
    return this;
    
  },
  
  string : function() {
    
    var type = this.type,
      name = this.parentGameObject.name,
      other = this.gameObject ? this.gameObject.name : 'location ' + this.position.string();
    
    if ( this.region ) {
      
      other = 'area ' + this.region.string();
      
    }
    
    if ( type === 'moveTo' ) {
      
      name += ' moves to ' + other;
      
    } else if ( type === 'jumpTo' ) {
      
      name += ' jumps to ' + other;
      
    } else if ( type === 'moveIn' ) {
      
      if ( this.random ) {
        
        name += ' moves in random direction';
        
      } else if ( this.direction ) {
      
        name += ' moves in direction ' + Math.floor( this.angle() * -1 / Math.PI * 180 ) + '˚';
      
      } else {
        
        name += ' moves in direction of ' + other;
        
      }
      
    } else if ( type === 'swap' ) {
      
      name += ' swaps position with ' + other;
      
    } else if ( type === 'roam' ) {
      
      name += ' roams in ' + this.mode + ' mode within ' + other;
      
    } else if ( type === 'stop' ) {
      
      name += ' stops moving';
      
    }
    
    name += this.offset.norm() ? ' - offset ' + this.offset.string() : '';
    name += this.addSpeed ? ' - ' + this.speeds[ this.speed ] : '';
    
    return name;
    
  }.property( 'type', 'position', 'gameObject', 'random', 'mode', 'region', 'speed', 'offset' )
  
});

var ArtActionModel = ActionTriggerModel.extend({
  
  type : 'art',
  
  'to frame' : function() {
    
    this.set( 'type', 'frame' );
    
    App.actionController.addFrameOption( 'Choose the frame ' + this.parentGameObject.name + ' should display', 'frame', this, 2 );
    
  },
  
  play : function() {
    
    this.set( 'type', 'play' );
    
    App.actionController.addFrameOption( 'Choose the start frame of the animation', 'frame', this, 2 );
    
  },
  
  stop : function() {
    
    this.done();
    
  },
  
  change : function() {
    
    App.actionController.addArtOption( 'Search in the library for your graphic', this, 2 );
    
  },
  
  selectGraphic : function( graphic ) {
    
    this.set( 'graphic', graphic );
    
    this.set( 'type', 'change' );
    
    this.done();
    
  },
  
  setFrame : function( frame ) {
    
    this.set( frame.type, frame.number );
    
    if ( this.type === 'frame' ) {
    
      this.done();
      
    } else {
      
      if ( this.frame2 ) {
        
        App.actionController.addButtonOption( 'Choose animation mode', ['loop', 'ping-pong', 'once'], this, 4 );
        
      } else {
        
        App.actionController.addFrameOption( 'Choose the end frame of your animation', 'frame2', this, 3 );
        
      }
      
    }
    
  },
  
  chooseMode : function( mode ) {
    
    this.set( 'mode', mode );
    
    App.actionController.addSpeedOption( 'Set the speed of the animation', this, 5 );
    
    this.done();
    
  },
  
  loop : function() { this.chooseMode( 'loop' ); },
  'ping-pong' : function() { this.chooseMode( 'ping-pong' ); },
  once : function() { this.chooseMode( 'once' ); },
  
  clone : function() {
    
    return ArtActionModel.create({
      
      type : this.type,
      
      frame : this.frame,
      frame2 : this.frame2,
      
      mode : this.mode,
      speed : this.speed,
      
      graphic : this.graphic,
      
    });
    
  },
  
  string : function() {
    
    var name = this.parentGameObject.name;
    
    if ( this.frame2 ) {
      
      if ( this.mode === 'loop' ) {
        
        name += ' loops';
        
      } else if ( this.mode === 'ping-pong' ) {
        
        name += ' plays ping-pong';
        
      } else {
        
        name += ' animates once';
        
      }
      
      name += ' from frame ' + this.frame + ' to ' + this.frame2 + ' - ' + this.speeds[ this.speed ];
      
    } else if ( this.frame ) {
      
      name += ' displays frame ' + this.frame;
      
    } else if ( this.graphic ) {
      
      name += ' changes art to ' + this.graphic.name;
      
    } else {
      
      name += ' stops the animation';
      
    }
    
    return name;
    
  }.property( 'frame', 'frame2', 'mode', 'speed' ),
  
  getData : function( graphicIDs ) {
  
    var data = { type : 'art' };
    
    if ( this.frame ) {
      
      data.frame = this.frame;
      
    } else if ( this.graphic ) {
      
      graphicIDs.push( this.graphic.ID );
      
      data.graphicID = this.graphic.ID;
      
    }
    
    if ( this.frame2 ) {
      
      data.frame2 = this.frame2;
      data.mode = this.mode;
      data.speed = this.speed;
      
    }
    
    return data;
  
  },
  
  parse : function( data ) {
    
    var d = data;
    
    this.setProperties({ 
      type : 'art',
      frame : d.frame,
      frame2 : d.frame2,
      mode : d.mode,
      speed : d.speed,
      graphic : App.libraryController.getGraphic( d.graphicID )
    });
    
    return this;
    
  }
  
});

var WinLoseActionModel = ActionTriggerModel.extend({
  
  win : function() {
    
    this.set( 'type', 'win' );
    
    App.actionController.set( 'showSaveButton', true );
    
  },

  lose : function() {
    
    this.set( 'type', 'lose' );
    
    App.actionController.set( 'showSaveButton', true );
    
  },
  
  string : function() {
    
    return this.type + ' the game';
    
  }.property( 'type' ),
  
});
