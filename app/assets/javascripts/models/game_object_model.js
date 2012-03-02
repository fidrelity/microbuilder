//= require ember
//= require ./../player/utilities/vector

var GameObjectModel = Ember.Object.extend({
  
  name : null,
  pos : new Vector(),
  
  say : function() {
    
    console.log( this.name );
    
  }
  
});