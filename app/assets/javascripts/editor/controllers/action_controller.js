/*
  ActionController
  
  - manages the creation of new Actions and Triggers
*/

var ActionController = Ember.Object.extend({

  mode : 'Action',

  action : null,
  
  behaviourBinding : 'App.behaviourController.current',
  
  optionViews : null,
  
  showSaveButton : false,
  
  options : {},
  decisions : {},
  
  init : function() {
    
    this.set( 'options', Ember.Object.create({
      
      'action' : ButtonOption.create({ name: 'action', decisions: ['move', 'art', 'game'], buttons: ['move', 'art', 'game'], question: 'Select the type of action' }),
      
      'move' : ButtonOption.create({ name: 'move', decisions: ['moveIn', 'moveTo', 'jumpTo'], buttons: ['directional', 'move to', 'jump to'], question: 'What type of movement?' }),
      
      'moveIn' : ButtonOption.create({ name: 'moveIn', setType: 'moveIn', decisions: ['moveInDirection', 'moveSpeed', 'moveInLocation', 'moveInObject'], buttons: ['in direction', 'random direction', 'to location', 'to object'], question: 'How should it move directional?' }),
      
      'moveInDirection' : DirectionOption.create({ name: 'moveInDirection', child: 'moveSpeed', question: 'Drag it to set the direction' }),
      
      'moveTo' : ButtonOption.create({ name: 'moveTo', setType: 'moveTo', decisions: ['moveToLocation', 'moveToObject'], buttons: ['to location', 'to object'], question: 'Where should it move?' }),
      
      'moveToLocation' : LocationOption.create({ name: 'moveToLocation', child: 'moveSpeed', question: 'Drag it to the location where it should move' }),
      'moveToObject' : ObjectOption.create({ name: 'moveToObject', decision: 'moveToOffset', question: 'Choose to which other object it should move' }),
      
      'moveToOffset' : OffsetOption.create({ name: 'moveToOffset', child: 'moveSpeed', question: 'Drag the object to define the offset' }),
      
      'moveSpeed' : SpeedOption.create({ name: 'moveSpeed', child: 'save', question: 'Set the speed of the movement' }),
      
      'art' : ButtonOption.create({ name: 'art', decisions: ['toFrame', 'play', 'stop'], buttons: ['to frame', 'play', 'stop'], question: 'What should the art do?' }),
      'game' : ButtonOption.create({ name: 'game', decisions: ['win', 'lose'], buttons: ['win', 'lose'], question: 'Win or lose?' }),
      
      'save' : SaveOption.create({ name: 'save' }),
      
    }));
    
    this.set( 'decisions', Ember.Object.create({
      
      'move' : this.options.get( 'move' ),
      'art' : this.options.get( 'art' ),
      'game' : this.options.get( 'game' ),
      
    }));
    
  },
  
  insert : function( name ) {
    
    var option = this.decisions.get( name ) || this.options.get( name );
    
    option.insert();
    
  },
  
  decide : function( name, parentName ) {
    
    if ( parentName ) {
    
      this.updateDepth( parentName );
    
    }
    
    this.action.addDecision( name );
    
    this.insert( name );
    
    console.log( this.action.decisions );
    
  },
  
  reset : function( mode ) {
    
    var buttons, question;
    
    this.set( 'action', ActionModel.create() );
    
    this.set( 'mode', mode );
    this.set( 'showSaveButton', false );
    
    if ( mode === 'Action' ) {
      
      // buttons = ['move', 'art', 'number', 'win/lose'];
      buttons = ['move', 'art', 'win/lose'];
      question = 'Select the type of action';

    
    } else {
      
      // buttons = ['click', 'contact', 'time', 'art', 'number', 'win/loss'];
      buttons = ['click', 'contact', 'time'];
      question = 'Select the type of trigger';
    
    }
    
    this.set( 'optionViews', Ember.ContainerView.create({
      destroy : function() {
        if ( App.actionController.action && App.actionController.action.type !== 'search' ) {
          this._super();
        }
      }
    }));
    
    this.options.get( 'action' ).insert();
    
  },
  
  choose : function( name ) {
    
    if ( this.get( name ) ) {
      
      this.get( name ).call( this );
      
    } else {
      
      console.log( 'unknown action/trigger name: ' + name );
      
    }
    
  },
  
  updateDepth : function( name ) {
    
    var childs = this.optionViews.get( 'childViews' ),
      decisions = this.action.decisions,
      depth = decisions.indexOf( name ) + 1;
    
    if ( !depth || decisions.length === depth ) {
      
      return;
      
    }
    
    this.action.set( 'decisions', decisions.splice( 0, depth ) );
    
    while ( childs.length > ( depth + 1 ) * 2 ) {
      
      childs[childs.length - 1].removeFromParent();
      
      this.set( 'showSaveButton', false );
      
    }
    
  },
  
  addOption : function( question, optionView ) {
    
    this.optionViews.get( 'childViews' ).pushObject( QuestionView.create({ content : question }) );
    this.optionViews.get( 'childViews' ).pushObject( optionView );
    
  },
  
  addAreaOption : function( question, observer, depth ) {
    
    this.addOption( question, PlacementView.create({
      observer : observer,
      type : 'area'
    }), depth );
    
  },
  
  addTimeOption : function( question, type, observer, depth ) {
    
    this.addOption( question, TimeView.create({
      observer : observer,
      type : type
    }), depth );
    
  },
  
  addFrameOption : function( question, type, observer, depth ) {
    
    this.addOption( question, FrameView.create({
      observer : observer,
      type : type,
      graphic : App.gameObjectsController.current.graphic
    }), depth );
    
  },
  
  addArtOption : function( question, observer, depth ) {
    
    this.addOption( question, ArtView.create({
      observer : observer
    }), depth );
    
  },
  
  move : function() {
  
    this.set( 'action', MoveActionModel.create() );
    
    this.addButtonOption( 
      'What type of movement?', 
      ['directional', 'move to', 'jump to', 'roam', 'swap', 'stop'],
      this.action,
      1
    );
  
  },
  
  art : function() {
    
    this.set( 'action', ArtActionModel.create() );
    
    this.addButtonOption( 
      'What should the art do?', 
      ['to frame', 'play', 'stop', 'change' ],
      this.action,
      1
    );
    
  },

  'win/lose' : function() {
    
    this.set( 'action', WinLoseActionModel.create() );
    
    this.addButtonOption( 
      'Win or lose?', 
      ['win', 'lose'], 
      this.action,
      1
    );
    
  },
  
  click : function() {
    
    this.set( 'action', ClickTriggerModel.create() );
    
    this.addButtonOption( 
      'Click on what?', 
      ['self', 'object', 'area'], 
      this.action,
      1
    );
    
  },

  contact : function() {
    
    this.set( 'action', ContactTriggerModel.create() );
    
    this.addButtonOption( 
      'Trigger a touch or overlapping?', 
      ['touch', 'overlap'], 
      this.action,
      1
    );
    
  },
  
  time : function() {
    
    this.set( 'action', TimeTriggerModel.create() );
    
    this.addButtonOption( 
      'Trigger at an excact time or randomly in a range?', 
      ['exactly', 'randomly'], 
      this.action,
      1
    );
    
  },

  save : function() {
    
    var action = this.get( 'action' );
    
    if ( this.mode === 'Action' ) {
    
      this.get( 'behaviour' ).addAction( action );
    
    } else {
    
      this.get( 'behaviour' ).addTrigger( action );
    
    }
    
    App.mainView.show( 'objectsView' );
    
  }

});