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

var GameObjectView = Ember.View.extend({
  
  gameObject : null,
  controller : null,
  selectFunction : null,
  
  isSelected : false,
  selectedObject : false,
  
  remove : function() {
    
    var gameObject = this.get( 'gameObject' );
    
    App.gameObjectsController.removeObject( gameObject );
    App.gameController.updatePlayer();
    
  },
  
  select : function() {
    
    if ( this.get( 'wasSelected' ) ) {
      
      return;
      
    }
    
    var selectFunction = this.get( 'selectFunction' ),
      controller = this.get( 'controller' ),
      gameObject = this.get( 'gameObject' );
    
    selectFunction.call( controller, gameObject );
    
    this.set( 'isSelected', true );
    
  },
  
  wasSelected : function() {
    
    return this.get( 'gameObject' ) === this.get( 'selectedObject' );
    
  }.property( 'selectedObject' )
  
});

var BehaviourView = Ember.View.extend({
  
  behaviour : null,
  
  remove : function() {
    
    var behaviour = this.get( 'behaviour' );
    
    App.behaviourController.removeObject( behaviour );
    App.gameController.updatePlayer();
    
  }
  
});
