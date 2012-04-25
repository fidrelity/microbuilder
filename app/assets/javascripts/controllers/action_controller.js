/*
  ActionController
  
  - manages the creation of a new Action or editing
*/

var ActionController = Ember.Object.extend({

  action : null,
  
  behaviourBinding : 'App.behaviourController.currentBehaviour',
  
  contentView : null,
  
  reset : function() {
    
    this.set( 'action', null );
    
  },
  
  selectObject : function( gameObject ) {
    
    this.get( 'action' ).set( 'gameObject', gameObject );
    
  },
  
  selectGraphic : function( graphic ) {
    
    this.set( 'contentView', ArtActionView.create() );
    this.get( 'action' ).set( 'graphic', graphic );
    
  },
  
  move : function() {
  
    this.set( 'contentView', MoveActionView.create() );
    this.set( 'action', MoveActionModel.create() );
  
  },
  
  art : function() {
    
    this.set( 'contentView', ArtActionView.create() );
    this.set( 'action', ArtActionModel.create() );
    
  },
  
  win : function() {
    
    this.set( 'action', WinActionModel.create() );
    
  },
  
  lose : function() {
    
    this.set( 'action', LoseActionModel.create() );
    
  },
  
  save : function() {
    
    var action = this.get( 'action' );
    
    if ( action.get( 'isComplete' ) ) {
    
      this.get( 'behaviour' ).addAction( action );
    
      App.gameController.cancel();
    
    }
    
  }

});