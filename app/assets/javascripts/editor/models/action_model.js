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
    
    this._super();
    
    this.set( 'position', new Vector() );
    
  },
  
  clone : function() {
    
    return MoveActionModel.create({
      
      type : this.type,
      
      gameObject : this.gameObject,
      position : this.position.clone(),
      
      random : this.random,
      direction : this.direction
      
    });
    
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
      this,
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
    
    App.actionController.addLocationOption( question, this, 3 );
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
  
  'to frame' : function() {
    
    App.actionController.addFrameOption( 'Choose the frame', this, 2 );
    
  },
  
  play : function() {
    
    
    
  },
  
  stop : function() {
    
    this.done();
    
  },
  
  setFrame : function( frame ) {
    
    this.set( 'frame', frame.number );
    
    this.done();
    
  },
  
  string : function() {
    
    var name = this.parentGameObject.name;
    
    if ( this.frame2 ) {
      
      name += ' plays animation from frame ' + this.frame + ' to ' + this.frame2 + ' in ' + this.mode;
      
    } else if ( this.frame ) {
      
      name += ' jumps to frame ' + this.frame;
      
    } else {
      
      name += ' stops the animation';
      
    }
    
    return name;
    
  }.property( 'frame', 'frame2', 'mode' ),
  
  getData : function() {
  
    var data = { type : 'art' };
    
    if ( this.frame ) {
      
      data.frame = this.frame;
      
    }
    
    if ( this.frame2 ) {
      
      data.frame2 = this.frame2;
      data.mode = this.mode;
      
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
    
  }
  
});

var ClickTriggerModel = ActionTriggerModel.extend({
  
  clone : function() {
    
    return ClickTriggerModel.create({
      gameObject : this.gameObject,
      region : this.region ? this.region.clone() : null,
    });
    
  },
  
  'self' : function() {
    
    this.done();
    
  },
  
  'object' : function() {
    
    App.actionController.addObjectsOption( 'Choose the object to trigger the click', this, 2 );
    
  },
  
  'area' : function() {
    
    App.actionController.addAreaOption( 'Select the area to trigger the click', this, 2 );
    
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
    
    App.actionController.addButtonOption( 'With what?', ['object', 'area'], this, 2 );
    
  },
  
  'overlap' : function() {
    
    this.set( 'type', 'overlap' );
    
    App.actionController.addButtonOption( 'With what?', ['object', 'area'], this, 2 );
    
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
      
    } else {
    
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
    
    App.actionController.addTimeOption( 'Drag the handle to the time you want.', this.type, this, 2 );
    
    this.done();
    
  },
  
  'randomly' : function() {
    
    this.set( 'type', 'randomly' );
    
    App.actionController.addTimeOption( 'Drag the handles to set the range you want.', this.type, this, 2 );
    
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
      
      return 'between ' + this.time + ' to ' + this.time2 + '% in the game';
      
    } else {
      
      return this.time + '% in the game';
      
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
