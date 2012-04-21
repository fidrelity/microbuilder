var GameObjectModel = Ember.Object.extend({
  
  name : null,
  ID : null,
  
  position : null,
  graphic : null,
  
  init : function() {
    
    this.ID = App.game.gameObjectCounter++;
    
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
