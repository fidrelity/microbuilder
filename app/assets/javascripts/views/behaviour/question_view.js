var QuestionView = Ember.View.extend({
  
  content : '',
  
  tagName : 'p',
  
  template: Ember.Handlebars.compile("{{content}}")
  
});

