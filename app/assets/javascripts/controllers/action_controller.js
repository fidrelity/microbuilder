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
  
  reset : function( mode ) {
    
    var buttons;
    
    this.set( 'mode', mode );
    
    if ( mode === 'action' ) {
    
      this.set( 'action', null );
      
      buttons = ['move', 'art', 'win', 'lose'];
    
    } else {
    
      this.set( 'trigger', null );
      
      buttons = ['click', 'contact'];
    
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
  
  addOption : function( viewClass, question ) {
    
    var questionView = this.contentView.createChildView( QuestionView.extend({ content : question }) );
    this.contentView.get( 'childViews' ).pushObject( questionView );
    
    var optionView = this.contentView.createChildView( viewClass );
    this.contentView.get( 'childViews' ).pushObject( optionView );
    
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
  
    // this.set( 'contentView', MoveActionView.create() );
    this.set( 'action', MoveActionModel.create() );
    
    this.addOption( ButtonView.extend({
      content : ['hallo']
    }), 'What the heck?' );
  
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