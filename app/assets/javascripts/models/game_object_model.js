//= require ./../utilities/vector

var GameObjectModel = Ember.Object.extend({
  
  name : null,
  position : new Vector(),
  
  graphic : null,
  
  ID : null,
  
  counter : 0,
  
  init : function() {
    
    this.ID = App.gameController.game.gameObjectCounter++;
    
  },
  
  getData : function( graphics ) {
  
    if ( graphics.indexOf( this.graphic ) < 0 ) {
      
      graphics.push( this.graphic.getData() );
      
    }
    
    return {
      ID : this.ID,
      name : this.name,
      graphicID : this.graphic.ID,
      position : this.position.getData()
    };
  
  }
  
});
