var MainView = Ember.View.extend({
  
  templateName : 'templates/main_template',
  
  gameBinding : 'App.game',
  
  editorContent : null,
  overlayContent : null,
  
  player : null,
  
  init : function() {
    
    this._super();
    
    this.stageView = StageView.create();
    this.paintView = PaintView.create();
    
    this.libraryView = LibraryView.create();
    this.objectsView = ObjectsView.create();
    this.behaviourView = BehavioursView.create();
    
    this.actionView = ActionView.create();
    this.triggerView = TriggerView.create();
    
    // this.paintSizeView = PaintSizeView.create();
    
  },
  
  didInsertElement : function() {
    
    this.show( 'editorContent', 'stageView' );
    // this.show( 'overlayContent', 'libraryView' );
    
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
  
  showStage : function() {
    
    this.show( 'editorContent', 'stageView' );
    
  },
  
  showPaint : function() {
    
    this.show( 'editorContent', 'paintView' );
    
  },
  
  hideOverlay : function() {
    
    this.set( 'overlayContent', null );
    
  }
  
});

var BehavioursView = Ember.View.extend({
  
  templateName : 'templates/behaviour_template',
  
  didInsertElement : function() {
    
    // this.$( "#behaviours" ).sortable();
    // this.$( "#behaviours" ).disableSelection();
    
  },
  
});


var RemoveView = Ember.View.extend({

  content : null,
  controller : null,
  
  remove : function() {
    
    this.get( 'controller' ).removeObject( this.get( 'content' ) );
    
  },

});

var SelectView = RemoveView.extend({
  
  compareContent : null,
  
  selectFunction : null,
  
  isSelected : false,
  
  select : function() {
    
    if ( !this.get( 'compares' ) ) {
      
      var selectFunction = this.get( 'selectFunction' ),
        controller = this.get( 'controller' ),
        content = this.get( 'content' );
      
      selectFunction.call( controller, content );
      
      this.set( 'isSelected', true );
      
    }
    
  },
  
  compares : function() {
    
    return this.get( 'content' ) === this.get( 'compareContent' );
    
  }.property( 'compareContent' )
  
});

var BehaviourView = SelectView.extend({
  
  addTrigger : function() {
    
    App.behaviourController.set( 'currentBehaviour', this.get( 'content' ) );
    App.gameController.addTrigger();
    
  },
  
  addAction : function() {
    
    App.behaviourController.set( 'currentBehaviour', this.get( 'content' ) );
    App.gameController.addAction();
    
  }
  
});
