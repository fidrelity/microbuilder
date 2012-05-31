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

