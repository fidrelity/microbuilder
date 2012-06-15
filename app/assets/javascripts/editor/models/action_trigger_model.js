var ActionTriggerModel = Ember.Object.extend({
  
  type : null,
  
  decisions : null,
  
  init : function() {
    
    this.set( 'decisions', this.decisions || [] );
    
  },
  
  addDecision : function( name ) {
    
    this.decisions.addObject( name );
    
  },
  
  setType : function( type ) {
    
    this.set( 'type', type );
    
  },
  
  setMode : function( mode ) {
    
    this.set( 'mode', mode );
    
  },
  
  setObject : function( object ) {
    
    this.set( 'gameObject', object );
    
  },
  
  setLocation : function( location ) {
    
    this.set( 'location', location );
    
  },
  
  setArea : function( area ) {
    
    this.set( 'area', area );
    
  },
  
  setOffset : function( offset ) {
    
    this.set( 'offset', offset );
    
  },
  
  setFrame : function( name, frame ) {
    
    this.set( name, frame );
    
  },
  
  setGraphic : function( graphic ) {
    
    this.set( 'graphic', graphic );
    
    this.set( 'type', 'art' );
    
  },
  
  
  speed : 2,
  
  speeds : ['very slow', 'slow', 'medium', 'fast', 'very fast'],
  
  setSpeed : function( speed ) {
    
    this.set( 'speed', speed );
    
  },
  
  speedName : function() {
    
    return this.speeds[ this.speed ];
    
  }.property( 'speed' ),
  
  
  angle : function() {
    
    return this.location.angle().toFixed( 2 );
    
  },
  
  
  string : function() {
    
    return this.decisions.join( ' > ' );
    
  }.property( 'decisions.length' ),
  
  clone : function() {
    
    return ActionTriggerModel.create({
      
      type : this.type,
      decisions : this.decisions.concat(),
      
      gameObject : this.gameObject,
      
      location : this.location ? this.position.clone() : null,
      offset : this.offset ? this.offset.clone() : null,
      
      area : this.area ? this.area.clone() : null,
      
      frame : this.frame,
      frame2 : this.frame2,
      
      graphic : this.graphic,
      
      mode : this.mode,
      speed : this.speed
      
    });
    
  },
  
  parse : function( data ) {
    
    var d = data;
    
    this.setProperties({
      
      type : d.type,
      decisions : d.decisions,
      
      gameObject : d.objectID ? App.gameObjectsController.getObject( d.objectID ) : null,
      
      location : d.location ? new Vector().copy( d.location ) : d.angle ? new Vector( 1, 0 ).rotateSelf( d.angle ) : null,
      offset : d.offset ? new Vector().copy( d.offset ) : null,
      
      area : d.area ? new Area().copy( d.area ) : null,
      
      frame : d.frame,
      frame2 : d.frame2,
      
      graphic : d.graphicID ? App.libraryController.getGraphic( d.graphicID ) : null,
      
      mode : d.mode,
      speed : d.speed
      
    });
    
    return this;
    
  },
  
  getData : function() {
    
    var data = { type : this.type, decisions : this.decisions.concat() }, i, optionType;
    
    for ( i = 0; i < this.decisions.length; i++ ) {
      
      optionType = App.actionController.options.get( this.decisions[i] ).type;
      
      switch ( optionType ) {
        
        case 'empty': break;
        case 'button': break;
        
        case 'object': data.objectID = this.gameObject.ID; break;
        
        case 'location': data.location = this.location.getData(); break;
        case 'direction': data.angle = this.angle(); break;
        
        case 'area': data.area = this.area.getData(); break;
        
        case 'offset': if ( this.offset ) data.offset = this.offset.getData(); break;
        
        case 'frame': data.frame = this.frame; if ( this.frame2 ) data.frame2 = this.frame2; break;
        case 'art': data.graphicID = this.graphic.ID; break;
        
        case 'speed': data.speed = this.speed; break;
        case 'mode': data.mode = this.mode; break;
        
        default : console.error( 'unknown optionType: ' + optionType );
        
      }
      
    }
    
    return data;
    
  }
  
});
