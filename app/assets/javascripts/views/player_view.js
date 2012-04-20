var PlayerView = Ember.View.extend({

  templateName : 'templates_player_template',
  
  canvasID : 'playerCanvas',
  
  player : null,
  type : 'move',
  
  position : null,
  area : null,
  gameObject : null,
  
  didInsertElement : function() {
    
    var player, callback, type = this.type;
    
    player = new Player();
    player.edit = true;
    
    // player.debug = true;
    
    this.set( 'player', player );
    
    
    if ( type === 'moveTo' || type === 'jumpTo' ) {
      
      callback = this.moveToCallback;
    
    } else if ( type === 'moveIn' ) {
      
      callback = this.moveInCallback;
      
    } else if ( type === 'area' ) {
      
      callback = this.areaCallback;
      
      player.areaSelectable = true;
      
    }
    
    
    player.setCanvas( $('#playerCanvas')[0] );
    player.parse( App.gameController.getGameObjectsData(), bind( this, callback ) );
    
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
    this.player.draw();
  
  }

});