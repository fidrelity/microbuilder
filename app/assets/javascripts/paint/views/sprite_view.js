var SpriteView = Ember.View.extend({
  
  templateName: 'paint/templates/sprite_template',
  sprite : null,
  
  didInsertElement : function() {

  },

  setCurrentSpriteModel : function() {
    App.paintController.setCurrentSpriteModel(this.get("sprite"));
  }
  
});