//= require ./../utilities/vector

var GameObjectModel = Ember.Object.extend({
  
  name : null,
  position : new Vector(),
  
  graphic : null,
  
  getData : function() {
  
    var data = {};
  
    data.name = this.name;
    data.imagePath = this.graphic.imagePath;
  
    data.position = {
      x : this.position.x,
      y : this.position.y
    };
  
    return data;
  
  }
  
});
