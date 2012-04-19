/*
  TriggerController
  
  - manages the creation of a new Trigger or editing
*/

var TriggerController = Ember.Object.extend({

  trigger : null,
  
  behaviourBinding : 'App.behaviourController.currentBehaviour',
  
  contentView : null,
  
  reset : function() {
  
    this.set( 'trigger', null );
  
  },
  
  click : function() {
    
    this.set( 'contentView', TriggerTypeView.create({ templateName : 'templates_trigger_click_template' }));
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
    
    var trigger = this.get( 'trigger' );
    
    if ( trigger.get( 'isComplete' ) ) {
    
      this.get( 'behaviour' ).addTrigger( trigger );
    
      App.gameController.saveBehaviour();
    
      this.reset();
    
    }
    
  }

});