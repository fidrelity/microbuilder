var TriggerView = Ember.View.extend({
  
  templateName : 'templates_trigger_main_template',
  
  behaviour : null,
  
  triggerBinding : 'App.triggerController.trigger',
  
  // workaround: contentViewBinding : 'App.triggerController.contentView', throws Maximum Stack Size error
  triggerViewBinding : 'App.triggerController.contentView',
  
  contentView : function() {
    
    return this.get( 'triggerView' );
    
  }.property( 'triggerView' )
  
});

var TriggerTypeView = Ember.View.extend({

  triggerBinding : 'App.triggerController.trigger'

});