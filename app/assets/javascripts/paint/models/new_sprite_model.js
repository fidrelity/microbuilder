var NewSpriteModel = Ember.Object.extend({
  
  ctx : null,
  
  stack : null,
  iterator : 0,
  
  init : function() {
    
    this.stack = [];
    this.iterator = 0;
    
  },
  
  initView : function( _ctx ) {
    
    this.set( 'ctx', _ctx );
    
    this.save( _ctx.getImageData( 0, 0, App.paintController.width, App.paintController.height ) );
    
    this.draw();
    
  },
  
  load : function() {
    
    if ( this.stack.length ) {
      
      return this.stack[ this.iterator - 1 ];
      
    }
    
    return null;
    
  },
  
  save : function( imageData ) {
    
    this.stack[ this.iterator ] = imageData;
    
    this.iterator++;
    
    this.draw();
    
  },
  
  undo : function() {
    
    if ( this.iterator > 0 ) {
      
      this.iterator--;
      
      this.draw();
      
    }
    
  },
  
  redo : function() {
    
    if ( this.iterator < this.stack.length ) {
      
      this.iterator++;
      
      this.draw();
      
    }
    
  },
  
  draw : function() {
    
    var data = this.load();
    
    if ( data ) {
      
      this.ctx.putImageData( data, 0, 0 );
      
    }
    
  }
  
});