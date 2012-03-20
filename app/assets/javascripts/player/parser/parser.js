var Parser = {
  
  game : null,
  loader : null,
  
  parseData : function( data, game, callback ) {
    
    this.game = game;
    this.loader = new Loader( callback );
    
    if ( data.background ) {
    
      game.background = this.loader.loadImage( data.background );
    
    }
    
    if ( data.gameObjects ) {
    
      for ( var i = 0; i < data.gameObjects.length; i++ ) {
      
        var gameObject = this.parseGameObject( data.gameObjects[i] );
      
        game.gameObjects.push( gameObject );
      
      }
    
    }
    
    if ( data.behaviours ) {
      
      for ( var i = 0; i < data.behaviours.length; i++ ) {
      
        var behaviour = this.parseBehaviour( data.behaviours[i] );
      
        if ( behaviour ) {
      
          game.behaviours.push( behaviour );
        
        }
      
      }
      
    }
    
    this.loader.checkRemaining();
    
  },
  
  parseGameObject : function( gameObjectData ) {
    
    var gameObject = new GameObject( gameObjectData.ID );
  
    gameObject.startPosition.set( gameObjectData.position.x, gameObjectData.position.y );
  
    gameObject.startImage = this.loader.loadImage( gameObjectData.imagePath );
  
    return gameObject;
    
  },
  
  parseBehaviour : function( behaviourData ) {
    
    var behaviour = new Behaviour();

    for ( var i = 0; i < behaviourData.actions.length; i++ ) {
      
      var action = this.parseAction( behaviourData.actions[i] );
      
      behaviour.actions.push( action );
      
    }
    
    for ( var i = 0; i < behaviourData.triggers.length; i++ ) {
      
      var trigger = this.parseTrigger( behaviourData.triggers[i] );
      
      if ( trigger ) {
      
        behaviour.triggers.push( trigger );
      
      } else {
        
        this.game.startActions = behaviour.actions;
        return null;
        
      }
      
    }
    
    return behaviour;
    
  },
  
  parseAction : function( actionData ) {
    
    switch ( actionData.type ) {
      
      case 'jumpTo' : return this.parseActionJumpTo( actionData );
      
    }
    
  },
  
  parseActionJumpTo : function( actionData ) {
    
    var action = new JumpToAction();
    
    action.gameObject = this.game.getGameObjectWithID( actionData.gameObjectID );
    
    action.position = new Vector( actionData.position.x, actionData.position.y );
    
    return action;
    
  },
  
  parseTrigger : function( triggerData ) {
    
    var trigger = new Trigger();
    
    switch ( triggerData.type ) {
      
      case 'onStart' : return null;
      
    }
    
    return trigger;
    
  }
  
};