/*
  TriggerController
  
  - manages the creation of a new Trigger or editing
*/

var TriggerController = Ember.Object.extend({

  trigger : null,
  
  behaviourBinding : 'App.behaviourController.currentBehaviour',
  
  reset : function() {
  
    this.set( 'trigger', null );
  
  },
  
  click : function() {
    
    this.set( 'trigger', ClickTriggerModel.create() );
    
  },
  
  contact : function() {
    
    this.set( 'trigger', ContactTriggerModel.create() );
    
  },
  
  overlap : function() {
    
    this.set( 'trigger', ContactTriggerModel.create({
      
      isContact : false,
      isOverlap : true,
      
      type : 'onOverlap'
      
    }) );
    
  },
  
  selectObject : function( gameObject ) {
    
    this.get( 'trigger' ).set( 'gameObject', gameObject );
    
  },
  
  selectObject2 : function( gameObject2 ) {
    
    this.get( 'trigger' ).set( 'gameObject2', gameObject2 );
    
  },
  
  save : function() {
    
    this.get( 'behaviour' ).addTrigger( this.get( 'trigger' ) );
    
    // App.gameController.createAction();
    
    App.gameController.saveBehaviour();
    
    this.reset();
    
  }

});