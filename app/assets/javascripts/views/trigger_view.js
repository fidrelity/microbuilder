var TriggerView = Ember.View.extend({
  
  templateName : 'templates_trigger_main_template',
  
  triggerBinding : 'App.triggerController.trigger'
  
});

var ClickTriggerView = TriggerView.extend({
  
  templateName : 'templates_trigger_click_template'
  
});

var ContactTriggerView = TriggerView.extend({
  
  templateName : 'templates_trigger_contact_template'
  
});

var NumberTriggerView = TriggerView.extend({
  
  templateName : 'templates_trigger_number_template'
  
});