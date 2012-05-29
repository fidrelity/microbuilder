/*
  ActionController
  
  - manages the creation of a new Action or editing
*/

var ActionController = Ember.Object.extend({

  mode : 'action',

  action : null,
  trigger : null,
  
  behaviourBinding : 'App.behaviourController.currentBehaviour',
  
  contentView : null,
  
  optionDepth : 0,
  
  reset : function( mode ) {
    
    var buttons;
    
    this.set( 'mode', mode );
    this.set( 'optionDepth', 0 );
    
    if ( mode === 'action' ) {
    
      this.set( 'action', null );
      
      buttons = ['move', 'art', 'number', 'win/lose'];
    
    } else {
    
      this.set( 'trigger', null );
      
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
      
      console.log( 'unknown action name: ' + name );
      
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
      
    }
    
    this.set( 'optionDepth', depth );
    
    var questionView = this.contentView.createChildView( QuestionView.extend({ content : question }) );
    childViews.pushObject( questionView );
    
    var optionView = this.contentView.createChildView( viewClass );
    childViews.pushObject( optionView );
    
    console.log(childViews);
    
  },
  
  addButtonOption : function( question, buttons, observer, depth ) {
    
    this.addOption( question, ButtonView.extend({
      observer : observer,
      content : buttons
    }), depth);
    
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
  // 
  // win : function() {
  //   
  //   this.set( 'action', WinActionModel.create() );
  //   
  // },
  // 
  // lose : function() {
  //   
  //   this.set( 'action', LoseActionModel.create() );
  //   
  // },
  // 
  // save : function() {
  //   
  //   var action = this.get( 'action' );
  //   
  //   if ( action.get( 'isComplete' ) ) {
  //   
  //     this.get( 'behaviour' ).addAction( action );
  //   
  //     App.mainView.show( 'overlayContent', 'objectsView' );
  //   
  //   }
  //   
  // }

});