var PlayerView = Ember.View.extend({

  templateName : 'editor/templates/player_template',
  
  canvasID : 'playerCanvas',
  
  player : null,
  type : 'stage',
  
  observer : null,
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
      
      player.selectedObjectCallback = bind( App.gameObjectsController, App.gameObjectsController.selectID );
      player.selectedObjectDragCallback = bind( App.game, App.game.gameObjectPositionChanged );
      
    } else if ( type === 'location' ) {
      
      callback = this.locationCallback;
      
    } else if ( type === 'area' ) {
      
      callback = this.areaCallback;
      
      player.areaSelectable = true;
      
    } else {
      
      player.edit = false;
      
    }
    
    
    player.setCanvas( $('#' + this.canvasID)[0] );
    
    if ( callback ) {
      
      player.parse( App.game.getGameObjectsData(), bind( this, callback ) );
      
    } else {
      
      player.parse( App.game.getData().game );
      
    }

    // *** Snapshot of preview game ***
    // onClick on li element
    $('#thumbnail').find('li').live('click', function() {

      $(this).find('input[type="radio"]').attr("checked", "checked");

    });

    
  },
  
  locationCallback : function() {
    
    this.player.setSelectObjectID( this.gameObject.ID, bind( this, function( ID, pos ) {
      
      this.observer.locate( pos );
      
    }));
  
  },
  
  areaCallback : function() {
    
    this.player.selectedAreaCallback = bind( this, function( area ) {
      
      this.observer.contain( area );
      
    });
    
    this.player.selectObject = null;
    this.player.reset();
  
  },
  
  destroy : function() {
    
    this.player.terminate = true;
    
    this._super();
    
  }

});