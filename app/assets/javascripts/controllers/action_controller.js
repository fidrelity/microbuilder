/*
  ActionController
  
  - manages the creation of a new Action or editing
*/

var ActionController = Ember.Object.extend({

  mode : 'action',

  action : null,
  
  behaviourBinding : 'App.behaviourController.currentBehaviour',
  
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
      
      buttons = ['move', 'art', 'number', 'win/lose'];
    
    } else {
      
      buttons = ['click', 'contact', 'time', 'art', 'number', 'win/loss'];
    
    }
    
    this.set( 'contentView', ButtonView.create({
      observer : this,
      content : buttons
    }));
    
  },
  
  notify : function( name ) {
    
    if ( this.get( name ) ) {
      
      this.get( name ).call( this );
      
    } else {
      
      console.log( 'unknown action/trigger name: ' + name );
      
    }
    
  },
  
  addOption : function( question, viewClass, depth ) {
    
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
  
  addPlayerOption : function( question, type, depth ) {
    
    if ( type === 'moveTo' || type === 'jumpTo' ) {
    
      this.addOption( question, PlayerView.extend({
        type : type,
        positionBinding : 'App.actionController.action.position',
        gameObject : App.gameObjectsController.current
      }), depth );
    
    }
    
  },
  
  addObjectsOption : function( question, observer, depth ) {
    
    this.addOption( question, GameObjectsView.extend({
      observer : observer
    }), depth );
    
  },
  
  
  // selectObject : function( gameObject ) {
  //   
  //   this.get( 'action' ).set( 'gameObject', gameObject );
  //   
  // },
  // 
  // selectGraphic : function( graphic ) {
  //   
  //   this.set( 'contentView', ArtActionView.create() );
  //   this.get( 'action' ).set( 'graphic', graphic );
  //   
  // },
  
  move : function() {
  
    this.set( 'action', MoveActionModel.create() );
    
    this.addButtonOption( 
      'What type of movement?', 
      ['directional', 'move to', 'jump to', 'roam', 'swap', 'stop' ], 
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