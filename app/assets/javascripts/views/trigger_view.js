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

var NumberTriggerView = TriggerView.extend({
  
  templateName : 'templates_trigger_number_template'
  
});