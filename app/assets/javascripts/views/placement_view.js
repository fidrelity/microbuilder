var PlacementView = Ember.View.extend({

  templateName : 'templates_placement_template',
  
  player : null,
  type : 'graphic',
  
  position : null,
  area : null,
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
    
    } else if ( type === 'moveIn' ) {
      
      callback = this.moveInCallback;
      
    } else if ( type === 'area' ) {
      
      callback = this.areaCallback;
      
      player.areaSelectable = true;
      
    }
    
    
    player.setCanvas( $('#placementCanvas')[0] );
    player.parse( App.gameController.getGameObjectsData(), bind( this, callback ) );
    
  },
  
  placeGraphic : function() {
  
    App.placementController.placeGraphic( this.get( 'position' ) );
  
  },
  
  graphicCallback : function() {
    
    this.player.setSelectObject( App.placementController.graphic.imagePath, bind( this, function( ID, pos ) {
      
      this.get( 'position' ).copy( pos );
      
      // this.placeGraphic();
      
    }));
    
    this.set( 'position', new Vector() );
    
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
  
  }

});