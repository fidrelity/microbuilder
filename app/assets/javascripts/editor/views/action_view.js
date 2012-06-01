var ActionView = Ember.View.extend({
  
  templateName : 'editor/templates/action_template',
  
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

var TimeView = Ember.View.extend({
  
  tagName : 'div',
  
  observer : null,
  type : null,
  
  didInsertElement : function() {
    
    var observer = this.observer,
      range = this.type === 'randomly',
      values = range ? [0,100] : [0];
    
    this.$().slider({
      
      range : range,
      values: values,
      
      slide: function( event, ui ) {
        
        observer.setTime( ui.values[0], ui.values[1] );
        
      }
      
    });
    
  }
  
});
