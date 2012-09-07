var LibraryView = Ember.View.extend({
  
  templateName : 'editor/templates/library_template',
  
  sizeBinding : 'App.libraryController.size',
  sizesBinding : 'App.libraryController.sizes',
  
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
    
  },
  
  showSmall : function( _e ) {
    
    if ( this.size.name === 'small' ) {
      
      this.set( 'size', this.sizes[0] );
      this.$( '#smallButton' ).removeClass( 'active' );
      _e.stopPropagation();
      
    } else {
      
      this.set( 'size', this.sizes[1] );
      
    }
    
  },
  
  showMedium : function( _e ) {
    
    if ( this.size.name === 'medium' ) {
      
      this.set( 'size', this.sizes[0] );
      this.$( '#mediumButton' ).removeClass( 'active' );
      _e.stopPropagation();
      
    } else {
      
      this.set( 'size', this.sizes[2] );
      
    }
    
  },
  
  showLarge : function( _e ) {
    
    if ( this.size.name === 'large' ) {
      
      this.set( 'size', this.sizes[0] );
      this.$( '#largeButton' ).removeClass( 'active' );
      _e.stopPropagation();
      
    } else {
      
      this.set( 'size', this.sizes[3] );
      
    }
    
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
      
      App.libraryController.select( this.content );
      
    }
    
  })
  
});