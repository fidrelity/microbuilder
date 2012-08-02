var PaintView = Ember.View.extend({
  
  templateName : 'paint/templates/paint_template',
  
  widthBinding : 'App.paintController.width',
  heightBinding : 'App.paintController.height',
  
  zoomBinding : 'App.paintController.zoom',
  
  screenCanvas : null,
  toolCanvas : null,
  
  mouseDown : false,
  
  didInsertElement : function() {
    
    var area = this.$( '#zoom-canvas-area' ),
      self = this;
    
    this.set( 'screenCanvas', this.$( '#screenCanvas' )[0] );
    this.set( 'toolCanvas', this.$( '#toolCanvas' )[0] );
    
    App.paintController.initView( 
      this.screenCanvas.getContext( '2d' ), 
      this.toolCanvas.getContext( '2d' )
    );
    
    area.mousedown( function( e ) {
      
      App.paintController.mousedown( self.getMouse( e ) );
      
      self.set( 'active', true );
      
    });
    
    area.mousemove( function( e ) {
      
      if ( self.active ) {
        
        App.paintController.mousemove( self.getMouse( e ) );
        
      }
      
    });
    
    area.mouseup( function( e ) {
      
      App.paintController.mouseup( self.getMouse( e ) );
      
      self.set( 'active', false );
      
    });
    
    $('.pencil').addClass('activeTool');
    
    $('.selectable').click(function() {
      
      $('.selectable').removeClass('activeTool');
      $(this).addClass('activeTool');
      
    });
    
    this.resize();
    
  },
  
  showTypeSelection : function() {
    
    $("#paint-wrapper").hide();
    $("#paint-size-wrapper").show();
    
  },
  
  resize : function() {
    
    this.screenCanvas.width = this.toolCanvas.width = this.width * this.zoom;
    this.screenCanvas.height = this.toolCanvas.height = this.height * this.zoom;
    
    this.$( '#paint-area' ).css({ 
      width: this.width * this.zoom, 
      height: this.height * this.zoom,
      'margin-top': -this.height * this.zoom / 2
    });
    
    App.paintController.updateZoom( this.zoom );
    
  },
  
  zoomIn : function() {
    
    if ( this.zoom < 4 ) {
      
      this.set( 'zoom', this.zoom + 1 );
      
      this.resize();
      
    }
    
  },
  
  zoomOut : function() {
    
    if ( this.zoom > 1 ) {
      
      this.set( 'zoom', this.zoom - 1 );
      
      this.resize();
      
    }
    
  },
  
  getMouse : function( e ) {
    
    var offset = $( this.toolCanvas ).offset();
    
    return { 
      x : Math.floor( e.pageX - offset.left ) / this.zoom,
      y : Math.floor( e.pageY - offset.top ) / this.zoom
    };
    
  }

});
