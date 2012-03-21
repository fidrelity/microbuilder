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
      
      // this.set('value', '');
      this.set('text', value);
      
    }
    
  }
  
});

var SelectView = Ember.View.extend({
  
  content : null,
  compareContent : null,
  
  selector : null,
  selectFunction : null,
  
  isSelected : false,
  
  remove : function() {
    
    var content = this.get( 'content' );
    
    App.gameObjectsController.removeObject( content );
    App.gameController.updatePlayer();
    
  },
  
  select : function() {
    
    if ( this.get( 'compares' ) ) {
      
      return;
      
    }
    
    var selectFunction = this.get( 'selectFunction' ),
      selector = this.get( 'selector' ),
      content = this.get( 'content' );
    
    selectFunction.call( selector, content );
    
    this.set( 'isSelected', true );
    
  },
  
  compares : function() {
    
    return this.get( 'content' ) === this.get( 'compareContent' );
    
  }.property( 'compareContent' )
  
});

var BehaviourView = Ember.View.extend({
  
  behaviour : null,
  
  remove : function() {
    
    var behaviour = this.get( 'behaviour' );
    
    App.behaviourController.removeObject( behaviour );
    App.gameController.updatePlayer();
    
  }
  
});
