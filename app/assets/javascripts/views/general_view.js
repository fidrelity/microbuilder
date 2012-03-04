var GeneralView = Ember.View.extend({
  
  templateName : 'templates_general_template',
  
  gameBinding : 'App.editorController.game',
  
  didInsertElement : function() {
    
    App.editorController.setPlayerCanvas( $( '#playerCanvas' )[0] );
  
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
  
  remove : function() {
    
    var gameObject = this.get( 'gameObject' );
    
    App.gameObjectsController.removeObject( gameObject );
    App.editorController.updatePlayer();
    
  },
  
  editBehaviour : function() {
    
    var gameObject = this.get( 'gameObject' );
    
    App.editorController.editBehaviour( gameObject );
    
  }
  
});
