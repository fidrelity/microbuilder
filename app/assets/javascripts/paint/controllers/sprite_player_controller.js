var SpritePlayerController = Ember.ArrayController.extend({
  
  contentBinding : 'App.paintController.content',
  
  ctx : null,
  index : 0,
  playInterval : null,
  
  show : function() {
    
    this.ctx = $( '#playerCanvas' )[0].getContext( '2d' );
    
    this.draw();
    
  },
  
  start : function() {
    
    $('#playButton').hide();
    $('#stopButton').show();
    
    if ( this.content.length > 1 ) {
      
      this.playInterval = setInterval( bind( this, this.play ), this.getDuration() );
      
    }
    
  },
  
  play : function() {
    
    this.index++;
    
    if ( this.index === this.content.length ) {
      
      if ( !this.isLooping() ) {
        
        return this.stop();
        
      }
      
      this.index = 0
      
    }
    
    this.draw();
    
  },
  
  draw : function() {
    
    this.content[ this.index ].draw( this.ctx );
    
  },
  
  stop : function() {
    
    $( '#playButton' ).show();
    $( '#stopButton' ).hide();
    
    clearInterval( this.playInterval );
    
    this.index = 0;
    this.draw();
    
  },
  
  isLooping : function() {
    
    // return $( '#replayLoop' ).is( ':checked' );
    return true;
    
  },
  
  getDuration : function() {
    
    return parseInt( $( '#playDelay' ).val() ) || 200;
    
  }
  
});