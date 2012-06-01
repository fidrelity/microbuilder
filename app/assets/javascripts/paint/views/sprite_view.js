var SpriteView = SelectView.extend({
  
  templateName: 'paint/templates/sprite_template',
  sprite : null,
  
  didInsertElement : function() {
    this.sprite.initView();
  },

  setCurrentSpriteModel : function() {
    App.paintController.setCurrentSpriteModel(this.get("sprite"));
  }
  
});