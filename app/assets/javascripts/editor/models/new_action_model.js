var ActionModel = Ember.Object.extend({
  
  type : null,
  
  decisions : [],
  
  init : function() {
    
    this.set( 'decisions', [] );
    
  },
  
  addDecision : function( name ) {
    
    this.decisions.addObject( name );
    
  },
  
  setType : function( type ) {
    
    this.set( 'type', type );
    
  },
  
  setMode : function( mode ) {
    
    this.set( 'mode', mode );
    
  },
  
  setObject : function( object ) {
    
    this.set( 'gameObject', object );
    
  },
  
  setLocation : function( location ) {
    
    this.set( 'location', location );
    
  },
  
  setArea : function( area ) {
    
    this.set( 'area', area );
    
  },
  
  setOffset : function( offset ) {
    
    this.set( 'offset', offset );
    
  },
  
  setFrame : function( name, frame ) {
    
    this.set( name, frame );
    
  },
  
  setGraphic : function( graphic ) {
    
    this.set( 'graphic', graphic );
    
    this.set( 'type', 'art' );
    
  },
  
  
  speed : 2,
  
  speeds : ['very slow', 'slow', 'medium', 'fast', 'very fast'],
  
  setSpeed : function( speed ) {
    
    this.set( 'speed', speed );
    
  },
  
  speedName : function() {
    
    return this.speeds[ this.speed ];
    
  }.property( 'speed' ),
  
  
  angle : function() {
    
    return this.location.angle().toFixed( 2 );
    
  },
  
  
  string : function() {
    
    return this.decisions.join( ' > ' );
    
  }.property( 'decisions.length' ),
  
  clone : function() {
    
    return ActionModel.create({
      
      type : this.type,
      decisions : this.decisions.concat(),
      
      gameObject : this.gameObject,
      
      location : this.location ? this.position.clone() : null,
      offset : this.offset ? this.offset.clone() : null,
      
      area : this.area ? this.area.clone() : null,
      
      frame : this.frame,
      frame2 : this.frame2,
      
      graphic : this.graphic,
      
      mode : this.mode,
      speed : this.speed
      
    });
    
  },
  
  parse : function( data ) {
    
    var d = data;
    
    this.setProperties({
      
      type : d.type,
      decisions : d.decisions,
      
      gameObject : d.objectID ? App.gameObjectsController.getObject( d.objectID ) : null,
      
      location : d.location ? new Vector().copy( d.location ) : d.angle ? new Vector( 1, 0 ).rotateSelf( d.angle ) : null,
      offset : d.offset ? new Vector().copy( d.offset ) : null,
      
      area : d.area ? new Area().copy( d.area ) : null,
      
      frame : d.frame,
      frame2 : d.frame2,
      
      graphic : d.graphicID ? App.libraryController.getGraphic( d.graphicID ) : null,
      
      mode : d.mode,
      speed : d.speed
      
    });
    
    return this;
    
  },
  
  getData : function() {
    
    var data = { type : this.type, decisions : this.decisions.concat() }, i, optionType;
    
    for ( i = 0; i < this.decisions.length; i++ ) {
      
      optionType = App.actionController.options.get( this.decisions[i] ).type;
      
      switch ( optionType ) {
        
        case 'empty': break;
        case 'button': break;
        
        case 'object': data.objectID = this.gameObject.ID; break;
        
        case 'location': data.location = this.location.getData(); break;
        case 'direction': data.angle = this.angle(); break;
        
        case 'area': data.area = this.area.getData(); break;
        
        case 'offset': if ( this.offset ) data.offset = this.offset.getData(); break;
        
        case 'frame': data.frame = this.frame; if ( this.frame2 ) data.frame2 = this.frame2; break;
        case 'art': data.graphicID = this.graphic.ID; break;
        
        case 'speed': data.speed = this.speed; break;
        case 'mode': data.mode = this.mode; break;
        
        default : console.error( 'unknown optionType: ' + optionType );
        
      }
      
    }
    
    return data;
    
  }
  
});

var Option = Ember.Object.extend({
  
  name : null,
  question : null,
  
  type : 'empty', // ['button', 'direction', 'location', 'area', 'offset', 'object', 'time', 'frame', 'speed', 'art']
  
  actionBinding : 'App.actionController.action',
  
  setType : null,
  setMode : null,
  
  decision : null,
  decisions : [],
  
  child : null,
  
  insert : function() {
    
    if ( this.setType ) {
      
      this.action.setType( this.setType );
      
    }
    
    if ( this.setMode ) {
      
      this.action.setMode( this.setMode );
      
    }
    
    if ( this.child ) {
      
      App.actionController.insert( this.child );
      
    }
    
  },
  
  decide : function( decision ) {
    
    if ( decision === 'save' ) {
      
      App.actionController.insert( decision );
      
    } else {
      
      App.actionController.decide( decision );
      
    }
    
  }
  
});

var ButtonOption = Option.extend({
  
  type : 'button',
  
  buttons : [],
  
  insert : function() {
    
    App.actionController.addOption( this.question, ButtonView.create({
      observer : this,
      content : this.buttons
    }));
    
    this._super();
    
  },
  
  decide : function( button ) {
    
    var index = this.buttons.indexOf( button );
    
    App.actionController.decide( this.decisions[index], this.name );
    
  }
  
});

var ObjectOption = Option.extend({
  
  type : 'object',
  
  insert : function() {
    
    App.actionController.addOption( this.question, GameObjectsView.create({
      observer : this,
      contentBinding : 'App.gameObjectsController.others',
    }));
    
    this._super();
    
  },
  
  decide : function( object ) {
    
    this.action.setObject( object );
    
    this._super( this.decision );
    
  }
  
});

var LocationOption = Option.extend({
  
  type : 'location',
  
  insert : function() {
    
    App.actionController.addOption( this.question, PlacementView.create({
      observer : this.action,
      type : 'location',
      object : App.gameObjectsController.current
    }));
    
    this.action.setLocation( App.gameObjectsController.current.position.clone() );
    
    this._super();
    
  }
  
});

var DirectionOption = Option.extend({
  
  type : 'direction',
  
  insert : function() {
    
    App.actionController.addOption( this.question, PlacementView.create({
      observer : this.action,
      type : 'direction',
      object : App.gameObjectsController.current
    }));
    
    this.action.setLocation( new Vector( 1, 0 ) );
    
    this._super();
    
  }
  
});

var AreaOption = Option.extend({
  
  type : 'area',
  
  insert : function() {
    
    App.actionController.addOption( this.question, PlacementView.create({
      observer : this,
      type : 'area'
    }));
    
    this._super();
    
  },
  
  decide : function( area ) {
    
    this.action.setArea( area );
    
    this._super( this.decision );
    
  }
  
});

var OffsetOption = Option.extend({
  
  type : 'offset',
  
  insert : function() {
    
    App.actionController.addOption( this.question, PlacementView.create({
      observer : this.action,
      type : 'offset',
      object : App.gameObjectsController.current,
      object2 : this.action.gameObject
    }));
    
    this._super();
    
  }
  
});

var SpeedOption = Option.extend({
  
  type : 'speed',
  
  insert : function() {
    
    App.actionController.addOption( this.question, SpeedView.create({
      observer : this.action
    }));
    
    this.action.setSpeed( 2 );
    this.action.addDecision( this.name );
    
    this._super();
    
  }
  
});

var FrameOption = Option.extend({
  
  type : 'frame',
  
  frame : 0,
  
  mode : 'frame',
  
  insert : function() {
    
    App.actionController.addOption( this.question, FrameView.create({
      observer : this,
      graphic : App.gameObjectsController.current.graphic
    }));
    
    this._super();
    
  },
  
  decide : function( frame ) {
    
    this.set( 'frame', frame.number );
    this.action.setFrame( this.mode, frame.number );
    
    this._super( this.decision );
    
  }
  
});

var ArtOption = Option.extend({
  
  type : 'art',
  
  graphic : null,
  
  insert : function() {
    
    App.actionController.addOption( this.question, ArtView.create({
      observer : this
    }));
    
    this._super();
    
  },
  
  decide : function( graphic ) {
    
    this.set( 'graphic', graphic );
    this.action.setGraphic( graphic );
    
    this._super( this.decision );
    
  }
  
});

var SaveOption = Option.extend({
  
  insert : function() {
    
    App.actionController.set( 'showSaveButton', true );
    
  }
  
});
