/*
  ActionController
  
  - manages the creation of a new Action or editing
*/

var ActionController = Ember.Object.extend({

  action : null,
  
  behaviourBinding : 'App.behaviourController.currentBehaviour',
  
  selectMoveObject : function( gameObject ) {
    
    this.get( 'action' ).set( 'gameObject', gameObject );
    
  },
  
  move : function() {
  
    this.set( 'action', MoveActionModel.create() );
  
  },
  
  jumpTo : function() {
  
    var action = this.get( 'action' );
  
    action.set( 'type', 'jumpTo' );
  
  },
  
  moveTo : function() {
  
    var action = this.get( 'action' );
  
    action.set( 'type', 'moveTo' );
  
  },
  
  moveIn : function() {
  
    var action = this.get( 'action' );
  
    action.set( 'type', 'moveIn' );
  
  },
  
  
  art : function() {
    
    this.set( 'action', ArtActionModel.create() );
    
  },
  
  win : function() {
    
    this.set( 'action', WinActionModel.create() );
    
  },
  
  lose : function() {
    
    this.set( 'action', LoseActionModel.create() );
    
  },
  
  save : function() {
    
    this.get( 'behaviour' ).addAction( this.get( 'action' ) );
    
    App.gameController.saveBehaviour();
    
    this.set( 'action', null );
    
  }

});