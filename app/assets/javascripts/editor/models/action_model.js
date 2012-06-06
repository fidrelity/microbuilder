var ActionTriggerModel = Ember.Object.extend({
  
  type : null,
  
  init : function() {
    
    this.set( 'parentGameObject', App.gameObjectsController.current );
    
  },
  
  clone : function() {
    
    return ActionTriggerModel.create({
      type : this.type,
    });
    
  },
  
  string : function() {
    
    return this.type
    
  }.property( 'type' ),
  
  getData : function() {
  
    return { type: this.type };
  
  },
  
  choose : function( name ) {
    
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
  
  locate : function( vector ) {
    
    this.set( 'position', vector.clone() );
    
  },
  
  contain : function( area ) {
    
    this.set( 'region', area.clone() );
    
    this.done();
    
  },
  
  speed : 2,
  
  speeds : ['very slow', 'slow', 'medium', 'fast', 'very fast'],
  
  setSpeed : function( speed ) {
    
    this.set( 'speed', speed );
    
  },
  
  speeed : function() {
    
    return this.speeds[ this.speed ];
    
  }.property( 'speed' ),
  
  done : function() {
    
    if ( this.addSpeed ) {
      
      App.actionController.addSpeedOption( 'Set the speed of the movement', this, this.addSpeed );
      
    }
    
    App.actionController.set( 'showSaveButton', true );
    
  }
  
});

var MoveActionModel = ActionTriggerModel.extend({
  
  gameObject : null,
  position : null,
  
  random : false,
  direction : false,
  
  init : function() {
    
    this._super();
    
    this.set( 'position', this.position || new Vector );
    
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
      question;
    
    if ( type === 'moveIn' ) {
    
      question = 'Choose the object in which direction ' + name + ' should move';
    
    } else if ( type === 'moveTo' ) {
      
      question = 'Choose to which other object ' + name + ' should move';
      
    } else if ( type === 'jumpTo' ) {
      
      question = 'Choose to which other object ' + name + ' should jump';
      
    }
    
    App.actionController.addObjectsOption( question, this, 3 );
    
    if ( type !== 'jumpTo' ) {
    
      this.set( 'addSpeed', 4 );
    
    }
    
  },
  
  'to area' : function() {
    
    App.actionController.addAreaOption( 'Select the area where ' + this.parentGameObject.name + ' should randomly jump', this, 3 );
    
  },
  
  roam : function() {
    
    this.set( 'type', 'roam' );
    
    App.actionController.addButtonOption( 'Which type of roaming?',
     // ['wiggle', 'reflect', 'insect', 'bounce'], 
     ['wiggle', 'reflect', 'insect'], 
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
    
    return obj;
  
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
    
    if ( this.addSpeed ) {
      
      name += ' - ' + this.speeds[ this.speed ];
      
    }
    
    return name;
    
  }.property( 'type', 'position', 'gameObject', 'random', 'mode', 'region', 'speed' )
  
});

var ArtActionModel = ActionTriggerModel.extend({
  
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
    
    App.actionController.addArtOption( 'Search in the libray for your graphic', this, 2 );
    
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
  
  getData : function( graphics ) {
  
    var data = { type : 'art' };
    
    if ( this.frame ) {
      
      data.frame = this.frame;
      
    } else if ( this.graphic ) {
      
      if ( graphics.indexOf( this.graphic ) < 0 ) {
      
        graphics.push( this.graphic.getData() );
      
      }
      
      data.graphicID = this.graphic.ID;
      
    }
    
    if ( this.frame2 ) {
      
      data.frame2 = this.frame2;
      data.mode = this.mode;
      data.speed = this.speed;
      
    }
    
    return data;
  
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

var ClickTriggerModel = ActionTriggerModel.extend({
  
  'self' : function() {
    
    this.done();
    
  },
  
  'object' : function() {
    
    App.actionController.addObjectsOption( 'Choose the object to trigger the click', this, 2 );
    
  },
  
  'area' : function() {
    
    App.actionController.addAreaOption( 'Select the area to trigger the click', this, 2 );
    
  },
  
  clone : function() {
    
    return ClickTriggerModel.create({
      gameObject : this.gameObject,
      region : this.region ? this.region.clone() : null,
    });
    
  },
  
  string : function() {
    
    if ( this.region ) {
      
      return 'click in area ' + this.region.string();
      
    } else if ( this.gameObject ) {
    
      return 'click on ' + this.gameObject.name;
    
    } else {
      
      return 'click on ' + this.parentGameObject.name;
      
    }
    
  }.property( 'gameObject', 'area' ),
  
  getData : function() {
    
    var data = { type : 'click' };
    
    if ( this.region ) {
    
      data.area = this.region.getData();
    
    } else if ( this.gameObject ) {
    
      data.objectID = this.gameObject.ID;
    
    }
    
    return data;
    
  }
  
});

var ContactTriggerModel = ActionTriggerModel.extend({
  
  'touch' : function() {
    
    this.set( 'type', 'touch' );
    
    App.actionController.addButtonOption( 'Touches what?', ['object', 'area'], this, 2 );
    
  },
  
  'overlap' : function() {
    
    this.set( 'type', 'overlap' );
    
    App.actionController.addButtonOption( 'Overlaps what?', ['object', 'area'], this, 2 );
    
  },
  
  'object' : function() {
    
    App.actionController.addObjectsOption( 'Choose the object to trigger the ' + this.type, this, 3 );
    
  },
  
  'area' : function() {
    
    App.actionController.addAreaOption( 'Select the area to trigger the ' + this.type, this, 3 );
    
  },
  
  clone : function() {
    
    return ContactTriggerModel.create({
      type : this.type,
      gameObject : this.gameObject,
      region : this.region ? this.region.clone() : null,
    });
    
  },
  
  string : function() {
    
    var str = this.parentGameObject.name + ( this.type === 'touch' ? ' touches ' : ' overlaps ' );
    
    if ( this.region ) {
      
      str += 'area ' + this.region.string();
      
    } else if ( this.gameObject ) {
    
      str += this.gameObject.name;
    
    }
    
    return str;
    
  }.property( 'gameObject', 'area' ),
  
  getData : function() {
    
    var data = { type : this.type };
    
    if ( this.region ) {
    
      data.area = this.region.getData();
    
    } else if ( this.gameObject ) {
    
      data.objectID = this.gameObject.ID;
    
    }
    
    return data;
    
  }
  
});

var TimeTriggerModel = ActionTriggerModel.extend({
  
  time : 0,
  time2 : 0,
  
  'exactly' : function() {
    
    this.set( 'type', 'exactly' );
    
    App.actionController.addTimeOption( 'Drag the handle to the time in the game', this.type, this, 2 );
    
    this.done();
    
  },
  
  'randomly' : function() {
    
    this.set( 'type', 'randomly' );
    
    App.actionController.addTimeOption( 'Drag the handles to set the time range', this.type, this, 2 );
    
    this.done();
    
  },
  
  setTime : function( time, time2 ) {
    
    this.set( 'time', time );
    this.set( 'time2', time2 );
    
  },
  
  clone : function() {
    
    return TimeTriggerModel.create({
      time : this.time,
      time2 : this.time2
    });
    
  },
  
  string : function() {
    
    if ( this.time2 ) {
      
      return 'randomly after ' + this.time + '-' + this.time2 + '% of the game';
      
    } else {
      
      return 'after ' + this.time + '% of the game';
      
    }
    
  }.property( 'time', 'time2' ),
  
  getData : function() {
    
    var data = { 
      type : 'time',
      time : this.time
    };
    
    if ( this.time2 ) {
    
      data.time2 = this.time2;
    
    }
    
    return data;
    
  }
  
});

var NumberTriggerModel = ActionTriggerModel.extend({

  gameObject: null,
  gameObject2: null,
  number : null, 
  type: null,
  
  selectedNumberBool : false,
  selectedGameObjectBool : false,
  
  selectedNumber: function () {
    this.set ('selectedNumberBool', true);
    this.set ('selectedGameObjectBool', false);
  },
  
  selectedGameObject: function () {
    this.set ('selectedNumberBool', false);
    this.set ('selectedGameObjectBool', true);
  },
  
  selectObject : function( gameObject ) {    
    this.set( 'gameObject', gameObject ); //equals this.gameObject = gameObject damit de view des mitgriagt
  },
  
  selectObject2 : function( gameObject ) {    
    this.set( 'gameObject2', gameObject );    
  },
  
  setTypeToGreaterThan : function ( ) {
    this.set( 'type', 'greatherThan');
  },

  setTypeToSmallerThan : function ( ) {
    this.set( 'type', 'smallerThan');
  },
  
  setTypeToEquals : function ( ) {
    this.set( 'type', 'equals');
  },
  
  setTypeToOnChange : function ( ) {
    this.set( 'type', 'onChange');
  },
  
  string : function() {
    switch(this.type) {
      case 'greatherThan':
        if(this.number)
          return 'number of' + this.gameObject.name + 'greather than' + this.number;
        else
          return 'number of' + this.gameObject.name + 'greather than' + 'number of' + this.gameObject2.name;
      case 'smallerThan':
        if(this.number)
          return 'number of' + this.gameObject.name + 'smaller than' + this.number;
        else
          return 'number of' + this.gameObject.name + 'smaller than' + 'number of' + this.gameObject2.name;
      case 'equals':
        if(this.number)
          return 'number of' + this.gameObject.name + 'equals' + this.number;
        else
          return 'number of' + this.gameObject.name + 'greather than' + 'number of' + this.gameObject2.name;
      case 'onChange':
          return 'number of' + this.gameObject.name + 'changes';
    }
  }.property( 'number', 'gameObject2' ), // .property sets on which data this function gets invoked
  
  getData : function() { //returns jSon Object for Parser
    if(this.number)
      return {
        type: this.type,
        objectID: this.gameObject.ID,
        number: this.number
      }
    else
      return {
        type: this.type,
        objectID: this.gameObject.ID,
        object2ID: this.gameObject2.ID
      } 
  }

});

var StartTriggerModel = ActionTriggerModel.extend({
  
  type : 'start'
  
});
