var LibraryView = Ember.View.extend({
  
  heading : 'Library',
  
  templateName : 'editor/templates/library_template',
  
  didInsertElement : function() {
    
    if ( App.libraryController.showOwn ) {
    
      this.$( '#ownButton' ).addClass( 'active' );
    
    } else {
      
      this.$( '#publicButton' ).addClass( 'active' );
      
    }
    
    App.libraryController.updateDisplay( true );
    
  }
  
});

var GraphicsView = Ember.CollectionView.extend({
  
  tagName : 'ul',
  classNames : ['graphics', 'libaryGraphics'],
  
  contentBinding : 'App.libraryController.display',
  
  emptyView: Ember.View.extend({
    
    tagName : 'div',
    
    classNames : ['noObject'],
    
    template: Ember.Handlebars.compile("No graphics to select")
    
  }),
  
  itemViewClass: Ember.View.extend({
    
    tagName : 'li',
    
    classNames : ['graphic'],
    
    templateName : 'editor/templates/graphic_template',
    
    click : function() {
      
      App.libraryController.selectFunction.call( App.gameController, this.content );
      
    },
    
    divStyle : function() {
      
      var c = this.content;
      
      if ( c.isBackground ) {
        
        return "background-image:url(" + c.imagePath + ");background-size:210px 130px;width:210px;height:130px;";
        
      } else {
        
        return "background-image:url(" + c.imagePath + ");width:" + c.frameWidth + "px;height:" + c.frameHeight + "px;";
        
      }
    
    }.property()
    
  })
  
});