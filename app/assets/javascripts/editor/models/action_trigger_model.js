var ActionTriggerModel = Ember.Object.extend({
  
  type : null,
  
  decisions : null,
  
  choice : null,
  
  parentGameObject : null,
  
  init : function() {
    
    this.set( 'decisions', this.decisions || [] );
    this.set( 'parentGameObject', App.gameObjectsController.current );
    
  },
  
  addDecision : function( option ) {
    
    this.decisions.addObject( option );
    
  },
  
  setChoice : function( choiceID ) {
    
    this.set( 'choice', App.actionController.getChoice( choiceID ) );
    
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
    
    return this.decisions.map( function(i){ return i.name; }).join( ' > ' );
    
  }.property( 'decisions.length' ),
  
  // string : function() {
  //   
  //   return this.choice ? this.choice.string( this.parentGameObject, this ) : this.type;
  //   
  // }.property( 'choice', 'gameObject', 'location', 'offset', 'area', 'frame', 'frame2', 'graphic', 'mode', 'speed' ),
  
  
  clone : function() {
    
    return ActionTriggerModel.create({
      
      type : this.type,
      decisions : this.decisions.concat(),
      choice : this.choice,
      
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
      choice : App.actionController.getChoice( d.choiceID ),
      
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
    
    if ( this.choice ) {
      
      this.set( 'decisions', this.choice.getDecisions() );
      
    }
    
    return this;
    
  },
  
  getData : function( graphicIDs ) {
    
    var data = { 
      type : this.type,
      choiceID : this.choice.ID
    }, i, optionType;
    
    for ( i = 0; i < this.decisions.length; i++ ) {
      
      optionType = this.decisions[i].type;
      
      switch ( optionType ) {
        
        case 'empty': break;
        case 'button': break;
        case 'save': break;
        
        case 'object': data.objectID = this.gameObject.ID; break;
        
        case 'location': data.location = this.location.getData(); break;
        case 'direction': data.angle = this.angle(); break;
        
        case 'area': data.area = this.area.getData(); break;
        
        case 'offset': if ( this.offset ) data.offset = this.offset.getData(); break;
        
        case 'frame': data.frame = this.frame; if ( this.frame2 ) data.frame2 = this.frame2; break;
        case 'art': data.graphicID = this.graphic.ID; graphicIDs.push( this.graphic.ID ); break;
        
        case 'speed': data.speed = this.speed; break;
        case 'mode': data.mode = this.mode; break;
        
        default : console.error( 'unknown optionType: ' + optionType );
        
      }
      
    }
    
    return data;
    
  }
  
});
