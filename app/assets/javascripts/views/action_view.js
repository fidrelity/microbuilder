var ActionView = Ember.View.extend({
  
  templateName : 'templates/action_template',
  
  actionBinding : 'App.actionController.action'
  
});

var QuestionView = Ember.View.extend({
  
  content : '',
  
  tagName : 'p',
  
  template: Ember.Handlebars.compile("{{content}}")
  
});

var ButtonView = Ember.CollectionView.extend({
  
  content : [],
  
  observer : null,
  
  itemViewClass: Ember.View.extend({
    
    tagName : 'button',
    
    template: Ember.Handlebars.compile("{{content}}"),
    
    click : function() {
      
      this._parentView.observer.choose( this.content );
      
    }
    
  })
  
});

var GameObjectsView = Ember.CollectionView.extend({
  
  contentBinding : 'App.gameObjectsController.others',
  
  observer : null,
  
  tagName : 'ul',
  classNames : ['graphics'],
  
  itemViewClass: Ember.View.extend({
    
    tagName : 'li',
    
    template: Ember.Handlebars.compile('<img {{bindAttr src="content.graphic.imagePath"}} {{bindAttr alt="content.graphic.name"}} /><p>{{content.graphic.name}}</p>'),
    
    click : function() {
      
      this._parentView.observer.select( this.content );
      
    }
    
  })
  
});
