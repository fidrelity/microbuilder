var LibraryView = Ember.View.extend({
  
  templateName : 'editor/templates/library_template',
  
  didInsertElement : function() {
    
    if ( App.libraryController.showOwn ) {
    
      this.$( '#ownButton' ).addClass( 'active' );
    
    } else {
      
      this.$( '#publicButton' ).addClass( 'active' );
      
    }
    
    App.libraryController.updateDisplay( true );


    // Init Autocomplete for graphics
    this.$( ".graphicSearchField" ).autocomplete({

        source: "/graphics/auto_complete?background=" + App.libraryController.get("showBackground"),

        minLength: 2

    });
    
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
    
    templateName : 'editor/templates/graphic_template',
    
    click : function() {
      
      App.libraryController.selectFunction.call( App.gameController, this.content );
      
    },
    
    divStyle : function() {
      
      var c = this.content,
        zoom, offset, width, height;
      
      if ( c.isBackground ) {
        
        return "background-image:url(" + c.imagePath + ");background-size:160px 98px;width:160px;height:98px;";
        
      } else {
        
        zoom = 96 / Math.max( c.frameWidth, c.frameHeight );
        
        if ( zoom < 1 ) {
          
          width = c.frameWidth * zoom;
          height = c.frameHeight * zoom;
          
        } else {
          
          width = c.frameWidth < 96 ? c.frameWidth : 96;
          height = c.frameHeight < 96 ? c.frameHeight : 96;
          
        }
        
        offset = { x: Math.floor( ( 96 - width ) * 0.5 ), y: Math.floor( ( 96 - height ) * 0.5 ) };
        
        return "background-image:url(" + c.imagePath + ");" + 
          "width:" + width + "px;height:" + height + "px;" + 
          "background-size:" + width * c.frameCount + "px " + height + "px;" + 
          "top:" + offset.y + "px;left:" + offset.x + "px;";
        
      }
    
    }.property()
    
  })
  
});