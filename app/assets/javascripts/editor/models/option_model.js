var Choice = Ember.Object.extend({
  
  ID : null,
  
  option : null,
  
  setOption : function( option ) {
    
    this.set( 'option', option );
    
  },
  
  getDecisions : function() {
    
    return this.option ? this.option.getDecisions( [] ) : [];
    
  },
  
  string : function( gameObject, action ) {
    
    switch ( this.ID ) {
      
      case 'moveInDirection' : return 'moves in direction';
      
      default : console.error( 'Unknow choice name: ' + this.ID );
      
    }
    
  }
  
});

var Option = Ember.Object.extend({
  
  name : null,
  question : null,
  
  type : 'empty', // ['button', 'mode', 'direction', 'location', 'area', 'offset', 'object', 'time', 'frame', 'speed', 'art']
  
  action : null,
  
  setType : null,
  
  decision : null,
  decisions : [],
  
  child : null,
  parent : null,
  
  insert : function( action ) {
    
    this.set( 'action', action );
    
    App.actionController.updateDepth( this.parent );
    
    this.doInsert();
    
    action.addDecision( this );
    
    if ( this.setType ) {
      
      action.setType( this.setType );
      
    }
    
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
    
    this.action.setMode( this.modes[index] );
    
    this.decision.insert( this.action );
    
  }
  
});

var ObjectOption = Option.extend({
  
  type : 'object',
  
  doInsert : function( reinsert ) {
    
    if ( reinsert ) {
      
      this.action.gameObject.set( 'active', true );
      
    }
    
    App.actionController.addOption( this.question, GameObjectsView.create({
      observer : this,
      contentBinding : 'App.gameObjectsController.others',
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
    
    this.action.setArea( area );
    
    this.decision.insert( this.action );
    
  }
  
});

var OffsetOption = Option.extend({
  
  type : 'offset',
  
  doInsert : function() {
    
    App.actionController.addOption( this.question, PlacementView.create({
      observer : this.action,
      type : 'offset',
      object : App.gameObjectsController.current,
      object2 : this.action.gameObject
    }));
    
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
  
  doInsert : function() {
    
    App.actionController.addOption( this.question, FrameView.create({
      observer : this,
      graphic : App.gameObjectsController.current.graphic
    }));
    
  },
  
  decide : function( frame ) {
    
    this.set( 'frame', frame.number );
    this.action.setFrame( this.mode, frame.number );
    
    this.decision.insert( this.action );
    
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
  
  doInsert : function() {
    
    App.actionController.addOption( this.question, TimeView.create({
      observer : this.action,
      type : this.mode,
      min : this.action.time || 30,
      max : this.action.time2 || 70
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
