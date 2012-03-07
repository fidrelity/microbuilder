/*
  GameObjectsController
  
  - manages the GameObjects of the GameModel
*/

var GameObjectsController = Ember.ArrayController.extend({

  contentBinding : "App.gameController.game.gameObjects"
  
});