var PlayerView = Ember.View.extend({

  templateName : 'templates_player_template',
  
  canvasID : 'playerCanvas',
  
  player : null,
  type : 'stage',
  
  position : null,
  area : null,
  gameObject : null,
  
  didInsertElement : function() {
    
    var player, callback, type = this.type;
    
    player = new Player();
    player.edit = true;
    
    this.set( 'player', player );
    
    if ( type === 'stage' ) {
      
      player.objectsMoveable = true;
      player.areaSelectable = true;
      
      player.showTimeline = true;
      
      player.selectedObjectCallback = bind( App.mainView.stageView, App.mainView.stageView.selectedObjectCallback );
      player.selectedObjectDragCallback = bind( App.game, App.game.gameObjectPositionChanged );
      
    } else if ( type === 'moveTo' || type === 'jumpTo' ) {
      
      callback = this.moveToCallback;
    
    } else if ( type === 'moveIn' ) {
      
      callback = this.moveInCallback;
      
    } else if ( type === 'area' ) {
      
      callback = this.areaCallback;
      
      player.areaSelectable = true;
      
    } else {
      
      player.edit = false;
      
    }
    
    
    player.setCanvas( $('#' + this.canvasID)[0] );
    player.parse( App.game.getGameObjectsData(), bind( this, callback ) );
    
  },
  
  moveToCallback : function() {
    
    this.player.setSelectObjectID( this.get( 'gameObject' ).ID, bind( this, function( ID, pos ) {
      
      this.get( 'position' ).copy( pos );
      
    }));
  
  },

  moveInCallback : function() {
    
    this.player.setSelectObjectID( this.get( 'gameObject' ).ID, bind( this, function( ID, pos ) {
      
      this.get( 'position' ).copy( pos.sub( this.get( 'gameObject' ).position ) );
      
    }));
  
  },
  
  areaCallback : function() {
    
    this.player.selectedAreaCallback = bind( this, function( area ) {
      
      this.set( 'area', AreaModel.create( area ) );
      
    });
    
    this.player.selectObject = null;
    this.player.reset();
  
  },
  
  destroy : function() {
    
    this.player.terminate = true;
    
    this._super();
    
  }

});