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
  
  getData : function() {
  
    return {
      ID : this.ID,
      name : this.name,
      imagePath : this.graphic.imagePath,
      position : this.position.getData()
    };
  
  }
  
});
