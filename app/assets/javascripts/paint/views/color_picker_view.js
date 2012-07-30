var ColorPickerView = Ember.View.extend({
  
  templateName: 'paint/templates/color_picker_template',
  
  colorBinding : 'App.paintController.color',
  
  imageData : null,
  
  width : 180,
  height : 26,
  
  down : false,
  
  didInsertElement : function() {
    
    var canvas = this.$( '#colorselect' )[0],
      ctx = canvas.getContext( '2d' ),
      self = this,
      width = this.width,
      height = this.height,
      grd;
    
    canvas.width = width;
    canvas.height = height;
    
    canvas.onselectstart = function() { return false; };
    
    grd = ctx.createLinearGradient( 0, 0, width / 12 * 11, 0 );
    
    grd.addColorStop( 0, '#F00' );
    grd.addColorStop( 1 / 6, '#FF0' );
    grd.addColorStop( 2 / 6, '#0F0' );
    grd.addColorStop( 3 / 6, '#0FF' );
    grd.addColorStop( 4 / 6, '#00F' );
    grd.addColorStop( 5 / 6, '#F0F' );
    grd.addColorStop( 1, '#F00' );
    
    ctx.fillStyle = grd;
    ctx.fillRect( 0, 0, width / 12 * 11, height );
    
    ctx.fillStyle = '#888';
    ctx.fillRect( width / 12 * 11, 0, width / 12, height );
    
    grd = ctx.createLinearGradient( 0, 0, 0, height );
    
    grd.addColorStop( 0, '#FFF' );
    grd.addColorStop( 0.6, 'rgba(255,255,255,0)' );
    grd.addColorStop( 0.61, 'rgba(0,0,0,0)' );
    grd.addColorStop( 1, '#000' );
    
    ctx.fillStyle = grd;
    ctx.fillRect( 0, 0, width, height );
    
    this.set( 'imageData', ctx.getImageData( 0, 0, width, height ).data );
    
    this.addObserver( 'color', function() {
      
      self.$( '#colorfield' ).css( 'background-color', self.color );
      
    });
    
    this.$( '#colorselect' ).mousedown( function( e ) {
      
      self.set( 'down', true );
      
      self.set( 'color', self.getHexColor( e, this ) );
      
    });
    
    this.$( '#colorselect' ).mousemove( function( e ) {
      
      if ( self.down ) {
      
        self.set( 'color', self.getHexColor( e, this ) );
      
      }
      
    })
    
    this.$( '#colorselect' ).mouseup( function( e ) {
      
      self.set( 'down', false );
      
    });
    
  },
  
  getHexColor : function( e, el ) {
    
    var offset = $( el ).offset(),
      i = this.width * 4 * ( e.pageY - offset.top ) + 4 * ( e.pageX - offset.left ),
      data = this.imageData;
      
    if ( i >= this.width * this.height * 4 ) {
      
      return '#000000';
      
    }
      
    return rgbToHex( data[i], data[i+1], data[i+2] );
    
  }
  
});