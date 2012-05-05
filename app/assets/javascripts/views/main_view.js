var MainView = Ember.View.extend({
  
  templateName : 'templates/main_template',
  
  gameBinding : 'App.game',
  
  stageContent : null,
  behaviourContent : null,
  
  player : null,
  
  init : function() {
    
    this._super();
    
    this.stageView = StageView.create();
    this.libraryView = LibraryView.create();
    this.paintView = PaintView.create();
    
    this.behaviourView = BehavioursView.create();
    this.actionView = ActionView.create();
    this.triggerView = TriggerView.create();
    
  },
  
  didInsertElement : function() {
    
    this.$( "#accordion" ).accordion({
      
      autoHeight: false,
      
      collapsible: true,
      
      change: function( event, ui ) {
        
        if ( ui.options.active === 0 ) {
          
          App.mainView.stageView.player.parse( App.game.getData().game );
          
        } else if ( ui.options.active === 2 ) {
          
          App.mainView.player.parse( App.game.getData().game );
          
        }
        
      }
      
    });
    
    this.show( 'stageContent', 'stageView' );
    this.show( 'behaviourContent', 'behaviourView' );
    
  },
  
  show : function( locationName, viewName ) {
    
    if ( !this.get( viewName ) ) {
      
      console.error( 'no view named ' + viewName );
      return;
      
    }
    
    if ( this.get( viewName ) !== this.get( locationName ) ) {
    
      // this.$('#' + locationName).css( 'left', 1000 ).animate({ left: 0 }, 1000);
      this.set( locationName, this.get( viewName ) );
    
    }
    
  }
  
});

var BehavioursView = Ember.View.extend({
  
  templateName : 'templates/behaviour_template',
  
  didInsertElement : function() {
    
    this.$( "#behaviours" ).sortable();
    this.$( "#behaviours" ).disableSelection();
    
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
