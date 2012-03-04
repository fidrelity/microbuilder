var GeneralView = Ember.View.extend({
  
  templateName : 'templates_general_template',
  
  gameBinding : 'App.editorController.game',
  
  player : null,
  
  didInsertElement : function() {
    
    this.player = new Player( $( '#playerCanvas' )[0] );
    this.player.parse( this.get( 'game' ) );
  
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
  
  gameObject : null
  
});
