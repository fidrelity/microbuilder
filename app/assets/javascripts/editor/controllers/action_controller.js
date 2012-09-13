/*
  ActionController
  
  - manages the creation of new Actions and Triggers
*/

var ActionController = Ember.Object.extend({

  mode : 'Action',

  action : null,
  actionCopy : null,
  
  actionIDs : [
    
    'moveInDirection', 'moveInRandom', 'moveInLocation', 'moveInObject', // 'moveInClick',
    
    'moveToLocation', 'moveToObject', // 'moveToClick',
    
    'jumpToLocation', 'jumpToObject', 'jumpToArea', // 'jumpToClick',
    
    'moveRoam', 'moveSwap', 'moveStop', 'moveAlongPath',
    
    'artToFrame', 'artPlay', 'artStop', 'artChange',
       
    'gameWin', 'gameLose',

    'counterSet', 'counterUp', 'counterDown'
    
  ],
   
  triggerIDs : [
  
    'clickObject', 'clickArea',
    
    'touchObject', 'touchArea',
    'overlapObject', 'overlapArea',
    
    'timeExact', 'timeRandom',
    
    // 'artHasFrame', 'artGetsFrame',
    // 'artHasGraphic', 'artGetsGraphic',
    
    'counterEqualsNumber', 'counterEqualsObject',
    'counterGreaterNumber', 'counterGreaterObject',
    'counterSmallerNumber', 'counterSmallerObject',
    
    'gameIsWon', 'gameWasWon',
    'gameIsLost', 'gameWasLost',
    'gameStart'
  
  ],
  
  deprecatedIDs : [
  
    // action
    'gameEnd',
    
    // trigger
    'clickSelf',
  
  ],
  
  behaviourBinding : 'App.behaviourController.current',
  
  actionOption : null,
  triggerOption : null,
  
  optionViews : null,
  
  choices : [],
  
  showSaveButton : false,
  
  init : function() {
    
    var i;
    
    for ( i = 0; i < this.actionIDs.length; i++ ) {
      
      this.choices.addObject( Choice.create({ ID : this.actionIDs[i] }) );
      
    }
    
    for ( i = 0; i < this.triggerIDs.length; i++ ) {
      
      this.choices.addObject( Choice.create({ ID : this.triggerIDs[i] }) );
      
    }
    
    this.set( 'actionOption', ButtonOption.create({ 
      name: 'action', 
      question: 'Select the type of action',
      buttons: ['move', 'art', 'counter', 'game'],
      
      decisions: [
        
        // move
        
        ButtonOption.create({ 
          name: 'move', 
          question: 'What type of movement?',
          buttons: ['directional', 'move to', 'jump to', 'roam', 'swap', 'follow path', 'stop'],
          
          decisions: [
            
            // moveIn
            
            ButtonOption.create({ 
              name: 'moveIn', 
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
                  showOthers : true,
                  
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
                  showOthers : true,
                  
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
                  showOthers : true,
                  
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

            
            // swap
            
            ObjectOption.create({ 
              name: 'moveSwap', 
              question: 'Choose the object to swap position',
              showOthers : true,
              decision: SaveOption.create({ choiceID: 'moveSwap' })
            }),


            // moveAlongPath            

            PathOption.create({
              name: 'moveAlongPath', 
              question: 'Click on the area to set the path, which the object should follow',

              child: ModeOption.create({
                  name: 'pathPlayMode',                
                  question: 'Choose the play mode',                  
                  buttons:  ['once', 'circular', 'ping-pong'],
                  modes:  ['once', 'circular', 'ping-pong'],
                  
                  decision: SpeedOption.create({ 
                    name: 'moveAlongPathSpeed', 
                    question: 'Set the speed of the animation',
                    child: SaveOption.create({ choiceID: 'moveAlongPath' })
                  })
              })

            }),
            
            // stop
            
            SaveOption.create({ choiceID: 'moveStop' })

          ]
        }),
        
        // art
        
        ButtonOption.create({ 
          name: 'art', 
          question: 'What should the art do?',
          buttons: ['to frame', 'play', 'stop', 'change'],
          
          decisions: [
            
            // to frame
            
            FrameOption.create({
              name: 'toFrame',
              question : 'Choose the frame it should display',
              decision: SaveOption.create({ choiceID: 'artToFrame' })
            }),
            
            // play
            
            FrameOption.create({
              name: 'play',
              question : 'Choose the start frame of the animation',
              
              decision: FrameOption.create({
                name: 'play2',
                mode: 'frame2',
                question : 'Choose the end frame of your animation',
                
                decision: ModeOption.create({
                  name: 'playMode',                   
                  question: 'Choose the animation mode',
                  
                  buttons:  ['loop', 'ping-pong', 'once'],
                  modes:  ['loop', 'ping-pong', 'once'], 
                  
                  decision: SpeedOption.create({ 
                    name: 'playSpeed', 
                    question: 'Set the speed of the animation',
                    child: SaveOption.create({ choiceID: 'artPlay' })
                  })
                })
              })
            }),
            
            // stop
            
            SaveOption.create({ choiceID: 'artStop' }),
            
            // change
            
            ArtOption.create({ 
              name: 'artChange', 
              question: 'Search in the libray for your graphic',
              decision: SaveOption.create({ choiceID: 'artChange' })
            })
          ]
        }),
        
        // counter
        
        ButtonOption.create({
          name: 'counter',
          question: 'Which actions should the counter perform?', 
          buttons: ['count up', 'count down', 'set to value'],
          
          decisions: [
            
            // up
            
            SaveOption.create({ choiceID: 'counterUp' }),
            
            // down
            
            SaveOption.create({ choiceID: 'counterDown' }),
            
            // set
            
            CounterOption.create({
              name: 'counterSet',
              question: 'Set counter to which value?', 
              
              child: SaveOption.create({ choiceID: 'counterSet' })
            })
           
          ]
        }),
        
        // game
        
        ButtonOption.create({ 
          name: 'game', 
          question: 'Choose what should happen to the game',
          buttons: ['win', 'lose'],
          
          decisions: [
            SaveOption.create({ choiceID: 'gameWin' }),
            SaveOption.create({ choiceID: 'gameLose' })
          ] 
        })
        
      ]
    }));
    
    this.set( 'triggerOption', ButtonOption.create({ 
      name: 'trigger', 
      question: 'Select the type of trigger',
      buttons: ['click', 'contact', 'time', 'counter', 'game'], // 'art'],
      
      decisions: [
        
        // click
        
        ButtonOption.create({
          name: 'click',
          question: 'Click on what?',
          buttons: ['object', 'area'],
          
          decisions: [
            
            // object
            
            ObjectOption.create({
              name: 'clickObject',
              question: 'Choose the object to trigger the click',
              
              decision: SaveOption.create({ choiceID: 'clickObject' })
            }),
            
            // area
            
            AreaOption.create({
              name: 'clickArea',
              question: 'Select the area to trigger the click',
              
              decision : SaveOption.create({ choiceID: 'clickArea' })
            })
            
          ]
          
        }),
        
        // contact
        
        ButtonOption.create({
          name: 'contact',
          question: 'Trigger a touch or overlapping?', 
          buttons: ['touch', 'overlap'], 
          decisions: [
            
            // touch
            
            ButtonOption.create({
              name: 'touch',
              question: 'Touches what?',
              buttons: ['object', 'area'],
              
              decisions: [
                
                // object
                
                ObjectOption.create({
                  name: 'touchObject',
                  question: 'Choose the object to trigger the touch',
                  
                  decision: SaveOption.create({ choiceID: 'touchObject' })
                }),
                
                // area
                
                AreaOption.create({
                  name: 'touchArea',
                  question: 'Select the area to trigger the touch',
                  
                  decision : SaveOption.create({ choiceID: 'touchArea' })
                })
                
              ]
            }),
            
            // overlap
            
            ButtonOption.create({
              name: 'overlap',
              question: 'Overlaps what?',
              buttons: ['object', 'area'],
              
              decisions: [
                
                // object
                
                ObjectOption.create({
                  name: 'overlapObject',
                  question: 'Choose the object to trigger the overlap',
                  
                  decision: SaveOption.create({ choiceID: 'overlapObject' })
                }),
                
                // area
                
                AreaOption.create({
                  name: 'overlapArea',
                  question: 'Select the area to trigger the overlap',
                  
                  decision : SaveOption.create({ choiceID: 'overlapArea' })
                })
                
              ]
            })
            
          ]
        }),
        
        // time
        
        ButtonOption.create({
          name: 'time',
          question: 'Trigger at an excact time or randomly in a range?', 
          buttons: ['exactly', 'randomly'], 
          
          decisions: [
            
            // exact
            
            TimeOption.create({
              name: 'timeExact',
              question: 'Drag the handle to the time in the game',
              child: SaveOption.create({ choiceID: 'timeExact' })
            }),
            
            // random
            
            TimeOption.create({
              name: 'timeRandom',
              mode: 'random',
              question: 'Drag the handles to set the time range',
              child: SaveOption.create({ choiceID: 'timeRandom' })
            })
            
          ]
        }),
        
        // counter
        
        ButtonOption.create({
          name: 'counter',
          question: 'Compare objects number to what?',
          buttons: ['a number', 'other object counter'],
          
          decisions: [
          
            // number
            
            ButtonOption.create({
              name: 'counterCompareToNumber',
              question: 'Objects number should be ...?',
              buttons: ['greater', 'smaller', 'equal'],
              
              decisions: [
                
                // greater textfield
                
                CounterOption.create({
                  name: 'counterGreaterNumber',
                  question: 'Greater to which number?', 
                  child: SaveOption.create({ choiceID: 'counterGreaterNumber' })                  
                }),

                // smaller textfield
                
                CounterOption.create({
                  name: 'counterSmallerNumber',
                  question: 'Smaller to which number?', 
                  child: SaveOption.create({ choiceID: 'counterSmallerNumber' })                  
                }),

                // smaller textfield
                
                CounterOption.create({
                  name: 'counterEqualsNumber',
                  question: 'Equal to which number?', 
                  child: SaveOption.create({ choiceID: 'counterEqualsNumber' })                  
                })
              ]
            }),
            
             // Compare to other Object number
            
            ObjectOption.create({
              name: 'counterCompareToObject',
              question: 'Choose the object to compare with:',
              
              decision: 
              
                ButtonOption.create({
                  name: 'counterCompareToObjectType',
                  question: 'Trigger, when objects number is ...?',
                  buttons: ['greater', 'smaller', 'equal'],
                  
                  decisions: [                  
                    SaveOption.create({ choiceID: 'counterGreaterObject' }),
                    SaveOption.create({ choiceID: 'counterSmallerObject' }),
                    SaveOption.create({ choiceID: 'counterEqualsObject' })
                  ]
                })             
                
            }),
            
           ]
          
        }),
        
        // game
        
        ButtonOption.create({
          name: 'game',
          question: 'Trigger which game state?', 
          buttons: ['won', 'lost'], 
          
          decisions: [
            
            // won
            
            ButtonOption.create({
              name: 'gameWon',
              question: 'Trigger which event?', 
              buttons: ['is won', 'was won'], 
              
              decisions: [
                
                SaveOption.create({ choiceID: 'gameIsWon' }),
                SaveOption.create({ choiceID: 'gameWasWon' })
                
              ]
            }),
            
            // lost
            
            ButtonOption.create({
              name: 'gameLost',
              question: 'Trigger which event?', 
              buttons: ['is lost', 'was lost'], 
              
              decisions: [
                
                SaveOption.create({ choiceID: 'gameIsLost' }),
                SaveOption.create({ choiceID: 'gameWasLost' })
                
              ]
            }),
            
            // start <hidden>
            
            SaveOption.create({ choiceID: 'gameStart' })
            
          ]
          
        })
        
      ]
    }));
  },
  
  start : function() {
    
    this.actionOption.setParents( null );
    this.triggerOption.setParents( null );
    
    this.actionOption.setChoices();
    this.triggerOption.setChoices();
    
  },
  
  reset : function( mode, action ) {
    
    mode = mode || ( action.decisions[0].name === 'action' ? 'Action' : 'Trigger' );
    
    this.set( 'action', action ? action.clone() : ActionTriggerModel.create() );
    this.set( 'actionCopy', action );
    
    this.set( 'mode', mode );
    this.set( 'showSaveButton', false );
    
    this.set( 'optionViews', Ember.ContainerView.create({
      destroy : function() {
        if ( !App.actionController.action.isSearching ) {
          this._super();
        } else {
          App.actionController.action.set( 'isSearching', false );
        }
      }
    }));
    
    if ( action ) {
      
      action.choice.option.reInsert( this.action );
      
    } else if ( mode === 'Action' ) {
      
      this.actionOption.insert( this.action );
      
    } else {
      
      this.triggerOption.insert( this.action );
      
    }
    
  },
  
  updateDepth : function( parentOption ) {
    
    var childs = this.optionViews.get( 'childViews' ),
      decisions = this.action.decisions,
      depth = decisions.indexOf( parentOption ) + 1;
    
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
  
  selectGraphic : function( graphic ) {
    
    var childs = this.optionViews.get( 'childViews' );
    
    childs[childs.length - 1].observer.decide( graphic );
    
  },
  
  getChoice : function( choiceID ) {
    
    var choice = this.choices.findProperty( 'ID', choiceID );
    
    if ( !choice ) {
      
      console.error( 'Unknow choice name: ' + choiceID );
      
    }
    
    return choice;
    
  },
  
  save : function() {
    
    if ( this.mode === 'Action' ) {
    
      this.behaviour.addAction( this.action, this.actionCopy );
    
    } else {
    
      this.behaviour.addTrigger( this.action, this.actionCopy );
    
    }
    
    App.mainView.show( 'objectsView' );
    
  }

});