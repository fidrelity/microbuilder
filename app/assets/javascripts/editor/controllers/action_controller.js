/*
  ActionController
  
  - manages the creation of new Actions and Triggers
*/

var ActionController = Ember.Object.extend({

  mode : 'Action',

  action : null,
  
  actionIDs : [
    
    'moveInDirection', 'moveInRandom', 'moveInLocation', 'moveInObject', // 'moveInClick',
    
    'moveToLocation', 'moveToObject', // 'moveToClick',
    
    'jumpToLocation', 'jumpToObject', 'jumpToArea', // 'jumpToClick',
    
    'moveRoam', 'moveSwap', 'moveStop',
    
    'artToFrame', 'artPlay', 'artStop', 'artChange',
    
    // 'counterSet', 'counterUp', 'counterDown'
    
    'gameWin', 'gameLose' // 'gameEnd',
    
  ],
  
  triggerIDs : [
  
    'clickSelf', 'clickObject', 'clickArea', // 'clickStage',
    
    'touchObject', 'touchArea',
    'overlapObject', 'overlapArea',
    
    'timeExact', 'timeRandom',
    
    // 'artHasFrame', 'artToFrame',
    // 'artHasGraphic', 'artToGraphic',
    
    // 'counterEqualsNumber', 'counterEqualsObject',
    // 'counterGreaterNumber', 'counterGreaterObject',
    // 'counterSmallerNumber', 'counterSmallerObject',
    
    'gameWon', 'gameLost'
  
  ],
  
  behaviourBinding : 'App.behaviourController.current',
  
  actionOption : null,
  triggerOption : null,
  
  // options : {},
  optionViews : null,
  
  choices : [],
  
  showSaveButton : false,
  
  init : function() {
    
    var i;
    
    for ( i = 0; i < this.actionIDs.length; i++ ) {
      
      this.choices.addObject( Choice.create({ ID : this.actionIDs[i] }) );
      
    }
    
    // this.set( 'options', Ember.Object.create({
    //   
    //   'action' : ButtonOption.create({ name: 'action', decisions: ['move', 'art', 'game'], buttons: ['move', 'art', 'game'], question: 'Select the type of action' }),
    //   
    //   'move' : ButtonOption.create({ name: 'move', decisions: ['moveIn', 'moveTo', 'jumpTo', 'roam', 'swap', 'stop'], buttons: ['directional', 'move to', 'jump to', 'roam', 'swap', 'stop'], question: 'What type of movement?' }),
    //   
    //   'moveIn' : ButtonOption.create({ name: 'moveIn', setType: 'moveIn', decisions: ['moveInDirection', 'moveSpeed', 'moveInLocation', 'moveInObject'], buttons: ['in direction', 'random direction', 'to location', 'to object'], question: 'How should it move directional?' }),
    //   
    //   'moveInDirection' : DirectionOption.create({ name: 'moveInDirection', child: 'moveSpeed', question: 'Drag it to set the direction' }),
    //   'moveInLocation' : LocationOption.create({ name: 'moveInLocation', child: 'moveSpeed', question: 'Drag it to the location in which direction it should move' }),
    //   'moveInObject' : ObjectOption.create({ name: 'moveInObject', decision: 'moveSpeed', question: 'Choose the object in which direction it should move' }),
    //   
    //   'moveSpeed' : SpeedOption.create({ name: 'moveSpeed', child: 'save', question: 'Set the speed of the movement' }),
    //   
    //   'moveTo' : ButtonOption.create({ name: 'moveTo', setType: 'moveTo', decisions: ['moveToLocation', 'moveToObject'], buttons: ['to location', 'to object'], question: 'Where should it move?' }),
    //   
    //   'moveToLocation' : LocationOption.create({ name: 'moveToLocation', child: 'moveSpeed', question: 'Drag it to the location where it should move' }),
    //   'moveToObject' : ObjectOption.create({ name: 'moveToObject', decision: 'moveToOffset', question: 'Choose to which other object it should move' }),
    //   
    //   'moveToOffset' : OffsetOption.create({ name: 'moveToOffset', child: 'moveSpeed', question: 'Drag the object to define the offset' }),
    //   
    //   'jumpTo' : ButtonOption.create({ name: 'jumpTo', setType: 'jumpTo', decisions: ['jumpToLocation', 'jumpToObject', 'jumpToArea'], buttons: ['to location', 'to object', 'to area'], question: 'Where should it jump?' }),
    //   
    //   'jumpToLocation' : LocationOption.create({ name: 'jumpToLocation', child: 'save', question: 'Drag it to the location where it should jump' }),
    //   'jumpToObject' : ObjectOption.create({ name: 'jumpToObject', decision: 'jumpToOffset', question: 'Choose to which other object it should jump' }),
    //   
    //   'jumpToOffset' : OffsetOption.create({ name: 'jumpToOffset', child: 'save', question: 'Drag the object to define the offset' }),
    //   
    //   'jumpToArea' : AreaOption.create({ name: 'jumpToArea', decision: 'save', question: 'Select the area where it should randomly jump'}),
    //   
    //   'roam' : AreaOption.create({ name: 'roam', setType: 'roam', decision: 'roamMode', question: 'Select the area where it should roam in'}),
    //   'roamMode' : ButtonOption.create({ name: 'roamMode', decisions: ['roamWiggle', 'roamReflect', 'roamInsect', 'roamBounce'], buttons: ['wiggle', 'reflect', 'insect', 'bounce'], question: 'Which type of roaming?' }),
    //   
    //   'roamWiggle' : Option.create({ name: 'roamWiggle', type: 'mode', setMode: 'wiggle', child: 'moveSpeed' }),
    //   'roamReflect' : Option.create({ name: 'roamReflect', type: 'mode', setMode: 'reflect', child: 'moveSpeed' }),
    //   'roamInsect' : Option.create({ name: 'roamInsect', type: 'mode', setMode: 'insect', child: 'moveSpeed' }),
    //   'roamBounce' : Option.create({ name: 'roamBounce', type: 'mode', setMode: 'bounce', child: 'moveSpeed' }),
    //   
    //   'swap' : ObjectOption.create({ name: 'swap', setType: 'swap', decision: 'save', question: 'Choose the object to swap position' }),
    //   
    //   'stop' : Option.create({ name: 'stop', setType: 'stop', child: 'save' }),
    //   
    //   'art' : ButtonOption.create({ name: 'art', setType: 'art', decisions: ['toFrame', 'play', 'playStop', 'artChange'], buttons: ['to frame', 'play', 'stop', 'change'], question: 'What should the art do?' }),
    //   
    //   'toFrame' : FrameOption.create({ name: 'toFrame', decision: 'save', question : 'Choose the frame it should display' }),
    //   
    //   'play' : FrameOption.create({ name: 'play', decision: 'play2', question : 'Choose the start frame of the animation' }),
    //   'play2' : FrameOption.create({ name: 'play2', mode: 'frame2', decision: 'playMode', question : 'Choose the end frame of your animation' }),
    //   'playMode' : ButtonOption.create({ name: 'playMode', decisions: ['playLoop', 'playPingPong', 'playOnce'], buttons:  ['loop', 'ping-pong', 'once'], question: 'Choose the animation mode' }),
    //   
    //   'playLoop' : Option.create({ name: 'playLoop', type: 'mode', setMode: 'loop', child: 'playSpeed' }),
    //   'playPingPong' : Option.create({ name: 'playPingPong', type: 'mode', setMode: 'ping-pong', child: 'playSpeed' }),
    //   'playOnce' : Option.create({ name: 'playOnce', type: 'mode', setMode: 'once', child: 'playSpeed' }),
    //   
    //   'playSpeed' : SpeedOption.create({ name: 'playSpeed', child: 'save', question: 'Set the speed of the animation' }),
    //   
    //   'playStop' : Option.create({ name: 'playStop', child: 'save' }),
    //   
    //   'artChange' : ArtOption.create({ name: 'artChange', decision: 'save', question: 'Search in the libray for your graphic' }),
    //   
    //   'game' : ButtonOption.create({ name: 'game', decisions: ['win', 'lose'], buttons: ['win', 'lose'], question: 'Win or lose?' }),
    //   
    //   'win' : Option.create({ name: 'win', setType: 'win', child: 'save' }),
    //   'lose' : Option.create({ name: 'lose', setType: 'lose', child: 'save' }),
    //   
    //   'save' : SaveOption.create({ name: 'save' })
    //   
    // }));
    
    this.set( 'actionOption', ButtonOption.create({ 
      name: 'action', 
      question: 'Select the type of action',
      buttons: ['move'],// 'art', 'game'],
      
      decisions: [
        
        // move
        
        ButtonOption.create({ 
          name: 'move', 
          question: 'What type of movement?',
          buttons: ['directional', 'move to', 'jump to', 'roam', 'swap', 'stop'],
          
          decisions: [
            
            // moveIn
            
            ButtonOption.create({ 
              name: 'moveIn', 
              setType: 'moveIn',
              question: 'How should it move directional?',
              buttons: ['in direction', 'random direction', 'to location', 'to object'], 
              
              decisions: [
                
                DirectionOption.create({ 
                  name: 'moveInDirection',
                  question: 'Drag it to set the direction',
                  
                  child: SpeedOption.create({ 
                    name: 'moveInDirectionSpeed',
                    question: 'Set the speed of the movement',
                    child: SaveOption.create({ choiceID: 'moveInDirection' })
                  })
                }),
                
                SpeedOption.create({ 
                  name: 'moveInRandomSpeed',
                  question: 'Set the speed of the movement',
                  child: SaveOption.create({ choiceID: 'moveInRandom' })
                }),
                
                LocationOption.create({ 
                  name: 'moveInLocation', 
                  question: 'Drag it to the location in which direction it should move',
                  
                  child: SpeedOption.create({ 
                    name: 'moveInLocationSpeed',
                    question: 'Set the speed of the movement',
                    child: SaveOption.create({ choiceID: 'moveInLocation' })
                  })
                }),
                
                ObjectOption.create({ 
                  name: 'moveInObject',
                  question: 'Choose the object in which direction it should move',
                  
                  decision: SpeedOption.create({ 
                    name: 'moveInObjectSpeed',
                    question: 'Set the speed of the movement',
                    child: SaveOption.create({ choiceID: 'moveInObject' })
                  })
                })
                
              ]
            }),
            
            // moveTo
            
            ButtonOption.create({ 
              name: 'moveTo', 
              setType: 'moveTo', 
              question: 'Where should it move?',
              buttons: ['to location', 'to object'],
              
              decisions: [
                
                LocationOption.create({ 
                  name: 'moveToLocation', 
                  question: 'Drag it to the location where it should move',
                  
                  child: SpeedOption.create({ 
                    name: 'moveToLocationSpeed',
                    question: 'Set the speed of the movement',
                    child: SaveOption.create({ choiceID: 'moveToLocation' })
                  })
                }),
                
                ObjectOption.create({ 
                  name: 'moveToObject', 
                  question: 'Choose to which other object it should move',
                  
                  decision: OffsetOption.create({ 
                    name: 'moveToOffset', 
                    question: 'Drag the object to define the offset',
                    
                    child: SpeedOption.create({ 
                      name: 'moveToObjectSpeed',
                      question: 'Set the speed of the movement',
                      child: SaveOption.create({ choiceID: 'moveToObject' })
                    })
                  })
                })
                
              ]
            }),
            
            // jumpTo
            
            ButtonOption.create({ 
              name: 'jumpTo', 
              setType: 'jumpTo', 
              question: 'Where should it jump?',
              buttons: ['to location', 'to object', 'to area'],
              
              decisions: [
                
                LocationOption.create({ 
                  name: 'jumpToLocation', 
                  question: 'Drag it to the location where it should jump',
                  child: SaveOption.create({ choiceID: 'jumpToLocation' })
                }),
                
                ObjectOption.create({ 
                  name: 'jumpToObject', 
                  question: 'Choose to which other object it should jump',
                  
                  decision: OffsetOption.create({ 
                    name: 'jumpToOffset', 
                    question: 'Drag the object to define the offset',
                    child: SaveOption.create({ choiceID: 'jumpToObject' })
                  })
                }),
                
                AreaOption.create({ 
                  name: 'jumpToArea', 
                  question: 'Select the area where it should randomly jump',
                  decision: SaveOption.create({ choiceID: 'jumpToArea' })
                })
                
              ]
            }),
            
            // roam
            
            AreaOption.create({ 
              name: 'roam', 
              setType: 'roam', 
              question: 'Select the area where it should roam in',
              
              decision: ModeOption.create({ 
                name: 'roamMode', 
                question: 'Which type of roaming?',
                buttons: ['wiggle', 'reflect', 'insect', 'bounce'],
                modes: ['wiggle', 'reflect', 'insect', 'bounce'],
                
                decision: SpeedOption.create({ 
                  name: 'roamSpeed',
                  question: 'Set the speed of the movement',
                  child: SaveOption.create({ choiceID: 'moveRoam' })
                })
              })
            }),
            
            ObjectOption.create({ 
              name: 'moveSwap', 
              setType: 'swap', 
              question: 'Choose the object to swap position',
              decision: SaveOption.create({ choiceID: 'moveSwap' })
            }),
            
            Option.create({ 
              name: 'moveStop', 
              setType: 'stop', 
              child: SaveOption.create({ choiceID: 'moveStop' })
            })
            
          ]
        })
        
        // 'art',
        // 'game'
        
      ]
    }));
    
    // 'art' : ButtonOption.create({ name: 'art', setType: 'art', decisions: ['toFrame', 'play', 'playStop', 'artChange'], buttons: ['to frame', 'play', 'stop', 'change'], question: 'What should the art do?' }),
    // 
    // 'toFrame' : FrameOption.create({ name: 'toFrame', decision: 'save', question : 'Choose the frame it should display' }),
    // 
    // 'play' : FrameOption.create({ name: 'play', decision: 'play2', question : 'Choose the start frame of the animation' }),
    // 'play2' : FrameOption.create({ name: 'play2', mode: 'frame2', decision: 'playMode', question : 'Choose the end frame of your animation' }),
    // 'playMode' : ButtonOption.create({ name: 'playMode', decisions: ['playLoop', 'playPingPong', 'playOnce'], buttons:  ['loop', 'ping-pong', 'once'], question: 'Choose the animation mode' }),
    // 
    // 'playLoop' : Option.create({ name: 'playLoop', type: 'mode', setMode: 'loop', child: 'playSpeed' }),
    // 'playPingPong' : Option.create({ name: 'playPingPong', type: 'mode', setMode: 'ping-pong', child: 'playSpeed' }),
    // 'playOnce' : Option.create({ name: 'playOnce', type: 'mode', setMode: 'once', child: 'playSpeed' }),
    // 
    // 'playSpeed' : SpeedOption.create({ name: 'playSpeed', child: 'save', question: 'Set the speed of the animation' }),
    // 
    // 'playStop' : Option.create({ name: 'playStop', child: 'save' }),
    // 
    // 'artChange' : ArtOption.create({ name: 'artChange', decision: 'save', question: 'Search in the libray for your graphic' }),
    // 
    // 'game' : ButtonOption.create({ name: 'game', decisions: ['win', 'lose'], buttons: ['win', 'lose'], question: 'Win or lose?' }),
    // 
    // 'win' : Option.create({ name: 'win', setType: 'win', child: 'save' }),
    // 'lose' : Option.create({ name: 'lose', setType: 'lose', child: 'save' }),
    
  },
  
  start : function() {
    
    this.actionOption.setParents( null );
    this.actionOption.setChoices();
    
  },
  
  reset : function( mode ) {
    
    this.set( 'action', ActionTriggerModel.create() );
    
    this.set( 'mode', mode );
    this.set( 'showSaveButton', false );
    
    this.set( 'optionViews', Ember.ContainerView.create({
      destroy : function() {
        if ( App.actionController.action.type !== 'search' ) {
          this._super();
        }
      }
    }));
    
    if ( mode === 'Action' ) {
      
      this.actionOption.insert( this.action );
      
      // buttons = ['move', 'art', 'number', 'game'];
    
    } else {
      
      // buttons = ['click', 'contact', 'time', 'art', 'number', 'win/loss'];
      // question = 'Select the type of trigger';
    
    }
    
  },
  
  updateDepth : function( parentOption ) {
    
    var childs = this.optionViews.get( 'childViews' ),
      decisions = this.action.decisions,
      depth = parentOption ? decisions.indexOf( parentOption ) + 1 : 0;
    
    if ( depth === 0 ) {
      
      return;
      
    }
    
    console.log( decisions.map( function(i){ return i.name; }), parentOption.name, depth );
    
    if ( decisions.length === depth ) {
      
      return;
      
    }
    
    this.action.set( 'decisions', decisions.splice( 0, depth ) );
    
    while ( childs.length > depth * 2 ) {
      
      childs[childs.length - 1].removeFromParent();
      
      this.set( 'showSaveButton', false );
      
    }
    
  },
  
  addOption : function( question, optionView ) {
    
    this.optionViews.get( 'childViews' ).pushObject( QuestionView.create({ content : question }) );
    this.optionViews.get( 'childViews' ).pushObject( optionView );
    
  },
  
  addTimeOption : function( question, type, observer, depth ) {
    
    this.addOption( question, TimeView.create({
      observer : observer,
      type : type
    }), depth );
    
  },
  
  selectGraphic : function( graphic ) {
    
    this.options.get( 'artChange' ).decide( graphic );
    
  },
  
  click : function() {
    
    this.set( 'action', ClickTriggerModel.create() );
    
    this.addButtonOption( 
      'Click on what?', 
      ['self', 'object', 'area'], 
      this.action,
      1
    );
    
  },

  contact : function() {
    
    this.set( 'action', ContactTriggerModel.create() );
    
    this.addButtonOption( 
      'Trigger a touch or overlapping?', 
      ['touch', 'overlap'], 
      this.action,
      1
    );
    
  },
  
  time : function() {
    
    this.set( 'action', TimeTriggerModel.create() );
    
    this.addButtonOption( 
      'Trigger at an excact time or randomly in a range?', 
      ['exactly', 'randomly'], 
      this.action,
      1
    );
    
  },

  getChoice : function( choiceID ) {
    
    var choice = this.choices.findProperty( 'ID', choiceID );
    
    if ( !choice ) {
      
      console.error( 'Unknow choice name: ' + choiceID );
      
    }
    
    return choice;
    
  },

  save : function() {
    
    var action = this.get( 'action' );
    
    if ( this.mode === 'Action' ) {
    
      this.get( 'behaviour' ).addAction( action );
    
    } else {
    
      this.get( 'behaviour' ).addTrigger( action );
    
    }
    
    App.mainView.show( 'objectsView' );
    
  }

});