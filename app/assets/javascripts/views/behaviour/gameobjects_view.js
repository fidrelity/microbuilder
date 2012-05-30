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
