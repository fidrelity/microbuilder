var TriggerView = Ember.View.extend({
  
  templateName : 'templates/trigger/main_template',
  
  triggerBinding : 'App.triggerController.trigger'
  
});

var ClickTriggerView = TriggerView.extend({
  
  templateName : 'templates/trigger/click_template'
  
});

var ContactTriggerView = TriggerView.extend({
  
  templateName : 'templates/trigger/contact_template'
  
});