var PaintView = Ember.View.extend({
  
  templateName : 'paint/templates/paint_template',
  
  widthBinding : 'App.paintController.width',
  heightBinding : 'App.paintController.height',
  
  zoomBinding : 'App.paintController.zoom',
  
  screenCanvas : null,
  toolCanvas : null,
  patternCanvas : null,
  
  patternCtx : null,
  
  mouseDown : false,
  
  didInsertElement : function() {
    
    var area = this.$( '#zoom-canvas-area' ),
      self = this;
    
    this.set( 'screenCanvas', this.$( '#screenCanvas' )[0] );
    this.set( 'toolCanvas', this.$( '#toolCanvas' )[0] );
    this.set( 'patternCanvas', this.$( '#patternCanvas' )[0] );
    
    this.set( 'patternCtx', this.patternCanvas.getContext( '2d' ) );
    
    App.paintController.initView( 
      this.screenCanvas.getContext( '2d' ), 
      this.toolCanvas.getContext( '2d' )
    );
    
    area.mousedown( function( e ) {
      
      App.paintController.mousedown( self.getMouse( e ) );
      
      self.set( 'active', true );
      
    });
    
    area.mousemove( function( e ) {
      
      App.paintController.mousemove( self.getMouse( e ), self.active );
      
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
    
    var totalHeight = this.$( '#zoom-canvas-area' ).height(),
      zoom = this.zoom,
      height = this.height * zoom,
      width = this.width * zoom,
      ctx = this.patternCtx, 
      size = 8 * zoom, i, j;
    
    App.paintController.resetTool();
    
    this.screenCanvas.width = this.toolCanvas.width = this.patternCanvas.width = width;
    this.screenCanvas.height = this.toolCanvas.height = this.patternCanvas.height = height;
    
    this.$( '#paint-area' ).css({ 
      width: width,
      height: height,
      top: height >= totalHeight ? '0%' : '50%',
      'margin-top': height >= totalHeight ? 0 : -height / 2
    });
    
    ctx.fillStyle = '#FFF';
    ctx.fillRect( 0, 0, width, height );
    
    ctx.fillStyle = '#CCC';
    
    for ( i = Math.floor( width / size ); i >= 0; i-- ) {
      
      for ( j = Math.floor( height / size ); j >= 0; j-- ) {
        
        if ( ( i % 2 && !( j % 2 ) ) || ( j % 2 && !( i % 2 ) ) ) {
          
          ctx.fillRect( i * size, j * size, size, size );
          
        }
        
      }
      
    }
    
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
      x : Math.floor( ( e.pageX - offset.left ) / this.zoom ),
      y : Math.floor( ( e.pageY - offset.top ) / this.zoom )
    };
    
  }

});
