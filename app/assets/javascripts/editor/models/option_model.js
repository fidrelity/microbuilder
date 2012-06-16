var Choice = Ember.Object.extend({
  
  ID : null,
  
  option : null,
  
  setOption : function( option ) {
    
    this.set( 'option', option );
    
  },
  
  getDecisions : function() {
    
    return this.option.getDecisions( [] );
    
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
    
    var i, choice;
    
    if ( this.choiceID ) {
      
      choice = App.actionController.getChoice( this.choiceID );
      choice.setOption( this );
      
    } else if ( this.decisions.length ) {
      
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
  
  doInsert : function() {
    
    App.actionController.addOption( this.question, ButtonView.create({
      observer : this,
      content : this.buttons
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
  
  doInsert : function() {
    
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
  
  doInsert : function() {
    
    App.actionController.addOption( this.question, PlacementView.create({
      observer : this.action,
      type : 'location',
      object : App.gameObjectsController.current
    }));
    
    this.action.setLocation( App.gameObjectsController.current.position.clone() );
    
  }
  
});

var DirectionOption = Option.extend({
  
  type : 'direction',
  
  doInsert : function() {
    
    App.actionController.addOption( this.question, PlacementView.create({
      observer : this.action,
      type : 'direction',
      object : App.gameObjectsController.current
    }));
    
    this.action.setLocation( new Vector( 1, 0 ) );
    
  }
  
});

var AreaOption = Option.extend({
  
  type : 'area',
  
  doInsert : function() {
    
    App.actionController.addOption( this.question, PlacementView.create({
      observer : this,
      type : 'area'
    }));
    
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
  
  doInsert : function() {
    
    App.actionController.addOption( this.question, SpeedView.create({
      observer : this.action
    }));
    
    this.action.setSpeed( 2 );
    
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
  
  doInsert : function() {
    
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

var SaveOption = Option.extend({
  
  type : 'save',
  name : 'save',
  
  choiceID : null,
  
  doInsert : function() {
    
    this.action.setChoice( this.choiceID );
    App.actionController.set( 'showSaveButton', true );
    
  }
  
});
