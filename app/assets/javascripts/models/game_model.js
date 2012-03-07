var GameModel = Ember.Object.extend({
  
  title : null,
  instructions : null,
  
  background : null,
  
  gameObjects : [],
  
  addGameObject : function( graphic, position ) {
    
    this.gameObjects.push( GameObjectModel.create({
      
      'name' : graphic.name,
      'graphic' : graphic,
      'position' : position.clone()
      
    }) );
    
  },
  
  setBackground : function( graphic ) {
    
    this.set( 'background', graphic );
    
  }
  
});
