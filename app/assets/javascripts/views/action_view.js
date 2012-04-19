var ActionView = Ember.View.extend({
  
  templateName : 'templates_action_main_template',
  
  actionBinding : 'App.actionController.action',
  
  // workaround: contentViewBinding : 'App.actionController.contentView', throws Maximum Stack Size error
  actionViewBinding : 'App.actionController.contentView',
  
  contentView : function() {
    
    return this.get( 'actionView' );
    
  }.property( 'actionView' )
  
});

var ActionTypeView = Ember.View.extend({

  actionBinding : 'App.actionController.action'

});