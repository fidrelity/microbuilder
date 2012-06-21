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
  
  selectID : function( gameObjectID, newPosition ) {
    
    var object = this.getObject( gameObjectID );
    
    if ( object ) {
    
      this.set( 'current', object );
      
      if ( newPosition ) {
        
        object.position.copy( newPosition );
        
      }
    
    }
    
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
    
    var bounding = object.boundingArea;
    
    if ( bounding ) {
      
      if ( bounding.radius ) {
        
        bounding = new Circle().copy( bounding );
        
      } else {
        
        bounding = new Area().copy( bounding );
        
      }
      
    }
    
    this.addObject( GameObjectModel.create({
      
      ID : object.ID,
      name : object.name,
      graphic : App.libraryController.getGraphic( object.graphicID ),
      position : new Vector( object.position.x, object.position.y ),
      boundingArea : bounding
    
    }));
    
  },
  
  parseBehaviour : function( object ) {
    
    var i, gameObject = this.getObject( object.ID );
    
    this.select( gameObject );
    
    gameObject.set( 'behaviours', [] );
    
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
  
  others : function() {
    
    return this.content.without( this.current );
    
  }.property( 'current' ),
  
  moveObject : function( pos, pos2 ) {
    
    var object = this.content[pos];
    
    this.content.removeAt( pos );
    this.content.insertAt( pos2, object );
    
  },
  
  moveToTop : function( gameObject ) {
    
    this.removeObject( gameObject );
    this.unshiftObject( gameObject );
    
  }
  
});