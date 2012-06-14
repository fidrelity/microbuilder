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
      
      'action' : ButtonOption.create({ name: 'action', decisions: ['move', 'art', 'game'], buttons: ['move', 'art', 'game'], question: 'Select the type of action', depth: 0 }),
      
      'move' : ButtonOption.create({ name: 'move', decisions: ['directional', 'moveTo', 'jumpTo'], buttons: ['directional', 'move to', 'jump to'], question: 'What type of movement?', depth: 1 }),
      'art' : ButtonOption.create({ name: 'art', decisions: ['toFrame', 'play', 'stop'], buttons: ['to frame', 'play', 'stop'], question: 'What should the art do?', depth: 1 }),
      'game' : ButtonOption.create({ name: 'game', decisions: ['win', 'lose'], buttons: ['win', 'lose'], question: 'Win or lose?', depth: 1 }),
      
      'moveTo' : ButtonOption.create({ name: 'moveTo', setType: 'moveTo', decisions: ['moveToLocation', 'moveToObject'], buttons: ['to location', 'to object'], question: 'Where should it move?', depth: 2 }),
      
      'moveToObject' : ObjectOption.create({ name: 'moveToObject', decision: 'moveToOffset', question: 'Choose to which other object it should move', depth: 3 }),
      
      'moveToOffset' : OffsetOption.create({ name: 'moveToOffset', child: 'moveToSpeed', question: 'Drag the object to define the offset', depth : 4 }),
      
      'moveToSpeed' : SpeedOption.create({ name: 'moveToSpeed', child: 'saveAction', question: 'Set the speed of the movement', depth : 5 }),
      
      'saveAction' : SaveOption.create({ name: 'save', question: 'Is your Action correct?' }),
      
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
  
  decide : function( name ) {
    
    this.action.addDecision( name );
    
    this.insert( name );
    
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
    
    // this.addOption( question, ButtonView.create({
    //   observer : this,
    //   content : buttons,
    //   disable : false
    // }), 0 );
    
    this.options.get( 'action' ).insert();
    
  },
  
  choose : function( name ) {
    
    if ( this.get( name ) ) {
      
      this.get( name ).call( this );
      
    } else {
      
      console.log( 'unknown action/trigger name: ' + name );
      
    }
    
  },
  
  updateDepth : function( depth ) {
    
    var childs = this.optionViews.get( 'childViews' );
    
    if ( typeof depth === 'undefined' ) {
      
      console.error( 'option has no depth' );
      return;
      
    }
    
    while ( childs.length > depth * 2 ) {
      
      childs[childs.length - 1].removeFromParent();
      
      this.set( 'showSaveButton', false );
      
    }
    
  },
  
  addOption : function( question, optionView, depth ) {
    
    this.updateDepth( depth );
    
    this.optionViews.get( 'childViews' ).pushObject( QuestionView.create({ content : question }) );
    this.optionViews.get( 'childViews' ).pushObject( optionView );
    
  },
  
  addButtonOption : function( question, buttons, observer, depth ) {
    
    this.addOption( question, ButtonView.create({
      observer : observer,
      content : buttons
    }), depth);
    
  },
  
  addDirectionOption : function( question, observer, depth ) {
    
    this.addOption( question, PlacementView.create({
      observer : observer,
      type : 'direction',
      object : App.gameObjectsController.current
    }), depth );
    
  },
  
  addLocationOption : function( question, observer, depth ) {
    
    this.addOption( question, PlacementView.create({
      observer : observer,
      type : 'location',
      object : App.gameObjectsController.current
    }), depth );
    
  },
  
  addAreaOption : function( question, observer, depth ) {
    
    this.addOption( question, PlacementView.create({
      observer : observer,
      type : 'area'
    }), depth );
    
  },
  
  addOffsetOption : function( question, observer, gameObject, depth ) {
    
    this.addOption( question, PlacementView.create({
      observer : observer,
      type : 'offset',
      object : App.gameObjectsController.current,
      object2 : gameObject
    }), depth );
    
  },
  
  addObjectsOption : function( question, observer, depth ) {
    
    this.addOption( question, GameObjectsView.create({
      observer : observer,
      contentBinding : 'App.gameObjectsController.others',
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
  
  addSpeedOption : function( question, observer, depth ) {
    
    this.addOption( question, SpeedView.create({
      observer : observer
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