var GameObjectModel = Ember.Object.extend({
  
  name : null,
  ID : null,
  
  position : null,
  graphic : null,
  
  behaviours : [],
  startBehaviour : null,
  
  init : function() {
    
    this.ID = App.game.gameObjectCounter++;
    
    this.startBehaviour = BehaviourModel.create();
    this.startBehaviour.addTrigger( StartTriggerModel.create() );
    
  },
  
  getData : function( graphics ) {
  
    var behaviours = [], 
      b, i;
  
    if ( graphics.indexOf( this.graphic ) < 0 ) {
      
      graphics.push( this.graphic.getData() );
      
    }
    
    b = this.startBehaviour.getData( graphics );
    
    if ( b ) {
    
      behaviours.push( b );
    
    }
      
    for ( i = 0; i < this.behaviours.length; i++ ) {
      
      b = this.behaviours[i].getData( graphics );
      
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
