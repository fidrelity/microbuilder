var Parser = {
  
  game : null,
  loader : null,


  // ------------------------

  //      ACTIONS

  // ------------------------
  
  actionIDs : {
    
    moveInDirection : function( data, gameObject ) { 
      
      var action = new MoveAction( 'moveIn', gameObject, data.speed, data.rotateToTarget);
      
      action.direction = data.angle;
          
      return action;
      
    },
      
    moveInRandom : function( data, gameObject ) { 
      
      var action = new MoveAction( 'moveIn', gameObject, data.speed, data.rotateToTarget );
      
      action.random = true;
      
      return action;
      
    },
    
    moveInLocation : function( data, gameObject ) { 
      
      var action = new MoveAction( 'moveIn', gameObject, data.speed, data.rotateToTarget );
      
      action.target = new Vector().copy( data.location );
      
      return action;
      
    },
    
    moveInObject : function( data, gameObject, game ) { 
      
      var action = new MoveAction( 'moveIn', gameObject, data.speed );
      
      action.target = game.getGameObjectWithID( data.objectID ).movement.position;
      
      return action;
      
    },
    
    // 'moveInClick',
    
    
    moveToLocation : function( data, gameObject ) { 
      
      var action = new MoveAction( 'moveTo', gameObject, data.speed, data.rotateToTarget );
      
      action.target = new Vector().copy( data.location );
      
      return action;
      
    },

    // Move along path action
    moveAlongPath: function( data, gameObject, game ) {
      
      var action = new MoveAction( 'moveAlongPath', gameObject, data.speed, data.rotateToTarget );

      action.path = data.path;
      action.mode = data.mode;

      return action;

    },
    
    moveToObject : function( data, gameObject, game ) { 
      
      var action = new MoveAction( 'moveTo', gameObject, data.speed, data.rotateToTarget );
      
      action.target = game.getGameObjectWithID( data.objectID ).movement.position;
      action.offset = new Vector().copy( data.offset );
      
      return action;
      
    },
    
    // 'moveToClick',
    
    
    jumpToLocation : function( data, gameObject ) { 
      
      var action = new MoveAction( 'jumpTo', gameObject );
      
      action.target = new Vector().copy( data.location );
      
      return action;
      
    },
    
    jumpToObject : function( data, gameObject, game ) { 
      
      var action = new MoveAction( 'jumpTo', gameObject );
      
      action.target = game.getGameObjectWithID( data.objectID ).movement.position;
      action.offset = new Vector().copy( data.offset );
      
      return action;
      
    },
    
    jumpToArea : function( data, gameObject ) { 
      
      var action = new MoveAction( 'jumpTo', gameObject );
      
      action.area = new Area().copy( data.area );
      
      return action;
      
    },
    
    // 'jumpToClick',
    
    
    moveRoam : function( data, gameObject ) {
      
      return new RoamAction( gameObject, data.mode, new Area().copy( data.area ), data.speed );
      
    },
    
    moveSwap : function( data, gameObject, game ) {
      
      return new SwapAction( gameObject, game.getGameObjectWithID( data.objectID ) );
      
    },
    
    moveStop : function( data, gameObject ) {
      
      return new StopAction( gameObject );
      
    },
    
    
    artToFrame : function( data, gameObject ) {
      
      return new ArtAction( 'frame', gameObject, data.frame );
      
    },
    
    artPlay : function( data, gameObject ) {
      
      return new ArtAction( 'play', gameObject, data.frame, data.frame2, data.mode, data.speed );
      
    },
    
    artStop : function( data, gameObject ) {
      
      return new ArtAction( 'stop', gameObject );
      
    },
    
    artChange : function( data, gameObject, game ) {
      
      var action = new ArtAction( 'change', gameObject );
      
      action.graphic = game.getGraphicWithID( data.graphicID );
      
      return action
      
    },
        
    
    gameWin : function() { return WinAction; },
    gameLose : function() { return LoseAction; },
    gameEnd : function() { return EndAction; },


    // -- Counter Action --

    counterSet : function(data, gameObject, game) { 

      return action = new CounterAction( 'set', data, gameObject );
      
    },

    counterUp : function(data, gameObject) { 

      return action = new CounterAction( 'up',  data, gameObject );

    },


    counterDown : function(data, gameObject) { 

      return action = new CounterAction( 'down', data, gameObject );

    }
    
  },



  // ------------------------

  //      TRIGGERS

  // ------------------------
  
  triggerIDs : {
    
    clickSelf : function( data, gameObject ) {
      
      return new ClickTrigger( gameObject );
      
    },
    
    clickObject : function( data, gameObject, game ) {
      
      return new ClickTrigger( game.getGameObjectWithID( data.objectID ) );
      
    },
    
    clickArea : function( data ) {
      
      return new ClickTrigger( null, new Area().copy( data.area ) );
      
    },
    
    // 'clickStage',
    
    
    touchObject : function( data, gameObject, game ) {
      
      return new ContactTrigger( 'touch', gameObject, game.getGameObjectWithID( data.objectID ) );
      
    },
    
    touchArea : function( data, gameObject ) {
      
      return new ContactTrigger( 'touch', gameObject, null, new Area().copy( data.area ) );
      
    },
    
    overlapObject : function( data, gameObject, game ) {
      
      return new ContactTrigger( 'overlap', gameObject, game.getGameObjectWithID( data.objectID ) );
      
    },
    
    overlapArea : function( data, gameObject ) {
      
      return new ContactTrigger( 'overlap', gameObject, null, new Area().copy( data.area ) );
      
    },
    
    
    timeExact : function( data ) {
      
      return new TimeTrigger( data.time );
      
    },
    
    timeRandom : function( data ) {
      
      return new TimeTrigger( data.time, data.time2 );
      
    },
    
    // 'artHasFrame', 'artGetsFrame',
    // 'artHasGraphic', 'artGetsGraphic',
    
    // 'counterEqualsNumber', 'counterEqualsObject',
    // 'counterGreaterNumber', 'counterGreaterObject',
    // 'counterSmallerNumber', 'counterSmallerObject',

    counterEqualsObject : function(data, gameObject, game) { 

      return new CounterTrigger("equal", gameObject, null, game.getGameObjectWithID( data.objectID ));

    },

    counterGreaterObject : function(data, gameObject, game) { 

      return new CounterTrigger("greater", gameObject, null, game.getGameObjectWithID( data.objectID ));

    },

    counterSmallerObject : function(data, gameObject, game) { 

      return new CounterTrigger("smaller", gameObject, null, game.getGameObjectWithID( data.objectID ));

    },

    // -- Number --
    
    counterEqualsNumber : function(data, gameObject, game) { 

      return new CounterTrigger("equal", gameObject, data.counter, null);

    },

    counterGreaterNumber : function(data, gameObject, game) { 

      return new CounterTrigger("greater", gameObject, data.counter, null);

    },

    counterSmallerNumber : function(data, gameObject, game) {

      return new CounterTrigger("smaller", gameObject, data.counter, null);

    },


    // -- Game --
    
    gameIsWon : function() { return new EndTrigger( 'isWon' ); },
    gameWasWon : function() { return WonTrigger; },
    
    gameIsLost : function() { return new EndTrigger( 'isLost' );; },
    gameWasLost : function() { return LostTrigger; },
    
    gameStart : function() { return 'start'; },
    
  },
  
  parseData : function( data, game, callback, corsSave ) {
    
    var graphics = data.graphics,
      gameObjects = data.gameObjects,
      behaviours, gameObject, i, j;
    
    this.game = game;
    this.loader = new Loader( callback );
    this.loader.corsSave = corsSave;
    
    game.duration = ( data.duration || 5 ) * 1000;
    
    if ( graphics && graphics.length > 0 ) {
      
      for ( i = 0; i < graphics.length; i++ ) {
        
        var graphic = this.parseGraphic( graphics[i] );
        
        game.graphics.push( graphic );
        
      }
      
    } else {
      
      // console.error( 'parser: game has no graphics' );
      
    }
    
    
    if ( gameObjects && gameObjects.length > 0 ) {
      
      for ( i = 0; i < gameObjects.length; i++ ) {
        
        gameObject = this.parseGameObject( gameObjects[i] );
        
        game.gameObjects.push( gameObject );
        
      }
      
      for ( i = 0; i < gameObjects.length; i++ ) {
        
        behaviours = gameObjects[i].behaviours;
        gameObject = game.gameObjects[i];
        
        if ( behaviours && behaviours.length > 0 ) {
          
          for ( j = 0; j < behaviours.length; j++ ) {
            
            var behaviour = this.parseBehaviour( behaviours[j], gameObject );
            
            if ( behaviour ) {
              
              this.game.behaviours.push( behaviour );
              
            }
            
          }
          
        } else {
          
          // console.error( 'parser: game has no behaviours' );
          
        }
        
      }
      
    } else {
      
      // console.error( 'parser: game has no gameObjects' );
      
    }
    
    
    if ( data.backgroundID ) {
      
      game.background = game.getGraphicWithID( data.backgroundID ).image;
      
    } else {
      
      // console.error( 'parser: game has no background' );
      
    }
    
    this.loader.checkRemaining();
    
  },
  
  parseGraphic : function( data ) {
    
    var graphic = new Graphic( data.ID );
    
    graphic.frameWidth = data.frameWidth;
    graphic.frameHeight = data.frameHeight;
    
    graphic.frameCount = data.frameCount || 1;
    graphic.image = this.loader.loadImage( data.url, function() {
      
      graphic.checkSize();
      
    });
    
    return graphic;
    
  },
  
  parseGameObject : function( data ) {
    
    var gameObject = new GameObject( data.ID );
    
    gameObject.movement.startPosition.copy( data.position );
    
    gameObject.setStartGraphic( this.game.getGraphicWithID( data.graphicID ) );
    
    if ( data.boundingArea ) {
      
      if ( data.boundingArea.width ) {
        
        gameObject.movement.boundingArea = new Area().copy( data.boundingArea );
        
      } else if ( data.boundingArea.radius ) {
        
        gameObject.movement.boundingArea = new Circle().copy( data.boundingArea );
        gameObject.movement.area = new Circle();
        
      }
      
    }
    
    return gameObject;
    
  },
  
  parseBehaviour : function( data, gameObject ) {
    
    var behaviour = new Behaviour(),
      actions = data.actions,
      triggers = data.triggers,
      game = this.game,
      action, trigger, i;
    
    if ( actions && actions.length > 0 ) {
      
      for ( i = 0; i < actions.length; i++ ) {
        
        action = this.parseAction( actions[i], gameObject, game );
        
        if ( action ) {
          
          behaviour.actions.push( action );
          
        }
        
      }
      
    } else {
      
      console.error( 'parser: behaviour has no actions' );
      return null;
      
    }
    
    
    if ( triggers && triggers.length > 0 ) {
      
      for ( i = 0; i < triggers.length; i++ ) {
        
        trigger = this.parseTrigger( triggers[i], gameObject, game );
        
        if ( trigger === 'start' ) {
          
          game.startActions = game.startActions.concat( behaviour.actions );
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
  
  parseAction : function( data, gameObject, game ) {
    
    var parseFunc = this.actionIDs[ data.ID ];
    
    if ( !parseFunc ) {
      
      console.error( 'parser: no action with ID: ' + data.ID );
      return null;
      
    }
    
    return parseFunc( data, gameObject, game );
    
  },
  
  parseTrigger : function( data, gameObject, game ) {
    
    var parseFunc = this.triggerIDs[ data.ID ];
    
    if ( !parseFunc ) {
      
      console.error( 'parser: no trigger with ID: ' + data.ID );
      return null;
      
    }
    
    return parseFunc( data, gameObject, game );
    
  }

};