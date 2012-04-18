var PlacementView = Ember.View.extend({

  templateName : 'templates_placement_template',
  
  player : null,
  type : 'graphic',
  
  position : null,
  gameObject : null,
  
  displayAll : true,
  
  didInsertElement : function() {
    
    var player, callback, type = this.type;
    
    player = new Player();
    player.edit = true;
    
    // player.debug = true;
    
    this.set( 'player', player );
    
    
    if ( type === 'graphic' ) {
      
      callback = this.graphicCallback;
    
    } else if ( type === 'moveTo' || type === 'jumpTo' ) {
      
      callback = this.moveToCallback;
      
    }
    
    
    player.setCanvas( $('#placementCanvas')[0] );
    player.parse( App.gameController.getGameData(), bind( this, callback ) );
    
  },
  
  placeGraphic : function() {
  
    App.placementController.placeGraphic( this.get( 'position' ) );
  
  },
  
  graphicCallback : function() {
    
    var self = this,
      player = this.player;
    
    player.setDragObject( App.placementController.graphic.imagePath );
    player.positionChangeCallback = function( gameObjectId, pos ) {
      
      self.get( 'position' ).copy( pos );
      
    }
    
    this.set( 'position', new Vector() );
    
  },
  
  moveToCallback : function() {
    
    var self = this,
      player = this.player;
    
    player.setDragObjectID( this.get( 'gameObject' ).ID );
    player.positionChangeCallback = function( gameObjectId, pos ) {
        
      self.get( 'position' ).copy( pos );
    
    }
  
  }

});