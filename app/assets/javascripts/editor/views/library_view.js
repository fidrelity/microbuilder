var LibraryView = Ember.View.extend({
  
  templateName : 'editor/templates/library_template',
  
  sizeBinding : 'App.libraryController.size',
  
  heading : function() {
    
    return ( App.libraryController.showBackground ? 'background' : 'graphics' ) + ' library';
    
  }.property( 'App.libraryController.isBackground' ),
  
  didInsertElement : function() {
    
    if ( App.libraryController.showOwn ) {
    
      this.$( '#ownButton' ).addClass( 'active' );
    
    } else {
      
      this.$( '#publicButton' ).addClass( 'active' );
      
    }
    
    App.libraryController.loadGraphics();
    
    // Init Autocomplete for graphics
    this.$( ".graphicSearchField" ).autocomplete({

        source: "/graphics/auto_complete?background=" + App.libraryController.get("showBackground"),

        minLength: 2

    });
    
    App.updateHelp();
    
  },
  
  showSmall : function( _e ) {
    
    if ( this.size.name === 'small' ) {
      
      App.libraryController.setSize( 0 );
      this.$( '#smallButton' ).removeClass( 'active' );
      _e.stopPropagation();
      
    } else {
      
      App.libraryController.setSize( 1 );
      
    }
    
  },
  
  showMedium : function( _e ) {
    
    if ( this.size.name === 'medium' ) {
      
      App.libraryController.setSize( 0 );
      this.$( '#mediumButton' ).removeClass( 'active' );
      _e.stopPropagation();
      
    } else {
      
      App.libraryController.setSize( 2 );
      
    }
    
  },
  
  showLarge : function( _e ) {
    
    if ( this.size.name === 'large' ) {
      
      App.libraryController.setSize( 0 );
      this.$( '#largeButton' ).removeClass( 'active' );
      _e.stopPropagation();
      
    } else {
      
      App.libraryController.setSize( 3 );
      
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

      $.scrollTo( $(".overlayWrapper").find(".libraryPagination"), { axies : 'y', duration : 500} );
      
    }
    
  })
  
});