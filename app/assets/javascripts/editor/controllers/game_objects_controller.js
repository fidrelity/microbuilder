/*
  GameObjectsController
  
  - manages the GameObjects of the GameModel
*/

var GameObjectsController = Ember.ArrayController.extend({

  contentBinding : "App.game.gameObjects",
  
  current : null,
  
  select : function( gameObject ) {
    
    this.set( 'current', gameObject );
    
  },
  
  selectID : function( gameObjectID ) {
    
    this.set( 'current', App.game.getGameObjectWithID( gameObjectID ) );
    
  },
  
  others : function() {
    
    return this.content.without( this.current );
    
  }.property( 'current' ),
  
  moveToTop : function( gameObject ) {
    
    this.removeObject( gameObject );
    
    this.unshiftObject( gameObject );
    
  }
  
});