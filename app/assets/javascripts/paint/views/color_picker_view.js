var ColorPickerView = Ember.View.extend({
  
  templateName: 'paint/templates/color_picker_template',
  
  colorBinding : 'App.paintController.color',
  
  imageData : null,
  
  width : 256,
  height : 26,
  
  down : false,
  
  didInsertElement : function() {
    
    var canvas = this.$( '#colorselect' )[0],
      ctx = canvas.getContext( '2d' ),
      self = this,
      colors = new Image(),
      imageData;
    
    canvas.width = this.width;
    canvas.height = this.height;
    
    canvas.onselectstart = function() { return false; };
    
    colors.onload = function () {
      
      ctx.drawImage( colors, 0, 0, self.width, self.height );
      
      self.set( 'imageData', ctx.getImageData( 0, 0, self.width, self.height ).data );
      
    }
    
    colors.src = '/assets/paint/color_picker.png';
    
    
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