var PaintView = Ember.View.extend({
  
  templateName : 'paint/templates/paint_template',
  
  widthBinding : 'App.paintController.width',
  heightBinding : 'App.paintController.height',
  
  zoomBinding : 'App.paintController.zoom',
  sizeBinding : 'App.paintController.size',
  
  screenCanvas : null,
  toolCanvas : null,
  patternCanvas : null,
  
  patternCtx : null,
  
  mouseDown : false,
  
  bgToggleCounter : 0,
  bgColors : [ 'url("/assets/paint/pattern.png")', '#FFF', '#000' ],
  
  isSprites : true,
  
  didInsertElement : function() {
    
    var area = this.$( '#zoom-canvas-area' ),
      self = this;
    
    this.set( 'screenCanvas', this.$( '#screenCanvas' )[0] );
    this.set( 'toolCanvas', this.$( '#toolCanvas' )[0] );
    this.set( 'patternCanvas', this.$( '#patternCanvas' )[0] );
    
    this.set( 'patternCtx', this.patternCanvas.getContext( '2d' ) );
    
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
    
    $('.selectable').click(function() {
      
      $('.selectable').removeClass('activeTool');
      $(this).addClass('activeTool');
      
    });
    
    App.paintController.initView( 
      this.screenCanvas.getContext( '2d' ), 
      this.toolCanvas.getContext( '2d' )
    );
    
    if ( App.paintController.isBackground ) {
      
      this.bgToggleCounter = 1;
      
      this.resize();
      
    } else {
      
      this.bgToggleCounter = 2;
      
      this.toggleBackground();
      
    }
    
    
    $( "#sizeSlider" ).slider({
      
      value: this.size,
      min: 1,
      max: 20,
      step: 1,
      
      slide: function( event, ui ) {
        
        App.paintController.setSize( ui.value );
        
      }
      
    });
    
    $( "#zoomSlider" ).slider({
      
      value: this.zoom,
      min: 1,
      max: 4,
      step: 1,
      
      slide: function( event, ui ) {
        
        self.setZoom( ui.value );
        
      }
      
    });
    
    // make canvases compatible for touch events
    $('#area-wrapper').addTouch();
    
    // Init tooltips
    $('.ttip').tooltip();
    $('.ttipBottom').tooltip({ placement: 'bottom' });
    $('.pop').popover({ trigger: "hover" });
    $('.popBottom').popover({ placement: 'bottom', trigger: "hover" });

  },

  toggleBackground : function( number ) {
    
    this.bgToggleCounter = this.bgToggleCounter < this.bgColors.length - 1 ? this.bgToggleCounter + 1 : 0;
    
    $( ".toggleBgButton" ).css( "background", this.bgColors[this.bgToggleCounter] );
    
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
    
    if ( this.bgToggleCounter === 0 ) {
      
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
      
    } else {
      
      ctx.fillStyle = this.bgColors[this.bgToggleCounter];
      ctx.fillRect( 0, 0, width, height );
      
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
  
  setZoom : function( _zoom ) {
    
    this.set( 'zoom', _zoom );
    
    this.resize();
    
  },
  
  getMouse : function( e ) {
    
    var offset = $( this.toolCanvas ).offset();
    
    return { 
      x : Math.floor( ( e.pageX - offset.left ) / this.zoom ),
      y : Math.floor( ( e.pageY - offset.top ) / this.zoom )
    };
    
  },
  
  showSprites : function() {
    
    this.set( 'isSprites', true );
    
    App.spritePlayer.stop();
    
  },
  
  showAnimation : function() {
    
    this.set( 'isSprites', false );
    
    Ember.run.end();
    
    App.spritePlayer.show();
    
  },
  
  type : function() {
    
    return ( App.paintController.isBackground ? 'background' : 'graphic' );
    
  }.property( 'App.paintController.isBackground' )

});
