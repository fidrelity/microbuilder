var MainView = Ember.View.extend({
  
  templateName : 'editor/templates/main_template',
  
  gameBinding : 'App.game',
  
  editorContent : null,
  overlayContent : null,
  
  player : null,
  
  init : function() {
    
    this._super();
    
    this.stageView = StageView.create();
    
    this.libraryView = Ember.View.create({
      heading : 'Library',
      templateName : 'editor/templates/library_template'
    });
    
    this.objectsView = Ember.View.create({
      heading : 'Objects & Behaviour',
      templateName : 'editor/templates/objects_template'
    });
    
    this.actionView = ActionView.create();
    
    this.publishView = Ember.View.create({
      templateName : 'editor/templates/publish_template'
    });
    
  },
  
  didInsertElement : function() {
    
    this.show( 'editorContent', 'stageView' );
    
  },
  
  show : function( locationName, viewName ) {
    
    if ( !this.get( viewName ) ) {
      
      console.error( 'no view named ' + viewName );
      return;
      
    }
    
    if ( this.get( viewName ) !== this.get( locationName ) ) {
    
      this.set( locationName, this.get( viewName ) );
    
    }
    
  },
  
  hideOverlay : function() {
    
    this.set( 'overlayContent', null );
    this.stageView.updatePlayer();
    
  }
  
});

var RemoveView = Ember.View.extend({

  content : null,
  controller : null,
  
  remove : function() {
    
    this.get( 'controller' ).removeObject( this.get( 'content' ) );
    
  },

});

var SelectView = RemoveView.extend({
  
  selectFunction : null,
  
  collection : null,
  
  select : function() {
    
    this.selectFunction.call( this.controller, this.content );
    
  }
  
});

var BehaviourView = SelectView.extend({
  
  addTrigger : function() {
    
    App.behaviourController.set( 'current', this.get( 'content' ) );
    App.gameController.addTrigger();
    
  },
  
  addAction : function() {
    
    App.behaviourController.set( 'current', this.get( 'content' ) );
    App.gameController.addAction();
    
  },
  
  duplicate : function() {
    
    App.behaviourController.duplicateBehaviour( this.content );
    App.mainView.stageView.updatePlayer();
    
  }
  
});
