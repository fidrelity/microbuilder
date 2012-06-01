/*
  ActionController
  
  - manages the creation of new Actions and Triggers
*/

var ActionController = Ember.Object.extend({

  mode : 'action',

  action : null,
  
  behaviourBinding : 'App.behaviourController.current',
  
  contentView : null,
  
  optionDepth : 0,
  
  showSaveButton : false,
  
  reset : function( mode ) {
    
    var buttons;
    
    this.set( 'mode', mode );
    this.set( 'optionDepth', 0 );
    this.set( 'showSaveButton', false );
    
    this.set( 'action', null );
    
    if ( mode === 'action' ) {
      
      // buttons = ['move', 'art', 'number', 'win/lose'];
      buttons = ['move', 'win/lose'];
    
    } else {
      
      // buttons = ['click', 'contact', 'time', 'art', 'number', 'win/loss'];
      buttons = ['click', 'contact', 'time'];
    
    }
    
    this.set( 'contentView', ButtonView.create({
      observer : this,
      content : buttons
    }));
    
  },
  
  choose : function( name ) {
    
    if ( this.get( name ) ) {
      
      this.get( name ).call( this );
      
    } else {
      
      console.log( 'unknown action/trigger name: ' + name );
      
    }
    
  },
  
  updateDepth : function( depth ) {
    
    var childViews = this.contentView.get( 'childViews' );
    
    if ( !depth ) {
      
      console.error( 'option has no depth' );
      return;
      
    }
    
    while ( this.optionDepth >= depth ) {
      
      childViews.popObject();
      childViews.popObject();
      
      this.optionDepth--;
      
      this.set( 'showSaveButton', false );
      
    }
    
    this.set( 'optionDepth', depth );
    
  },
  
  addOption : function( question, viewClass, depth ) {
    
    var childViews = this.contentView.get( 'childViews' );
    
    this.updateDepth( depth );
    
    var questionView = this.contentView.createChildView( QuestionView.extend({ content : question }) );
    childViews.pushObject( questionView );
    
    var optionView = this.contentView.createChildView( viewClass );
    childViews.pushObject( optionView );
    
  },
  
  addButtonOption : function( question, buttons, observer, depth ) {
    
    this.addOption( question, ButtonView.extend({
      observer : observer,
      content : buttons
    }), depth);
    
  },
  
  addPlayerOption : function( question, type, observer, depth ) {
    
    this.addOption( question, PlayerView.extend({
      observer : observer,
      type : type,
      gameObject : App.gameObjectsController.current
    }), depth );
    
  },
  
  addLocationOption : function( question, observer, depth ) {
    
    this.addPlayerOption( question, 'location', observer, depth );
    
  },
  
  addAreaOption : function( question, observer, depth ) {
    
    this.addPlayerOption( question, 'area', observer, depth );
    
  },
  
  addObjectsOption : function( question, observer, depth ) {
    
    this.addOption( question, GameObjectsView.extend({
      observer : observer
    }), depth );
    
  },
  
  addTimeOption : function( question, type, observer, depth ) {
    
    this.addOption( question, TimeView.extend({
      observer : observer,
      type : type
    }), depth );
    
  },
  
  move : function() {
  
    this.set( 'action', MoveActionModel.create() );
    
    this.addButtonOption( 
      'What type of movement?', 
      // ['directional', 'move to', 'jump to', 'roam', 'swap', 'stop' ], 
      ['directional', 'move to', 'jump to', 'swap', 'stop' ], 
      this.action,
      1
    );
  
  },
  
  // art : function() {
  //   
  //   this.set( 'contentView', ArtActionView.create() );
  //   this.set( 'action', ArtActionModel.create() );
  //   
  // },

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
      'Trigger a touch or overlap?', 
      ['touch', 'overlap'], 
      this.action,
      1
    );
    
  },
  
  time : function() {
    
    this.set( 'action', TimeTriggerModel.create() );
    
    this.addButtonOption( 
      'Trigger an excact time or in a range?', 
      ['exactly', 'randomly'], 
      this.action,
      1
    );
    
  },

  save : function() {
    
    var action = this.get( 'action' );
    
    if ( this.mode === 'action' ) {
    
      this.get( 'behaviour' ).addAction( action );
    
    } else {
    
      this.get( 'behaviour' ).addTrigger( action );
    
    }
    
    App.mainView.show( 'overlayContent', 'objectsView' );
    
  }

});