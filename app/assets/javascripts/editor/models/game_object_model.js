var GameObjectModel = Ember.Object.extend({
  
  name : null,
  ID : null,
  
  position : null,
  graphic : null,
  
  behaviours : null,
  startBehaviour : null,
  
  init : function() {
    
    var startTrigger = ActionTriggerModel.create();
    
    startTrigger.setType( 'start' );
    startTrigger.setChoice( 'gameStart' );
    
    this.ID = this.ID || App.game.gameObjectCounter++;
    
    this.set( 'behaviours', [BehaviourModel.create()] );
    
    this.set( 'startBehaviour', BehaviourModel.create());
    this.startBehaviour.addTrigger( startTrigger );
    
  },
  
  clone : function() {
    
    var obj = GameObjectModel.create({
      
      name : incrementString( this.name ),
      graphic : this.graphic,
      position : new Vector( 30, 30 ).addSelf( this.position )
      
    });
    
    App.gameObjectsController.set( 'current', obj );
    
    obj.set( 'behaviours', this.cloneBehaviours() );
    obj.set( 'startBehaviour', this.startBehaviour.clone() );
    
    return obj;
    
  },
  
  cloneBehaviours : function() {
    
    var b = [];
    
    for ( var i = 0; i < this.behaviours.length; i++ ) {
      
      b.push( this.behaviours[i].clone() );
      
    }
    
    return b;
    
  },
  
  getData : function( graphicIDs ) {
  
    var behaviours = [], 
      b, i;
  
    graphicIDs.push( this.graphic.ID );
    
    b = this.startBehaviour.getData( graphicIDs );
    
    if ( b ) {
    
      behaviours.push( b );
    
    }
      
    for ( i = 0; i < this.behaviours.length; i++ ) {
      
      b = this.behaviours[i].getData( graphicIDs );
      
      if ( b ) {
        
        behaviours.push( b );
      
      }
      
    }
    
    return {
      ID : this.ID,
      name : this.name,
      graphicID : this.graphic.ID,
      position : this.position.getData(),
      behaviours : behaviours
    };
  
  }
  
});
