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
  
  classNames : ['clear', 'questionview', 'optionview'],
  
  template: Ember.Handlebars.compile("{{content}}")
  
});

var ButtonView = Ember.CollectionView.extend({
  
  content : [],
  
  observer : null,
  
  classNames : ['buttonview', 'optionview'],
  
  attributeBindings: ["data-toggle"],
  'data-toggle': 'buttons-radio',
  
  preSelect : -1,
  
  itemViewClass: Ember.View.extend({
    
    tagName : 'button',
    
    classNames : ['btn'],
    
    template: Ember.Handlebars.compile("{{content.name}}"),
    
    didInsertElement : function() {
      
      if ( this._parentView.observer.name === 'action' || this._parentView.observer.name === 'trigger' ) {
      
        this.$().addClass( 'btn-primary' );
      
      }
      
      if ( this.content.select ) {
        
        this.$().addClass( 'active' );
        
      }
      
    },
    
    click : function() {
      
      this._parentView.observer.decide( this.content.name );
      
    }
    
  })
  
});

var GameObjectsView = Ember.CollectionView.extend({
  
  observer : null,
  
  tagName : 'ul',
  classNames : ['graphics', 'gameobjectsview', 'optionview'],
  
  emptyView: Ember.View.extend({
    
    tagName : 'div',
    
    classNames : ['noObject'],
    
    template: Ember.Handlebars.compile("No objects to select")
    
  }),
  
  itemViewClass: Ember.View.extend({
    
    tagName : 'li',
    
    classNames : ['gameObject'],
    
    templateName : 'editor/templates/game_object_template',
    
    didInsertElement : function() {
      
      var self = this;
      
      this.addObserver( 'App.gameObjectsController.current', function() {
        
        if ( self.content === App.gameObjectsController.current ) {
          
          self.selectSelf();
          
        }
      
      });
      
      if ( this.content === App.gameObjectsController.current || this.content.active ) {
        
        this.selectSelf();
        
        this.content.set( 'active', false );
        
      }
      
    },
    
    click : function() {
      
      this.selectSelf();
      
      if ( this._parentView.observer.select ) {
        
        this._parentView.observer.select( this.content );
        
      } else {
      
        this._parentView.observer.decide( this.content );
      
      }
      
    },
    
    selectSelf : function() {
      
      var childs = this._parentView._childViews, i;
      
      for ( var i = 0; i < childs.length; i++ ) {
      
        childs[i].$().removeClass( 'selected' );
      
      }
      
      this.$().addClass( 'selected' );
      
    }
    
  })
  
});

var TimeView = Ember.View.extend({
  
  tagName : 'div',
  
  classNames : ['timeview', 'optionview'],
  
  template: Ember.Handlebars.compile( '<div class="time">{{time}}</div><div class="slider"></div><div class="time">{{time2}}</div>' ),
  
  observer : null,
  type : null,
  
  min : 0,
  max : 0,
  
  didInsertElement : function() {
    
    var self = this,
      range = this.type === 'random',
      values = range ? [this.min, this.max] : [this.min];
    
    this.setTime( values[0], values[1] );
    
    this.$( '.slider' ).slider({
      
      range : range,
      values: values,
      
      slide: function( event, ui ) {
        
        self.setTime( ui.values[0], ui.values[1] );
        
      }
      
    });
    
  },
  
  setTime : function( time, time2 ) {
    
    this.set( 'time', time + '%' );
    
    if ( time2 ) {
    
      this.set( 'time2', time2 + '%' );
    
    }
    
    this.observer.setTime( time, time2 );
    
  }
  
});

var FrameView = Ember.View.extend({
  
  observer : null,
  graphic : null,
  
  classNames : ['frameview', 'optionview'],
  
  templateName : 'editor/templates/frame_template',
  
  frames : null,
  
  init : function() {
    
    this._super();
    
    this.set( 'frames', [] );
    
    for ( var i = 1; i <= /* this.graphic.frameCount */ 8; i++ ) {
      
      this.frames.addObject({
        number : i,
        observer : this.observer,
        frameWidth : this.graphic.frameWidth,
        frameHeight : this.graphic.frameHeight
      });
      
    }
    
  },
  
  selected : function() {
    
    return this.observer.frame;
    
  }.property( 'observer.frame' ),
  
  divStyle : function() {
    
    var width = this.graphic.frameWidth,
      height = Math.floor( this.graphic.frameHeight * 0.1 ),
      offset = ( this.observer.frame - 1 ) * width;
    
    return 'width:' + width + 'px;height:' + height + 'px;background-color:black;margin-left:' + offset + 'px;';
    
  }.property( 'observer.frame' ),
  
  wrapperWidth : function() {
    
    return this.graphic.frameWidth * 8;
    
  }.property( 'graphic' ),
  
  wrapperHeight : function() {
    
    return this.graphic.frameHeight + 20;
    
  }.property( 'graphic' )
  
});

var SpeedView = Ember.View.extend({
  
  tagName : 'div',
  
  classNames : ['speedview', 'optionview'],
  
  template: Ember.Handlebars.compile( '<div class="slider left"></div><div class="speed left">{{observer.speedName}}</div>' ),
  
  observer : null,
  
  speed : 2,
  
  didInsertElement : function() {
    
    var observer = this.observer;
    
    this.$('.slider').slider({
      
      value: this.speed,
      
      min: 0,
      max: 4,
      
      slide: function( event, ui ) {
        
        observer.setSpeed( ui.value );
        
      }
      
    });
    
  }
  
});

var ArtView = Ember.View.extend({
  
  tagName : 'div',
  
  classNames : ['artview', 'optionview'],
  
  observer : null,
  
  template: Ember.Handlebars.compile('<div {{bindAttr style="divStyle"}}></div><button class="btn" {{action "searchGraphic"}}> search </button>'),
  
  divStyle : function() {
    
    var g = this.observer.graphic;
    
    if ( g ) {
      
      return 'width:' + g.frameWidth + 'px;height:' + g.frameHeight + 'px;border:1px solid gray;background-image:url(' + g.imagePath + ')';
      
    } else {
      
      return 'width:128px;height:128px;border:1px solid gray;';
      
    }
    
  }.property( 'observer.graphic' ),
  
  searchGraphic : function() {
    
    App.actionController.action.set( 'type', 'search' );
    
    App.gameController.searchArtGraphic();
    
  }
  
});
