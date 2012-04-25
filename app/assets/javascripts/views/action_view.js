var ActionView = Ember.View.extend({
  
  templateName : 'templates/action/main_template',
  
  actionBinding : 'App.actionController.action'
  
});

var MoveActionView = ActionView.extend({
  
  templateName : 'templates/action/move_template'
  
});

var ArtActionView = ActionView.extend({
  
  templateName : 'templates/action/art_template'
  
});