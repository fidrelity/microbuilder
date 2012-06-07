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
  
  createObject : function( graphic ) {
  
    var gameObject = GameObjectModel.create({
    
      name : graphic.name,
      graphic : graphic,
      position : new Vector( Math.floor( Math.random() * 540 ), Math.floor( Math.random() * 290 ) )
    
    });
  
    this.select( gameObject );
  
    this.addObject( gameObject );
  
  },
  
  duplicateObject : function( object ) {
    
    var gameObject = object.clone();
    
    this.select( gameObject );
    
    this.addObject( gameObject );
    
  },
  
  others : function() {
    
    return this.content.without( this.current );
    
  }.property( 'current' ),
  
  moveToTop : function( gameObject ) {
    
    this.removeObject( gameObject );
    
    this.unshiftObject( gameObject );
    
  }
  
});