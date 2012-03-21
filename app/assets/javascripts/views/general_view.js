var GeneralView = Ember.View.extend({
  
  templateName : 'templates_general_template',
  
  gameBinding : 'App.gameController.game',
  
  didInsertElement : function() {
    
    App.gameController.setPlayerCanvas( $( '#playerCanvas' )[0] );
  
  }
  
});


var TextInputView = Ember.TextField.extend({
  
  text : null,
  
  insertNewline: function() {
    
    var value = this.get('value');
    
    if ( value ) {
      
      this.set('text', value);
      
    }
    
  }
  
});

var SelectView = Ember.View.extend({
  
  content : null,
  compareContent : null,
  
  controller : null,
  selectFunction : null,
  
  isSelected : false,
  
  remove : function() {
    
    this.get( 'controller' ).removeObject( this.get( 'content' ) );
    App.gameController.updatePlayer();
    
  },
  
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
