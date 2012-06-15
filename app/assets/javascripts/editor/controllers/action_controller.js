/*
  ActionController
  
  - manages the creation of new Actions and Triggers
*/

var ActionController = Ember.Object.extend({

  mode : 'Action',

  action : null,
  
  behaviourBinding : 'App.behaviourController.current',
  
  optionViews : null,
  
  showSaveButton : false,
  
  options : {},
  
  init : function() {
    
    this.set( 'options', Ember.Object.create({
      
      'action' : ButtonOption.create({ name: 'action', decisions: ['move', 'art', 'game'], buttons: ['move', 'art', 'game'], question: 'Select the type of action' }),
      
      'move' : ButtonOption.create({ name: 'move', decisions: ['moveIn', 'moveTo', 'jumpTo', 'roam', 'swap', 'stop'], buttons: ['directional', 'move to', 'jump to', 'roam', 'swap', 'stop'], question: 'What type of movement?' }),
      
      'moveIn' : ButtonOption.create({ name: 'moveIn', setType: 'moveIn', decisions: ['moveInDirection', 'moveSpeed', 'moveInLocation', 'moveInObject'], buttons: ['in direction', 'random direction', 'to location', 'to object'], question: 'How should it move directional?' }),
      
      'moveInDirection' : DirectionOption.create({ name: 'moveInDirection', child: 'moveSpeed', question: 'Drag it to set the direction' }),
      'moveInLocation' : LocationOption.create({ name: 'moveInLocation', child: 'moveSpeed', question: 'Drag it to the location in which direction it should move' }),
      'moveInObject' : ObjectOption.create({ name: 'moveInObject', decision: 'moveSpeed', question: 'Choose the object in which direction it should move' }),
      
      'moveSpeed' : SpeedOption.create({ name: 'moveSpeed', child: 'save', question: 'Set the speed of the movement' }),
      
      'moveTo' : ButtonOption.create({ name: 'moveTo', setType: 'moveTo', decisions: ['moveToLocation', 'moveToObject'], buttons: ['to location', 'to object'], question: 'Where should it move?' }),
      
      'moveToLocation' : LocationOption.create({ name: 'moveToLocation', child: 'moveSpeed', question: 'Drag it to the location where it should move' }),
      'moveToObject' : ObjectOption.create({ name: 'moveToObject', decision: 'moveToOffset', question: 'Choose to which other object it should move' }),
      
      'moveToOffset' : OffsetOption.create({ name: 'moveToOffset', child: 'moveSpeed', question: 'Drag the object to define the offset' }),
      
      'jumpTo' : ButtonOption.create({ name: 'jumpTo', setType: 'jumpTo', decisions: ['jumpToLocation', 'jumpToObject', 'jumpToArea'], buttons: ['to location', 'to object', 'to area'], question: 'Where should it jump?' }),
      
      'jumpToLocation' : LocationOption.create({ name: 'jumpToLocation', child: 'save', question: 'Drag it to the location where it should jump' }),
      'jumpToObject' : ObjectOption.create({ name: 'jumpToObject', decision: 'jumpToOffset', question: 'Choose to which other object it should jump' }),
      
      'jumpToOffset' : OffsetOption.create({ name: 'jumpToOffset', child: 'save', question: 'Drag the object to define the offset' }),
      
      'jumpToArea' : AreaOption.create({ name: 'jumpToArea', decision: 'save', question: 'Select the area where it should randomly jump'}),
      
      'roam' : AreaOption.create({ name: 'roam', setType: 'roam', decision: 'roamMode', question: 'Select the area where it should roam in'}),
      'roamMode' : ButtonOption.create({ name: 'roamMode', decisions: ['roamWiggle', 'roamReflect', 'roamInsect', 'roamBounce'], buttons: ['wiggle', 'reflect', 'insect', 'bounce'], question: 'Which type of roaming?' }),
      
      'roamWiggle' : Option.create({ name: 'roamWiggle', type: 'mode', setMode: 'wiggle', child: 'moveSpeed' }),
      'roamReflect' : Option.create({ name: 'roamReflect', type: 'mode', setMode: 'reflect', child: 'moveSpeed' }),
      'roamInsect' : Option.create({ name: 'roamInsect', type: 'mode', setMode: 'insect', child: 'moveSpeed' }),
      'roamBounce' : Option.create({ name: 'roamBounce', type: 'mode', setMode: 'bounce', child: 'moveSpeed' }),
      
      'swap' : ObjectOption.create({ name: 'swap', setType: 'swap', decision: 'save', question: 'Choose the object to swap position' }),
      
      'stop' : Option.create({ name: 'stop', setType: 'stop', child: 'save' }),
      
      'art' : ButtonOption.create({ name: 'art', setType: 'art', decisions: ['toFrame', 'play', 'playStop', 'artChange'], buttons: ['to frame', 'play', 'stop', 'change'], question: 'What should the art do?' }),
      
      'toFrame' : FrameOption.create({ name: 'toFrame', decision: 'save', question : 'Choose the frame it should display' }),
      
      'play' : FrameOption.create({ name: 'play', decision: 'play2', question : 'Choose the start frame of the animation' }),
      'play2' : FrameOption.create({ name: 'play2', mode: 'frame2', decision: 'playMode', question : 'Choose the end frame of your animation' }),
      'playMode' : ButtonOption.create({ name: 'playMode', decisions: ['playLoop', 'playPingPong', 'playOnce'], buttons:  ['loop', 'ping-pong', 'once'], question: 'Choose the animation mode' }),
      
      'playLoop' : Option.create({ name: 'playLoop', type: 'mode', setMode: 'loop', child: 'playSpeed' }),
      'playPingPong' : Option.create({ name: 'playPingPong', type: 'mode', setMode: 'ping-pong', child: 'playSpeed' }),
      'playOnce' : Option.create({ name: 'playOnce', type: 'mode', setMode: 'once', child: 'playSpeed' }),
      
      'playSpeed' : SpeedOption.create({ name: 'playSpeed', child: 'save', question: 'Set the speed of the animation' }),
      
      'playStop' : Option.create({ name: 'playStop', child: 'save' }),
      
      'artChange' : ArtOption.create({ name: 'artChange', decision: 'save', question: 'Search in the libray for your graphic' }),
      
      'game' : ButtonOption.create({ name: 'game', decisions: ['win', 'lose'], buttons: ['win', 'lose'], question: 'Win or lose?' }),
      
      'save' : SaveOption.create({ name: 'save' })
      
    }));
    
  },
  
  insert : function( name ) {
    
    var option = this.options.get( name );
    
    option.insert();
    
  },
  
  decide : function( name, parentName ) {
    
    if ( parentName ) {
    
      this.updateDepth( parentName );
    
    }
    
    this.action.addDecision( name );
    
    this.insert( name );
    
    console.log( this.action.decisions );
    
  },
  
  reset : function( mode ) {
    
    var buttons, question;
    
    this.set( 'action', ActionModel.create() );
    
    this.set( 'mode', mode );
    this.set( 'showSaveButton', false );
    
    if ( mode === 'Action' ) {
      
      // buttons = ['move', 'art', 'number', 'win/lose'];
      buttons = ['move', 'art', 'win/lose'];
      question = 'Select the type of action';

    
    } else {
      
      // buttons = ['click', 'contact', 'time', 'art', 'number', 'win/loss'];
      buttons = ['click', 'contact', 'time'];
      question = 'Select the type of trigger';
    
    }
    
    this.set( 'optionViews', Ember.ContainerView.create({
      destroy : function() {
        if ( App.actionController.action && App.actionController.action.type !== 'search' ) {
          this._super();
        }
      }
    }));
    
    this.options.get( 'action' ).insert();
    
  },
  
  choose : function( name ) {
    
    if ( this.get( name ) ) {
      
      this.get( name ).call( this );
      
    } else {
      
      console.log( 'unknown action/trigger name: ' + name );
      
    }
    
  },
  
  updateDepth : function( name ) {
    
    var childs = this.optionViews.get( 'childViews' ),
      decisions = this.action.decisions,
      depth = decisions.indexOf( name ) + 1;
    
    if ( decisions.length === depth ) {
      
      return;
      
    }
    
    this.action.set( 'decisions', decisions.splice( 0, depth ) );
    
    while ( childs.length > ( depth + 1 ) * 2 ) {
      
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
  
  move : function() {
  
    this.set( 'action', MoveActionModel.create() );
    
    this.addButtonOption( 
      'What type of movement?', 
      ['directional', 'move to', 'jump to', 'roam', 'swap', 'stop'],
      this.action,
      1
    );
  
  },
  
  art : function() {
    
    this.set( 'action', ArtActionModel.create() );
    
    this.addButtonOption( 
      'What should the art do?', 
      ['to frame', 'play', 'stop', 'change' ],
      this.action,
      1
    );
    
  },

  'win/lose' : function() {
    
    this.set( 'action', WinLoseActionModel.create() );
    
    this.addButtonOption( 
      'Win or lose?', 
      ['win', 'lose'], 
      this.action,
      1
    );
    
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