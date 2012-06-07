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
  
  parseObject : function( object ) {
    
    this.addObject( GameObjectModel.create({
      
      ID : object.ID,
      name : object.name,
      graphic : App.libraryController.getGraphic( object.graphicID ),
      position : new Vector( object.position.x, object.position.y )
    
    }));
    
  },
  
  parseBehaviour : function( object ) {
    
    var i, gameObject = this.getGameObject( object.ID );
    
    this.select( gameObject );
    
    for ( i = 0; i < object.behaviours.length; i++ ) {
      
      App.behaviourController.parseBehaviour( gameObject, object.behaviours[i] );
      
    }
    
  },
  
  getGameObject : function( objectID ) {
    
    return this.content.findProperty( 'ID', objectID );
    
  },
  
  getMaxID : function() {
    
    return this.content.reduce( function( previousValue, item, index, enumerable ) {
      
      return Math.max( item.ID, previousValue.ID );
      
    }).ID;
    
  },
  
  others : function() {
    
    return this.content.without( this.current );
    
  }.property( 'current' ),
  
  moveToTop : function( gameObject ) {
    
    this.removeObject( gameObject );
    this.unshiftObject( gameObject );
    
  }
  
});