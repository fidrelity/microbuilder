var ObjectsView = Ember.View.extend({
  
  templateName : 'editor/templates/objects_template',
  
  didInsertElement : function() {
    
    var pos, pos2, pos3, ID, ID2;
    
    this.$( '.actions' ).sortable({
      
      connectWith: '.actions',
      placeholder: 'element',
      
      start: function( e, ui ) {
        
        pos = $( this ).sortable( 'toArray' ).indexOf( ui.item[0].id );
        ID = parseInt( $( this ).attr( 'behaviourID' ) );
        
        console.log( 'start', ID, pos );
        
      },
      
      stop: function( e, ui ) {
        
        pos2 = $( this ).sortable( 'toArray' ).indexOf( ui.item[0].id );
        
        if ( pos2 >= 0 && pos !== pos2 ) {
          
          console.log( 'stop', ID, pos, ID, pos2 );
          
          App.behaviourController.moveAction( ID, pos, ID, pos2 );
          
        }
        
      },
      
      receive: function( e, ui ) {
        
        pos3 = $( this ).sortable( 'toArray' ).indexOf( ui.item[0].id );
        ID2 = parseInt( $( this ).attr( 'behaviourID' ) );
        
        console.log( 'receive', ID, pos, ID2, pos3 );
        
        $( this ).sortable( 'cancel' );
        $( ui.sender ).sortable( 'cancel' );
        
        Ember.run.later( function() {
          
          App.behaviourController.moveAction( ID, pos, ID2, pos3 );
          
        }, 1000);
        
      }
      
    }).disableSelection();
    
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
        
        pos = $( this ).sortable( 'toArray' ).indexOf( ui.item[0].id );
        
      },
      
      stop : function(e, ui) {
        
        pos2 = $( this ).sortable( 'toArray' ).indexOf( ui.item[0].id );
        
        if ( pos !== pos2 ) {
          
          App.gameObjectsController.moveObject( pos, pos2 );
          
        }
        
      }
      
    }).disableSelection();
    
  }
  
});

var UiActionTriggerView = Ember.CollectionView.extend({
  
  content : [],
  
  type : null,
  
  tagName: 'ul',
  
  attributeBindings: ['behaviourID'],
  
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

var UiActionView = UiActionTriggerView.extend({
  
  classNames: ['actions'],
  
  type : 'actions'
  
});

var UiTriggerView = UiActionTriggerView.extend({
  
  classNames: ['triggers'],
  
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