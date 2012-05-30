var PlayerView = Ember.View.extend({

  templateName : 'templates/player_template',
  
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
      
      player.selectedObjectCallback = bind( App.gameObjectsController, App.gameObjectsController.selectID );
      player.selectedObjectDragCallback = bind( App.game, App.game.gameObjectPositionChanged );
      
    } else if ( type === 'moveTo' || type === 'jumpTo' || type === 'moveIn' ) {
      
      callback = this.moveCallback;
      
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
  
  moveCallback : function() {
    
    this.player.setSelectObjectID( this.gameObject.ID, bind( this, function( ID, pos ) {
      
      this.set( 'position', pos.clone() );
      
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