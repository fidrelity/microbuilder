var ColorPickerView = Ember.View.extend({
  
  templateName: 'paint/templates/color_picker_template',
  
  colorBinding : 'App.paintController.color',
  colorValsBinding : 'App.paintController.colorVals',
  
  imageData : null,
  
  width : 180,
  height : 26,
  
  down : false,

  lastColors : [],

  isSelecting : false,
  
  didInsertElement : function() {

    this.lastColors = [];
    this.$( '.lastColorItem' ).css({ "background-color" : "#000000" });
    
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
    
    grd.addColorStop( 0, '#C33' );
    grd.addColorStop( 1 / 6, '#DD2' );
    grd.addColorStop( 2 / 6, '#3C3' );
    grd.addColorStop( 3 / 6, '#3CC' );
    grd.addColorStop( 4 / 6, '#33C' );
    grd.addColorStop( 5 / 6, '#B4B' );
    grd.addColorStop( 1, '#C33' );
    
    ctx.fillStyle = grd;
    ctx.fillRect( 0, 0, width / 12 * 11, height );
    
    ctx.fillStyle = '#888';
    ctx.fillRect( width / 12 * 11, 0, width / 12, height );
    
    grd = ctx.createLinearGradient( 0, 0, 0, height );
    
    grd.addColorStop( 0.02, '#FFF' );
    grd.addColorStop( 0.6, 'rgba(255,255,255,0)' );
    grd.addColorStop( 0.61, 'rgba(0,0,0,0)' );
    grd.addColorStop( 1, '#000' );
    
    ctx.fillStyle = grd;
    ctx.fillRect( 0, 0, width, height );
    
    this.set( 'imageData', ctx.getImageData( 0, 0, width, height ).data );
    
    this.addObserver( 'color', function() {
      
      self.$( '#colorfield' ).css( 'background-color', self.color );
      
      if ( !self.down ) {
        
        self.addLastUsedColor( self.colorVals );
        
      }
      
    });
    
    this.$( '#colorselect' ).mousedown( function( e ) {
      
      self.set( 'down', true );
      
      App.paintController.setColor( self.getColor( e, this ) );
      
    });
    
    this.$( '#colorselect' ).mousemove( function( e ) {
      
      if ( self.down ) {
      
        App.paintController.setColor( self.getColor( e, this ) );
      
      }
      
    })
    
    this.$( '#colorselect' ).mouseup( function( e ) {
      
      self.set( 'down', false );
      
      self.addLastUsedColor( self.colorVals );
      
    });
    
    this.$( '.lastColorItem' ).click( function() {
      
      var color = self.lastColors[ $(this).index() + 1 ];
      
      App.paintController.setColor( color || [ 0, 0, 0, 255 ] );
      
    });
    
  },

  addLastUsedColor : function( _color ) {

    var colorBuckets = this.$( '.lastColorItem' ),
      numberOfBuckets = colorBuckets.last().index(),
      colors = this.lastColors,
      i, j, same;
    
    for ( i = 0; i < colors.length; i++ ) {
      
      same = true;
      
      for ( j = 0; j < 4; j++ ) {
        
        if ( colors[i][j] !== _color[j] ) {
          
          same = false;
          break;
          
        }
        
      }
      
      if ( same ) {
        
        colors.splice( i, 1 );
        break;
        
      }
      
    }
    
    if ( colors.unshift( _color ) > 7 ) {
      
      colors.pop();
      
    }
    
    for ( i = 1; i < colors.length; i++ ) {
      
      $( colorBuckets[i - 1] ).css( 'background-color', 'rgba(' + colors[i][0] + ',' + colors[i][1] + ',' + colors[i][2] + ',' + colors[i][3] + ')' );
      
    }
    
  },
  
  getColor : function( e, el ) {
    
    var offset = $( el ).offset(),
      i = this.width * 4 * Math.floor( e.pageY - offset.top ) + 4 * Math.floor( e.pageX - offset.left ),
      data = this.imageData;
    
    if ( i >= this.width * this.height * 4 ) {
      
      return [ 0, 0, 0, 255 ];
      
    }
    
    return [ data[i], data[i+1], data[i+2], data[i+3] ];
    
  }
  
});