var ActionTriggerModel = Ember.Object.extend({
  
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
    
  },
  
  setTime : function( time, time2 ) {
    
    this.set( 'time', time );
    this.set( 'time2', time2 );
    
  },
  
  
  speed : 2,
  
  speeds : ['very slow', 'slow', 'medium', 'fast', 'very fast'],
  
  setSpeed : function( speed ) {
    
    this.set( 'speed', speed );
    
  },
  
  speedName : function() {
    
    return this.speeds[ this.speed ];
    
  }.property( 'speed' ),
  
  getSpeedName : function() {
    
    return this.speeds[ this.speed ];
    
  },
  
  
  angle : function() {
    
    return this.location.angle().toFixed( 2 );
    
  },
  
  setPath : function( path ) {
    
    this.set("path", path);
    
  },
  
  setCounter : function( value ) {
    
    this.set( "counter", value );
    
  },
  
  rotateOnMove : false,
  
  setRotateOnMove : function(state) {
    
    state = state || false;
    this.set("rotateOnMove", state);
    
  },
  
  string : function() {
    
    return this.choice ? this.choice.string( this.parentGameObject.name, this ) : 'no choice';
    
  }.property( 'choice', 'gameObject', 'parentGameObject.name', 'location', 'offset', 'area', 'frame', 'frame2', 'graphic', 'mode', 'speed', 'time', 'time2', 'path', 'counter', 'rotateOnMove' ),
  
  clone : function() {
    
    return ActionTriggerModel.create({
      
      decisions : this.decisions.concat(),
      choice : this.choice,
      
      gameObject : this.gameObject,
      
      location : this.location ? this.location.clone() : null,
      offset : this.offset ? this.offset.clone() : null,
      
      area : this.area ? this.area.clone() : null,
      
      frame : this.frame,
      frame2 : this.frame2,
      
      graphic : this.graphic,
      
      time : this.time,
      time2 : this.time2,
      
      mode : this.mode,
      speed : this.speed,
      rotateOnMove : this.rotateOnMove,
      
      counter : this.counter,
      
      path : this.path ? this.path.clone() : null
      
    });

    
  },
  
  parse : function( data ) {
    
    var d = data;
    
    this.setProperties({
      
      choice : App.actionController.getChoice( d.ID ),
      
      gameObject : d.objectID ? App.gameObjectsController.getObject( d.objectID ) : null,
      
      location : d.location ? new Vector().copy( d.location ) : d.angle ? new Vector( 1, 0 ).rotateSelf( d.angle ) : null,
      offset : d.offset ? new Vector().copy( d.offset ) : null,
      
      area : d.area ? new Area().copy( d.area ) : null,
      
      frame : d.frame,
      frame2 : d.frame2,
      
      graphic : d.graphicID ? App.libraryController.getGraphic( d.graphicID ) : null,
      
      time : d.time,
      time2 : d.time2,
      
      mode : d.mode,
      speed : d.speed,
      rotateOnMove : d.rotateOnMove,

      path : d.path ? new Path().copy({ points: d.path }) : null,

      counter : d.counter
      
    });
    
    this.set( 'decisions', this.choice.getDecisions() );
    
    return this;
    
  },
  
  getData : function( graphics ) {
    
    var data = {
      ID : this.choice.ID
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

        case 'path': data.path = this.path.getData(); break;
        
        case 'area': data.area = this.area.getData(); break;
        
        case 'offset': data.offset = this.offset.getData(); break;
        
        case 'frame': data.frame = this.frame; if ( this.frame2 ) data.frame2 = this.frame2; break;
        case 'art': data.graphicID = this.graphic.ID; graphics.push( this.graphic ); break;
        
        case 'time': data.time = this.time; if ( this.time2 ) data.time2 = this.time2; break;
        
        case 'speed': data.speed = this.speed; break;
        case 'mode': data.mode = this.mode; break;

        case 'counter': data.counter = this.counter; break;
        
        default : console.error( 'unknown optionType: ' + optionType );
        
      }
      
    }

    data.rotateToTarget = this.rotateOnMove;
    
    return data;
    
  }
  
});
