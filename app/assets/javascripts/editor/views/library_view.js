var LibraryView = Ember.View.extend({
  
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
  classNames : ['graphics'],
  
  contentBinding : 'App.libraryController.display',
  
  emptyView: Ember.View.extend({
    
    tagName : 'div',
    
    classNames : ['noObject'],
    
    template: Ember.Handlebars.compile("No graphics to select")
    
  }),
  
  itemViewClass: Ember.View.extend({
    
    tagName : 'li',
    
    classNames : ['frame_graphic', 'libraryGraphic'],
    
    templateName : 'editor/templates/graphic_template',
    
    click : function() {
      
      App.libraryController.selectFunction.call( App.gameController, this.content );
      
    },
    
    divStyle : function() {
      
      var c = this.content,
        max = App.libraryController.size.max,
        offset = { x: Math.floor( ( max - c.frameWidth ) * 0.5 ), y: Math.floor( ( max - c.frameHeight ) * 0.5 ) };
      
      if ( c.isBackground ) {
        
        return "background-image:url(" + c.imagePath + ");background-size:210px 130px;width:210px;height:130px;";
        
      } else {
        
        return "background-image:url(" + c.imagePath + ");" + 
          "width:" + c.frameWidth + "px;height:" + c.frameHeight + "px;" +
          "position:relative;top:" + offset.y + "px;left:" + offset.x + "px";
        
      }
    
    }.property()
    
  })
  
});