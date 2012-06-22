var ObjectsView = Ember.View.extend({
  
  templateName : 'editor/templates/objects_template',
  
  didInsertElement : function() {
    
    var pos, pos2;
    
    // this.$( '.actions' ).sortable({
    //   
    //   connectWith: '.actions',
    //   placeholder: 'element',
    //   
    //   start: function(event, ui) {
    //     
    //     console.log( 'start', event, ui, $( this ).sortable( 'toArray' ) );
    //     
    //   },
    //   
    //   stop: function(event, ui) {
    //     
    //     console.log( 'stop', event, ui, $( this ).sortable( 'toArray' ) );
    //     
    //   },
    //   
    //   receive: function(event, ui) {
    //     
    //     console.log( ui.sender, $( ui.sender ).sortable( 'toArray' ) );
    //     
    //     console.log( 'stop', event, ui, $( this ).sortable( 'toArray' ) );
    //     
    //   }
    //   
    // }).disableSelection();
    // 
    // this.$( '.triggers' ).sortable({
    //   
    //   connectWith: '.triggers',
    //   placeholder: 'element',
    //   
    //   start: function(event, ui) {
    //     
    //     console.log( 'start', event, ui, $( this ).sortable( 'toArray' ) );
    //     
    //   },
    //   
    //   stop: function(event, ui) {
    //     
    //     console.log( 'stop', event, ui, $( this ).sortable( 'toArray' ) );
    //     
    //   }
    //   
    // }).disableSelection();
    
    this.$( '.graphics' ).sortable({
      
      placeholder: 'gameObject',
      
      start : function(e, ui) {
        
        console.log( 'start', event, ui, $( this ).sortable( 'toArray' ) );
        
        pos = $( this ).sortable( 'toArray' ).indexOf( ui.item[0].id );
        
      },
      
      stop : function(e, ui) {
        
        console.log( 'stop', event, ui, $( this ).sortable( 'toArray' ) );
        
        pos2 = $( this ).sortable( 'toArray' ).indexOf( ui.item[0].id );
        
        if ( pos !== pos2 ) {
          
          App.gameObjectsController.moveObject( pos, pos2 );
          
        }
        
      }
      
    }).disableSelection();
    
  }
  
});

var UiActionView = Ember.CollectionView.extend({
  
  content : [],
  
  type : 'actions',
  
  itemViewClass: Ember.View.extend({
    
    tagName : 'li',
    
    templateName : 'editor/templates/ui_action_template',
    
    classNames : ['element'],
    
    edit : function() {
      
      App.behaviourController.set( 'current', this.content.parent );
      App.gameController.editAction( this.content );
      
    },
    
    remove : function() {
      
      this.content.parent[this._parentView.type].removeObject( this.content );
      
    }
    
  })
  
});

var UiTriggerView = UiActionView.extend({
  
  type : 'triggers'
  
});

var BehaviourView = SelectView.extend({
  
  addTrigger : function() {
    
    App.behaviourController.set( 'current', this.get( 'content' ) );
    App.gameController.addTrigger();
    
  },
  
  addAction : function() {
    
    App.behaviourController.set( 'current', this.get( 'content' ) );
    App.gameController.addAction();
    
  },
  
  duplicate : function() {
    
    App.behaviourController.duplicateBehaviour( this.content );
    App.mainView.updatePlayer();
    
  },
  
  remove : function() {
    
    if ( ( !this.content.actions.length && !this.content.triggers.length ) || 
      confirm( 'Throw the condition away?' ) ) {
      
      this._super();
      
    }
    
  },
  
});

var GameObjectView = Ember.View.extend({
  
  content: null,
  
  remove: function() {
    
    if ( confirm( 'Delete the game object?' ) ) {
      
      App.gameObjectsController.removeGameObject( this.content );
      App.gameObjectsController.set( 'current', null );
      
      this.set( 'content', null );
      
    }
    
  },
  
  duplicate : function() {
    
    App.gameObjectsController.duplicateObject( this.content );
    
  },
  
  changeArt: function() {
    
    App.gameController.searchChangeGraphic();
    
  },
  
  bounding: function() {
    
    App.gameController.setBoundingArea();
    
  }
  
});