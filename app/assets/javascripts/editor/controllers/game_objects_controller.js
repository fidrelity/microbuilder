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
    
    this.set( 'current', this.getObject( gameObjectID ) );
    
  },
  
  createObject : function( graphic ) {
  
    var gameObject = GameObjectModel.create({
    
      name : graphic.name,
      graphic : graphic,
      position : new Vector( 
        Math.floor( ( 640 - graphic.frameWidth ) * Math.random() + graphic.frameWidth / 2 ), 
        Math.floor( ( 390 - graphic.frameHeight ) * Math.random() + graphic.frameHeight / 2 )
      )
    
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
    
    var i, gameObject = this.getObject( object.ID );
    
    this.select( gameObject );
    
    for ( i = 0; i < object.behaviours.length; i++ ) {
      
      App.behaviourController.parseBehaviour( gameObject, object.behaviours[i] );
      
    }
    
  },
  
  getObject : function( objectID ) {
    
    return this.content.findProperty( 'ID', objectID );
    
  },
  
  removeGameObject : function( gameObject ) {
    
    var obj, i, j;
    
    for ( i = 0; i < this.content.length; i++ ) {
      
      obj = this.content[i];
      
      obj.startBehaviour.removeGameObject( gameObject );
      
      for ( j = 0; j < obj.behaviours.length; j++ ) {
      
        obj.behaviours[j].removeGameObject( gameObject );
      
      }
      
    }
    
    this.removeObject( gameObject );
    
  },
  
  getMaxID : function() {
    
    return this.content.reduce( function( previousValue, item, index, enumerable ) {
      
      return { ID : Math.max( item.ID, previousValue.ID ) };
      
    }).ID;
    
  },
  
  positionChanged : function( gameObjectID, pos ) {
    
    this.getObject( gameObjectID ).position.copy( pos );
    
  },
  
  others : function() {
    
    return this.content.without( this.current );
    
  }.property( 'current' ),
  
  moveToTop : function( gameObject ) {
    
    this.removeObject( gameObject );
    this.unshiftObject( gameObject );
    
  }
  
});