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
  
  reset : function( mode ) {
    
    var buttons, question;
    
    this.set( 'action', null );
    
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
        if ( App.actionController.action.type !== 'search' ) {
          this._super();
        }
      }
    }));
    
    this.addOption( question, ButtonView.create({
      observer : this,
      content : buttons,
      disable : false
    }), 0 );
    
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
  
  addPlayerOption : function( question, type, observer, depth ) {
    
    this.addOption( question, PlayerView.create({
      observer : observer,
      type : type,
      gameObject : App.gameObjectsController.current
    }), depth );
    
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