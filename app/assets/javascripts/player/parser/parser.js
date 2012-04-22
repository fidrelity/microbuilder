var Parser = {
  
  game : null,
  loader : null,
  
  parseData : function( data, game, callback ) {
    
    var graphics = data.graphics,
      gameObjects = data.gameObjects,
      behaviours = data.behaviours;
    
    this.game = game;
    this.loader = new Loader( callback );
    
    game.duration = ( data.duration || 5 ) * 1000;
    
    if ( data.background ) {
    
      game.background = this.loader.loadImage( data.background );
    
    } else {
      
      // console.error( 'parser: game has no background' );
      
    }
    
    if ( graphics && graphics.length > 0 ) {
    
      for ( var i = 0; i < graphics.length; i++ ) {
      
        var graphic = this.parseGraphic( graphics[i] );
      
        game.graphics.push( graphic );
      
      }
    
    } else {
      
      // console.error( 'parser: game has no graphics' );
      
    }
    
    if ( gameObjects && gameObjects.length > 0 ) {
    
      for ( var i = 0; i < gameObjects.length; i++ ) {
      
        var gameObject = this.parseGameObject( gameObjects[i] );
      
        game.gameObjects.push( gameObject );
      
      }
    
    } else {
      
      // console.error( 'parser: game has no gameObjects' );
      
    }
    
    
    if ( behaviours && behaviours.length > 0 ) {
      
      for ( var i = 0; i < behaviours.length; i++ ) {
      
        var behaviour = this.parseBehaviour( behaviours[i] );
      
        if ( behaviour ) {
      
          game.behaviours.push( behaviour );
        
        }
      
      }
      
    } else {
      
      // console.error( 'parser: game has no behaviours' );
      
    }
    
    this.loader.checkRemaining();
    
  },


/**
  {
    ID : 1,
    frameCount : 3,
    imagePath : '/image.png'
  }
*/

  parseGraphic : function( graphicData ) {
    
    var graphic = new Graphic( graphicData.ID );
  
    graphic.frameCount = graphicData.frameCount;
  
    graphic.image = this.loader.loadImage( graphicData.imagePath );
  
    return graphic;
  
  },

/**
  {
    ID: 1,
    name:"Raidel",
    graphicID: 1,
    position: {
      x:220,
      y:228
    }
  }
*/

  parseGameObject : function( gameObjectData ) {
    
    var gameObject = new GameObject( gameObjectData.ID );
  
    gameObject.startPosition.set( gameObjectData.position.x, gameObjectData.position.y );
  
    gameObject.startGraphic = this.game.getGraphicWithID( gameObjectData.graphicID );
  
    return gameObject;
  
  },
  
  parseBehaviour : function( behaviourData ) {
    
    var behaviour = new Behaviour(),
      actions = behaviourData.actions,
      triggers = behaviourData.triggers;

    if ( actions && actions.length > 0 ) {

      for ( var i = 0; i < actions.length; i++ ) {
      
        var action = this.parseAction( actions[i] );
      
        behaviour.actions.push( action );
      
      }
    
    } else {
      
      console.error( 'parser: behaviour has no actions' );
      return null;
      
    }
    
    
    if ( triggers && triggers.length > 0 ) {
    
      for ( var i = 0; i < triggers.length; i++ ) {
      
        var trigger = this.parseTrigger( triggers[i] );
      
        if ( trigger === 'onStart' ) {
      
          this.game.startActions = behaviour.actions;
          return null;
      
        } else if ( trigger ) {
        
          behaviour.triggers.push( trigger );
        
        }
      
      }
    
    } else {
      
      console.error( 'parser: behaviour has no triggers' );
      return null;
      
    }
    
    return behaviour;
    
  },
  
  parseAction : function( actionData ) {
    
    switch ( actionData.type ) {
      
      case 'jumpTo' : return this.parseActionJumpTo( actionData );
      case 'moveTo' : return this.parseActionMoveTo( actionData );
      case 'moveIn' : return this.parseActionMoveIn( actionData );
      
      case 'changeArt' : return this.parseActionChangeArt( actionData );
      
      case 'win' : return WinAction;
      case 'lose' : return LoseAction;
      
      default : console.error( 'parser: action type ' + actionData.type + ' not found' ); return null;
      
    }
    
  },


/**
  {
    type: "jumpTo",
    objectID: 0,
    target:{
      x:0,
      y:0
    }
  }

  {
    type: "jumpTo",
    objectID: 0,
    targetID: 1
  }
*/

  parseActionJumpTo : function( actionData ) {
    
    var action = new MoveAction();
    
    action.execute = action.executeJumpTo;
    
    action.gameObject = this.game.getGameObjectWithID( actionData.objectID );
    
    if ( typeof actionData.targetID !== "undefined" ) {
    
      action.target = this.game.getGameObjectWithID( actionData.targetID ).position;
    
    } else {
    
      action.target = new Vector( actionData.target.x, actionData.target.y );
    
    }
    
    return action;
    
  },


/**
  {
    type: "moveTo",
    objectID: 0,
    target:{
      x:0,
      y:0
    }
  }

  {
    type: "moveTo",
    objectID: 0,
    targetID: 1
  }
*/

  parseActionMoveTo : function( actionData ) {
    
    var action = new MoveAction();
    
    action.execute = action.executeMoveTo;
    
    action.gameObject = this.game.getGameObjectWithID( actionData.objectID );
    
    if ( typeof actionData.targetID !== "undefined" ) {
    
      action.target = this.game.getGameObjectWithID( actionData.targetID ).position;
    
    } else {
    
      action.target = new Vector( actionData.target.x, actionData.target.y );
    
    }
    
    return action;
    
  },


/**
  {
    type: "moveIn",
    objectID: 0,
    angle: 0
  }
*/

  parseActionMoveIn : function( actionData ) {
    
    var action = new MoveAction();
    
    action.execute = action.executeMoveTo;
    
    action.gameObject = this.game.getGameObjectWithID( actionData.objectID );
    
    action.target = new Vector( 1e10, 0 ).rotateSelf( actionData.angle );
    
    return action;
    
  },
  
  
/**
  {
    type: "changeArt",
    objectID: 0,
    graphicID: 1
  }
*/
  
  parseActionChangeArt : function( actionData ) {
    
    var action = new ArtAction();
    
    action.gameObject = this.game.getGameObjectWithID( actionData.objectID );
    
    action.graphic = this.game.getGraphicWithID( actionData.graphicID );
    
    return action;
    
  },
  
  
  parseTrigger : function( triggerData ) {
    
    switch ( triggerData.type ) {
      
      case 'onStart' : return 'onStart';
      
      case 'onClick' : return this.parseTriggerClick( triggerData );
      case 'onContact' : return this.parseTriggerContact( triggerData, true );
      case 'onOverlap' : return this.parseTriggerContact( triggerData, false );
      
      default : console.error( 'parser: trigger type ' + triggerData.type + ' not found' ); return null;
      
    }
    
  },
  
  
/**
  {
    type: "onClick",
    objectID: 0
  }
  
  {
    type: "onClick",
    area: {
      x: 48,
      y:6,
      width:331,
      height:123
    }
  }
*/

  parseTriggerClick : function( triggerData ) {
    
    var trigger = new ClickTrigger();
    
    if ( triggerData.area ) {
    
      trigger.area = new Area().copy( triggerData.area );
    
    } else {
      
      trigger.gameObject = this.game.getGameObjectWithID( triggerData.objectID );
      
    }
    
    return trigger;
    
  },


/**
  {
    type: "onContact",
    objectID: 1,
    object2ID: 0
  }
  
  {
    type: "onContact",
    objectID: 0,
    area: {
      x: -44,
      y: -33,
      width: 160,
      height: 395
    }
  }

  {
    type: "onOverlap",
    objectID: 1,
    object2ID: 0
  }
  
  {
    type: "onOverlap",
    objectID: 1,
    area: {
      x: 93, 
      y: 165,
      width: 475,
      height: 133
    }
  }
*/

  parseTriggerContact : function( triggerData, onContact ) {
    
    var trigger = new ContactTrigger();
    
    trigger.check = onContact ? trigger.checkContact : trigger.checkOverlap;
    
    if ( triggerData.area ) {
    
      trigger.area = new Area().copy( triggerData.area );
    
    } else {
      
      trigger.gameObject2 = this.game.getGameObjectWithID( triggerData.object2ID );
      
    }
    
    trigger.gameObject = this.game.getGameObjectWithID( triggerData.objectID );
    
    return trigger;
    
  }

};