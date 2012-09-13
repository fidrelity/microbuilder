var Choice = Ember.Object.extend({
  
  ID : null,
  
  option : null,
  
  setOption : function( option ) {
    
    this.set( 'option', option );
    
  },
  
  getDecisions : function() {
    
    return this.option.getDecisions( [] );
    
  },
  
  string : function( name, action ) {
    
    var n = name, a = action;
   
    switch ( this.ID ) {
      
      // actions
      
      case 'moveInDirection' : 
        n = 'move in direction ' + Math.floor( a.angle() * -1 / Math.PI * 180 ) + '˚';
        return n + ' - ' + a.getSpeedName();
      case 'moveInRandom' : return 'move in random direction' + ' - ' + a.getSpeedName();
      case 'moveInObject' : return 'move in direction of ' + a.gameObject.name + ' - ' + a.getSpeedName();
      case 'moveInLocation' : return 'move in direction of location ' + a.location.string() + ' - ' + a.getSpeedName();

      case 'moveAlongPath' : return 'move ' + a.mode + ' along path - ' + a.getSpeedName();
      
      case 'moveToLocation' : return 'move to location ' + a.location.string() + ' - ' + a.getSpeedName();
      case 'moveToObject' : 
        n = 'move to ' + a.gameObject.name + ' - ' + a.getSpeedName();
        return n + ( a.offset.norm() ? ' - offset ' + a.offset.string() : '' );
      
      case 'jumpToLocation' : return 'jump to location ' + a.location.string();
      case 'jumpToObject' : 
        n = 'jump to ' + a.gameObject.name;
        return n + ( a.offset.norm() ? ' - offset ' + a.offset.string() : '' );
      case 'jumpToArea' : return 'jump to area ' + a.area.string();
      
      case 'moveRoam' : 
        n = 'roam in ' + a.mode + ' mode within area ' + a.area.string();
        return n + ' - ' + a.getSpeedName();
      case 'moveSwap' : return 'swap position with ' + a.gameObject.name;
      case 'moveStop' : return 'stop moving';
      
      case 'artToFrame' : return 'display frame ' + a.frame;
      case 'artPlay' : 
        n = ( a.mode === 'loop' ? ' loop ' : ( a.mode === 'once' ? ' play once ' : ' play ping-pong ' ) );
        return n + ' from frame ' + a.frame + ' to ' + a.frame2 + ' - ' + a.getSpeedName();
      case 'artStop' : return 'stop the animation';
      case 'artChange' : return 'change art to ' + a.graphic.name;
      
      case 'gameWin' : return 'win the game';
      case 'gameLose' : return 'lose the game';

      case 'counterUp' : return 'increase counter';
      case 'counterDown' : return 'decrease counter';
      case 'counterSet' : return 'set counter to ' + a.counter;
      
      // triggers
      
      case 'clickObject' : return 'click on ' + a.gameObject.name;
      case 'clickArea' : return 'click in area ' + a.area.string();
      
      case 'touchObject' : return n + ' touches ' + a.gameObject.name;
      case 'touchArea' : return n + ' touches area ' + a.area.string();
      
      case 'overlapObject' : return n + ' overlaps ' + a.gameObject.name;
      case 'overlapArea' : return n + ' overlaps area ' + a.area.string();
      
      case 'timeExact' : return 'after ' + a.time + '%';
      case 'timeRandom' : return 'sometime between ' + a.time + '-' + a.time2 + '%';
      
      case 'gameWasWon' : return 'game is won';
      case 'gameWasLost' : return 'game is lost';
      case 'gameStart' : return 'start';

      case 'counterGreaterNumber' : return 'counter greater than ' + action.counter;
      case 'counterSmallerNumber' : return 'counter smaller than ' + action.counter;
      case 'counterEqualsNumber' : return 'counter equal to ' + action.counter;

      case 'counterGreaterObject' : return 'counter greater than ' + a.gameObject.name + '\'s counter';
      case 'counterSmallerObject' : return 'counter smaller than ' + a.gameObject.name + '\'s counter';
      case 'counterEqualsObject' : return 'counter equal to ' + a.gameObject.name + '\'s counter';
      
      default : console.error( 'Unknow choice name: ' + this.ID );
      
    }
    
  }
  
});

var Option = Ember.Object.extend({
  
  name : null,
  question : null,
  
  type : 'empty', // ['button', 'mode', 'direction', 'location', 'area', 'offset', 'object', 'time', 'frame', 'speed', 'art', 'counter']
  
  action : null,
  
  decision : null,
  decisions : [],
  
  child : null,
  parent : null,
  
  insert : function( action ) {
    
    this.set( 'action', action );
    
    App.actionController.updateDepth( this.parent );
    
    this.doInsert();
    
    action.addDecision( this );
    
    if ( this.child ) {
      
      this.child.insert( action );
      
    }
    
  },
  
  doInsert : function() {},
  
  reInsert : function( action ) {
    
    this.set( 'action', action );
    
    if ( this.parent ) {
      
      this.parent.reInsert( action );
      
    }
    
    this.doInsert( true );
    
  },
  
  setParents : function( parent ) {
    
    var i;
    
    this.set( 'parent', parent );
    
    if ( this.decisions.length ) {
      
      for ( i = 0; i < this.decisions.length; i++ ) {
        
        this.decisions[i].setParents( this );
        
      }
      
    } else if ( this.decision ) {
      
      this.decision.setParents( this );
      
    } else if ( this.child ) {
      
      this.child.setParents( this );
      
    }
    
  },
  
  setChoices : function() {
    
    var i;
    
    if ( this.decisions.length ) {
      
      for ( i = 0; i < this.decisions.length; i++ ) {
        
        this.decisions[i].setChoices();
        
      }
      
    } else if ( this.decision ) {
      
      this.decision.setChoices();
      
    } else if ( this.child ) {
      
      this.child.setChoices();
      
    }
    
  },
  
  getDecisions : function( decisions ) {
    
    if ( this.parent ) {
      
      this.parent.getDecisions( decisions );
      
    }
    
    decisions.addObject( this );
    
    return decisions;
    
  }
  
});

var ButtonOption = Option.extend({
  
  type : 'button',
  
  buttons : [],
  
  doInsert : function( reinsert ) {
    
    var buttons = this.buttons.map( function(i){ return { name: i }; } ),
      decisions = this.action.decisions,
      i;
    
    if ( reinsert ) {
      
      if ( this.type === 'mode' ) {
      
        i = this.modes.indexOf( this.action.mode );
      
      } else {
      
        i = decisions.indexOf( this ) + 1;
        i = this.decisions.indexOf( decisions[i] );
      
      }
      
      buttons[i].select = true;
      
    } else if ( this.type === 'mode' ) {
      
      this.action.setMode( null );
      
    }
    
    App.actionController.addOption( this.question, ButtonView.create({
      observer : this,
      content : buttons
    }));
    
  },
  
  decide : function( button ) {
    
    var index = this.buttons.indexOf( button );
    
    this.decisions[index].insert( this.action );
    
  }
  
});

var ModeOption = ButtonOption.extend({
  
  type : 'mode',
  
  modes : [],
  
  decide : function( button ) {
    
    var index = this.buttons.indexOf( button );
    
    if ( !this.action.mode ) {
      
      this.decision.insert( this.action );
      
    }
    
    this.action.setMode( this.modes[index] );
    
  }
  
});

var ObjectOption = Option.extend({
  
  type : 'object',
  showOthers : false,
  
  doInsert : function( reinsert ) {
    
    if ( reinsert ) {
      
      this.action.gameObject.set( 'active', true );
      
    }
    
    App.actionController.addOption( this.question, GameObjectsView.create({
      observer : this,
      contentBinding : 'App.gameObjectsController.' + ( this.showOthers ? 'others' : 'content' ),
    }));
    
  },
  
  decide : function( object ) {
    
    this.action.setObject( object );
    
    this.decision.insert( this.action );
    
  }
  
});

var LocationOption = Option.extend({
  
  type : 'location',
  
  doInsert : function( reinsert ) {
    
    App.actionController.addOption( this.question, PlacementView.create({
      observer : this.action,
      type : 'location',
      object : App.gameObjectsController.current
    }));
    
    if ( !reinsert ) {
    
      this.action.setLocation( App.gameObjectsController.current.position.clone() );
    
    }
    
  }
  
});

var DirectionOption = Option.extend({
  
  type : 'direction',
  
  doInsert : function( reinsert ) {
    
    App.actionController.addOption( this.question, PlacementView.create({
      observer : this.action,
      type : 'direction',
      object : App.gameObjectsController.current
    }));
    
    if ( !reinsert ) {
    
      this.action.setLocation( new Vector( 100, 0 ) );
    
    }
    
  }
  
});

var AreaOption = Option.extend({
  
  type : 'area',
  
  doInsert : function( reinsert ) {
    
    App.actionController.addOption( this.question, PlacementView.create({
      observer : this,
      type : 'area'
    }));
    
    if ( !reinsert ) {
      
      this.action.setArea( null );
      
    }
    
  },
  
  decide : function( area ) {
    
    if ( !this.action.area ) {
      
      this.decision.insert( this.action );
      
    }
    
    this.action.setArea( area );
    
  }
  
});

var PathOption = Option.extend({
  
  type : 'path',
  
  doInsert : function( reinsert ) {
    
    App.actionController.addOption( this.question, PlacementView.create({
      observer : this.action,
      type : 'path',
      object : App.gameObjectsController.current
    }));
    
  }
  
});

var OffsetOption = Option.extend({
  
  type : 'offset',
  
  doInsert : function( reinsert ) {
    
    App.actionController.addOption( this.question, PlacementView.create({
      observer : this.action,
      type : 'offset',
      object : App.gameObjectsController.current,
      object2 : this.action.gameObject
    }));
    
    if ( !reinsert ) {
    
      this.action.setOffset( new Vector( 0, 0 ) );
    
    }
    
  }
  
});

var SpeedOption = Option.extend({
  
  type : 'speed',
  
  doInsert : function( reinsert ) {
    
    App.actionController.addOption( this.question, SpeedView.create({
      observer : this.action,
      speed : reinsert ? this.action.speed : 2
    }));
    
    if ( !reinsert ) {
    
      this.action.setSpeed( 2 );
    
    }
    
  }
  
});

var FrameOption = Option.extend({
  
  type : 'frame',
  
  frame : 0,
  
  mode : 'frame',
  
  doInsert : function( reinsert ) {
    
    App.actionController.addOption( this.question, FrameView.create({
      observer : this,
      graphic : App.gameObjectsController.current.graphic
    }));
    
    if ( !reinsert ) {
      
      this.action.setFrame( this.mode, null );
      
    }
    
  },
  
  decide : function( frame ) {
    
    if ( !this.action[this.mode] ) {
      
      this.decision.insert( this.action );
      
    }
    
    this.set( 'frame', frame.number );
    this.action.setFrame( this.mode, frame.number );
    
  }
  
});

var ArtOption = Option.extend({
  
  type : 'art',
  
  graphic : null,
  
  doInsert : function( reinsert ) {
    
    this.set( 'graphic', reinsert ? this.action.graphic : null );
    
    App.actionController.addOption( this.question, ArtView.create({
      observer : this
    }));
    
  },
  
  decide : function( graphic ) {
    
    this.set( 'graphic', graphic );
    this.action.setGraphic( graphic );
    
    this.decision.insert( this.action );
    
  }
  
});

var TimeOption = Option.extend({
  
  type : 'time',
  
  mode : 'exact',
  
  doInsert : function( reinsert ) {

    console.log("doInser");
    
    if ( !reinsert ) {
      
      this.action.setTime( randInt( 20, 45 ), this.mode === 'random' ? randInt( 60, 85 ) : 0 );
      
    }
    
    App.actionController.addOption( this.question, TimeView.create({
      observer : this.action,
      type : this.mode,
      min : this.action.time,
      max : this.action.time2
    }));
    
  }
  
});

var SaveOption = Option.extend({
  
  type : 'save',
  name : 'save',
  
  choiceID : null,
  
  doInsert : function() {
    
    this.action.setChoice( this.choiceID );
    App.actionController.set( 'showSaveButton', true );
    
  },
  
  setChoices : function() {
    
    var choice = App.actionController.getChoice( this.choiceID );
    choice.setOption( this );
    
  }
  
});


var CounterOption = Option.extend({
  
  type : 'counter',
  
  doInsert : function( reinsert ) {
    
    App.actionController.addOption( this.question, CounterView.create({
      observer : this.action,
      value : reinsert ? this.action.counter : '',
    }));
    
    if ( !reinsert ) {
    
      this.action.setCounter( 0 );
    
    }
    
  }
  
});