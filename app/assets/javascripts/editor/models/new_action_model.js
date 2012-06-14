var ActionModel = Ember.Object.extend({
  
  type : null,
  
  decisions : [],
  
  addDecision : function( name ) {
    
    this.decisions.addObject( name );
    
  },
  
  setType : function( type ) {
    
    this.set( 'type', type );
    
  },
  
  setObject : function( object ) {
    
    this.set( 'gameObject', object );
    
  },
  
  setOffset : function( offset ) {
    
    this.set( 'offset', offset );
    
  },
  
  
  speed : 2,
  
  speeds : ['very slow', 'slow', 'medium', 'fast', 'very fast'],
  
  setSpeed : function( speed ) {
    
    this.set( 'speed', speed );
    
  },
  
  speedName : function() {
    
    return this.speeds[ this.speed ];
    
  }.property( 'speed' ),
  
  
  string : function() {
    
    return this.decisions.join( ' > ' );
    
  }.property( 'decisions.length' ),
  
  clone : function() {
    
    return ActionModel.create({
      
      type : this.type,
      decisions : this.decisions.concat(),
      
      gameObject : this.gameObject,
      // location : this.position.clone(),
      offset : this.offset ? this.offset.clone() : null,
      // region : this.region ? this.region.clone() : null,
      
      // random : this.random,
      // direction : this.direction,
      
      speed : this.speed,
      // addSpeed : this.addSpeed
      
    });
    
  },
  
  parse : function( data ) {
    
    var d = data;
    
    this.setProperties({
      
      type : d.type,
      decisions : d.decisions,
      
      // location : d.location ? new Vector( d.location.x, d.location.y ) : new Vector( 1, 0 ).rotateSelf( d.angle ),
      offset : d.offset ? new Vector( d.offset.x, d.offset.y ) : null,
      gameObject : d.objectID ? App.gameObjectsController.getObject( d.objectID ) : null,
      // region : d.area ? new Area().copy( d.area ) : null,
      // mode : d.mode,
      speed : d.speed,
      // random : d.random
    });
    
    return this;
    
  },
  
  getData : function() {
    
    var data = { type : this.type, decisions : this.decisions.concat() }, i, optionType;
    
    for ( i = 0; i < this.decisions.length; i++ ) {
      
      optionType = App.actionController.options.get( this.decisions[i] ).type;
      
      switch ( optionType ) {
        
        case 'button': break;
        
        case 'object': data.objectID = this.gameObject.ID; break;
        case 'offset': data.offset = this.offset.getData(); break;
        case 'speed': data.speed = this.speed; break;
        
        default : console.error( 'unknown optionType: ' + optionType );
        
      }
      
    }
    
    return data;
    
  }
  
});

var Option = Ember.Object.extend({
  
  name : null,
  question : null,
  
  type : null, // ['button', 'direction', 'location', 'area', 'offset', 'object', 'time', 'frame', 'speed', 'art']
  setType : null,
  
  depth : 0,
  
  decision : null,
  decisions : [],
  
  child : null,
  
  insert : function() {
    
    if ( this.setType ) {
      
      App.actionController.action.setType( this.setType );
      
    }
    
    if ( this.child ) {
      
      App.actionController.insert( this.child );
      
    }
    
  },
  
  decide : function() {}
  
});

var ButtonOption = Option.extend({
  
  type : 'button',
  
  buttons : [],
  
  insert : function() {
    
    App.actionController.addButtonOption( this.question, this.buttons, this, this.depth );
    
    this._super();
    
  },
  
  decide : function( button ) {
    
    var index = this.buttons.indexOf( button );
    
    App.actionController.decide( this.decisions[index] );
    
  }
  
});

var ObjectOption = Option.extend({
  
  type : 'object',
  
  insert : function() {
    
    App.actionController.addObjectsOption( this.question, this, this.depth );
    
  },
  
  decide : function( object ) {
    
    App.actionController.action.setObject( object );
    
    App.actionController.decide( this.decision );
    
  }
  
});

var OffsetOption = Option.extend({
  
  type : 'offset',
  
  insert : function() {
    
    App.actionController.addOffsetOption( this.question, App.actionController.action, App.actionController.action.gameObject, this.depth );
    
    this._super();
    
  }
  
});

var SpeedOption = Option.extend({
  
  type : 'speed',
  
  insert : function() {
    
    App.actionController.addSpeedOption( this.question, App.actionController.action, this.depth );
    App.actionController.action.addDecision( this.name );
    
    this._super();
    
  }
  
});

var SaveOption = Option.extend({
  
  insert : function() {
    
    App.actionController.set( 'showSaveButton', true );
    
  }
  
});
