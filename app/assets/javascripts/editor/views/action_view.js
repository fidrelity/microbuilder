var ActionView = Ember.View.extend({
  
  templateName : 'editor/templates/action_template',
  
  actionBinding : 'App.actionController.action'
  
});

var QuestionView = Ember.View.extend({
  
  content : '',
  
  tagName : 'p',
  
  classNames : ['clear'],
  
  template: Ember.Handlebars.compile("{{content}}")
  
});

var ButtonView = Ember.CollectionView.extend({
  
  content : [],
  
  observer : null,
  
  classNames : ['btn-group'],
  
  attributeBindings: ["data-toggle"],
  'data-toggle': 'buttons-radio',
  
  itemViewClass: Ember.View.extend({
    
    tagName : 'button',
    
    classNames : ['btn'],
    
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

var FrameView = Ember.View.extend({
  
  observer : null,
  graphic : null,
  type : null,
  
  templateName : 'editor/templates/frame_template',
  
  frames : null,
  
  init : function() {
    
    this._super();
    
    this.set( 'frames', [] );
    
    for ( var i = 1; i <= this.graphic.frameCount; i++ ) {
      
      this.frames.addObject({
        number : i,
        observer : this.observer,
        type : this.type,
        frameWidth : this.graphic.frameWidth,
        frameHeight : this.graphic.frameHeight
      });
      
    }
    
  }
  
});

var SpeedView = Ember.View.extend({
  
  tagName : 'div',
  
  observer : null,
  
  didInsertElement : function() {
    
    var observer = this.observer;
    
    this.$().slider({
      
      value: 2,
      
      min: 0,
      max: 4,
      
      slide: function( event, ui ) {
        
        observer.setSpeed( ui.value );
        
      }
      
    });
    
  }
  
});
