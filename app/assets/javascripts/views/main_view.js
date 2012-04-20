var MainView = Ember.View.extend({
  
  templateName : 'templates_main_template',
  
  gameBinding : 'App.gameController.game',
  
  stageContent : null,
  behaviourContent : null,
  
  player : null,
  
  init : function() {
    
    this._super();
    
    this.stageView = StageView.create();
    this.libraryView = LibraryView.create();
    this.paintView = PaintView.create();
    
    this.behaviourView = BehaviourView.create();
    this.actionView = ActionView.create();
    this.triggerView = TriggerView.create();
    
  },
  
  didInsertElement : function() {
    
    var player = new Player();
    
    player.setCanvas( this.$( '#testCanvas' )[0] );
    this.player = player;
    
    this.$( "#accordion" ).accordion({
      
      autoHeight: false,
      
      change: function(event, ui) {
        
        if ( ui.options.active === 2 ) {
          
          player.parse( App.gameController.game.getData().game );
          
        }
        
      }
      
    });
    
    this.show( 'stageContent', 'stageView' );
  
  },
  
  show : function( locationName, viewName ) {
    
    if ( !this.get( viewName ) ) {
      
      console.error( 'no view named ' + viewName );
      return;
      
    }
    
    this.set( locationName, this.get( viewName ) );
    
  }
  
});

var StageView = Ember.View.extend({
  
  templateName: 'templates_stage_template',
  
  player: null,
  
  didInsertElement : function() {
    
    var player, game, canvas = this.$( '#stageCanvas' )[0];
    
    if ( canvas ) {
    
      player = new Player(),
      game = App.gameController.game;
    
      player.edit = true;
    
      // player.debug = true;
      player.moveObjects = true;
      player.selectArea = true;
    
      player.positionChangeCallback = bind( game, game.gameObjectPositionChanged );
    
      player.setCanvas( canvas );
      player.parse( game.getData().game );
    
      this.player = player;
    
    }
  
  }
  
});


var SelectView = Ember.View.extend({
  
  content : null,
  compareContent : null,
  
  controller : null,
  selectFunction : null,
  
  isSelected : false,
  
  remove : function() {
    
    this.get( 'controller' ).removeObject( this.get( 'content' ) );
    App.gameController.updatePlayer();
    
  },
  
  select : function() {
    
    if ( !this.get( 'compares' ) ) {
      
      var selectFunction = this.get( 'selectFunction' ),
        controller = this.get( 'controller' ),
        content = this.get( 'content' );
      
      selectFunction.call( controller, content );
      
      this.set( 'isSelected', true );
      
    }
    
  },
  
  compares : function() {
    
    return this.get( 'content' ) === this.get( 'compareContent' );
    
  }.property( 'compareContent' )
  
});

var BehaviourView = SelectView.extend({
  
  addTrigger : function() {
    
    App.behaviourController.set( 'currentBehaviour', this.get( 'content' ) );
    App.gameController.addTrigger();
    
  },
  
  addAction : function() {
    
    App.behaviourController.set( 'currentBehaviour', this.get( 'content' ) );
    App.gameController.addAction();
    
  }
  
});
