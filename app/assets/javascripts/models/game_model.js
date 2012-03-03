var GameModel = Ember.Object.extend({
  
  title : null,
  instructions : null,
  
  background : null,
  
  gameObjects : [],
  
  addGameObject : function( graphic ) {
    
    this.gameObjects.push( GameObjectModel.create({
      
      name : graphic.name,
      graphic : graphic
      
    }) );
    
  }
  
});
