var ActionView = Ember.View.extend({
  
  templateName : 'editor/templates/action_template',
  
  actionBinding : 'App.actionController.action',
  
  heading : function() {
    
    return App.actionController.mode + ' Editor';
    
  }.property( 'App.actionController.mode' )
  
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
  
  observer : null,
  
  tagName : 'ul',
  classNames : ['graphics'],
  
  emptyView: Ember.View.extend({
    
    template: Ember.Handlebars.compile("No objects to select")
    
  }),
  
  itemViewClass: Ember.View.extend({
    
    tagName : 'li',
    
    templateName : 'editor/templates/game_object_template',
    
    click : function() {
      
      var childs = this._parentView._childViews, i;
      
      for ( var i = 0; i < childs.length; i++ ) {
      
        childs[i].$().removeClass( 'selected' );
      
      }
      
      this.$().addClass( 'selected' );
      
      this._parentView.observer.select( this.content );
      
    },
    
    divStyle : function() {
  
      return "background-image:url(" + this.content.graphic.imagePath + ");background-size:" + this.content.graphic.resizeWidth + "px 64px;";
  
    }.property()
    
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
    
  },
  
  selected : function() {
    
    return this.observer[ this.type ];
    
  }.property( 'observer.frame', 'observer.frame2' ),
  
  divStyle : function() {
    
    var width = this.graphic.frameWidth,
      height = Math.floor( this.graphic.frameHeight * 0.1 ),
      offset = ( this.observer[ this.type ] - 1 ) * width;
    
    return 'width:' + width + 'px;height:' + height + 'px;background-color:black;margin-left:' + offset + 'px;';
    
  }.property( 'observer.frame', 'observer.frame2' )
  
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
