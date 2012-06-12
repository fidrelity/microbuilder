var ActionTriggerModel = Ember.Object.extend({
  
  type : null,
  
  init : function() {
    
    this.set( 'parentGameObject', App.gameObjectsController.current );
    
  },
  
  clone : function() {
    
    return ActionTriggerModel.create({
      type : this.type,
    });
    
  },
  
  string : function() {
    
    return this.type
    
  }.property( 'type' ),
  
  getData : function() {
  
    return { type: this.type };
  
  },
  
  choose : function( name ) {
    
    if ( this.get( name ) ) {
      
      this.get( name ).call( this );
      
    } else {
      
      console.log( 'unknown action command: ' + name );
      
    }
    
  },
  
  select : function( gameObject ) {
    
    this.set( 'gameObject', gameObject );
    
    this.done();
    
  },
  
  locate : function( vector ) {
    
    this.set( 'position', vector.clone() );
    
  },
  
  contain : function( area ) {
    
    this.set( 'region', area.clone() );
    
    this.done();
    
  },
  
  speed : 2,
  
  speeds : ['very slow', 'slow', 'medium', 'fast', 'very fast'],
  
  setSpeed : function( speed ) {
    
    this.set( 'speed', speed );
    
  },
  
  speeed : function() {
    
    return this.speeds[ this.speed ];
    
  }.property( 'speed' ),
  
  done : function() {
    
    if ( this.addOffset ) {
      
      App.actionController.addOffsetOption( 'Drag the object to define the offset', this, this.gameObject, this.addOffset );
      
    }
    
    if ( this.addSpeed ) {
      
      App.actionController.addSpeedOption( 'Set the speed of the movement', this, this.addSpeed );
      
    }
    
    App.actionController.set( 'showSaveButton', true );
    
  }
  
});
