var ActionView = Ember.View.extend({
  
  templateName : 'templates_action_main_template',
  
  actionBinding : 'App.actionController.action'
  
});

var MoveActionView = ActionView.extend({
  
  templateName : 'templates_action_move_template'
  
});

var ArtActionView = ActionView.extend({
  
  templateName : 'templates_action_art_template'
  
});