var ColorPickerView = Ember.View.extend({
  
  templateName: 'paint/templates/color_picker_template',
  
  colorBinding : 'App.paintController.color',
  
  imageData : null,
  
  width : 180,
  height : 26,
  
  down : false,

  lastColors : [],
  lastColorCounter : 0,

  isSelecting : false,
  
  didInsertElement : function() {

    this.lastColors = [];
    this.$('#lastColorList').find("li").css({ "background-color" : "#000000" });
    
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

      self.addLastUsedColor(self.color);
      
    });

    this.$('.lasColorItem').click(function() {

      var c = self.lastColors[ $(this).index() ];

      var color = c ? c : "#000000";

      self.set( 'color', color );      

    });
    
  },


  addLastUsedColor : function(_color) {    

    var colorBuckets = this.$('#lastColorList').find("li");
    var numberOfBuckets = colorBuckets.last().index();     

    this.lastColors[this.lastColorCounter] = _color;

    colorBuckets.eq( this.lastColorCounter ).css("background-color", _color);

    this.lastColorCounter++;

    this.lastColorCounter = this.lastColorCounter <= numberOfBuckets ? this.lastColorCounter : 0;

  },
  
  getColor : function( e, el ) {
    
    var offset = $( el ).offset(),
      i = this.width * 4 * Math.floor( e.pageY - offset.top ) + 4 * Math.floor( e.pageX - offset.left ),
      data = this.imageData;
    
    if ( i >= this.width * this.height * 4 ) {
      
      return '#000000';
      
    }
    
    return [ data[i], data[i+1], data[i+2], data[i+3] ];
    
  }
  
});