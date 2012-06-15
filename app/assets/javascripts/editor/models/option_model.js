var Option = Ember.Object.extend({
  
  name : null,
  question : null,
  
  type : 'empty', // ['button', 'mode', 'direction', 'location', 'area', 'offset', 'object', 'time', 'frame', 'speed', 'art']
  
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
