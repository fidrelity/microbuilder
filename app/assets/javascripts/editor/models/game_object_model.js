var GameObjectModel = Ember.Object.extend({
  
  name : null,
  ID : null,
  
  position : null,
  graphic : null,
  
  behaviours : null,
  startBehaviour : null,
  
  boundingArea : null,
  
  init : function() {
    
    var startTrigger = ActionTriggerModel.create();
    
    startTrigger.set( 'type', 'start' );
    startTrigger.setChoice( 'gameStart' );
    
    this.ID = this.ID || App.game.gameObjectCounter++;
    
    this.set( 'behaviours', [BehaviourModel.create()] );
    
    this.set( 'startBehaviour', BehaviourModel.create());
    this.startBehaviour.addTrigger( startTrigger );
    
  },
  
  setBoundingArea : function( area ) {
    
    this.set( 'boundingArea', area );
    
  },
  
  clone : function() {
    
    var obj = GameObjectModel.create({
      
      name : incrementString( this.name ),
      graphic : this.graphic,
      position : new Vector( 30, 30 ).addSelf( this.position ),
      boundingArea : this.boundingArea ? this.boundingArea.clone() : null
      
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
  
  getData : function( graphics ) {
  
    var data = {
      ID : this.ID,
      name : this.name,
      graphicID : this.graphic.ID,
      position : this.position.getData(),
      behaviours : []
    }, b, i;
  
    graphics.push( this.graphic );
    
    b = this.startBehaviour.getData( graphics );
    
    if ( b ) {
      
      data.behaviours.push( b );
      
    }
      
    for ( i = 0; i < this.behaviours.length; i++ ) {
      
      b = this.behaviours[i].getData( graphics );
      
      if ( b ) {
        
        data.behaviours.push( b );
        
      }
      
    }
    
    if ( this.boundingArea ) {
      
      data.boundingArea = this.boundingArea.getData();
      
    }
    
    return data;
  
  }
  
});
