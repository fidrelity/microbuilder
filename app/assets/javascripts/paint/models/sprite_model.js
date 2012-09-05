var SpriteModel = Ember.Object.extend({
  
  ctx : null,
  
  stack : null,
  iterator : 0,
  
  init : function() {
    
    this.stack = [];
    this.iterator = 0;
    
  },
  
  initView : function( _ctx ) {
    
    this.set( 'ctx', _ctx );
    
    if ( !this.stack.length ) {
      
      this.save( _ctx.getImageData( 0, 0, App.paintController.width, App.paintController.height ) );
      
    }
    
    this.draw();
    
    App.paintController.loadSprite();
    
  },
  
  clone : function() {
    
    var sprite = SpriteModel.create();
    
    sprite.save( this.ctx.cloneImageData( this.load() ) );
    
    return sprite;
    
  },
  
  load : function() {
    
    if ( this.stack.length ) {
      
      return this.stack[ this.iterator - 1 ];
      
    }
    
    return null;
    
  },
  
  save : function( imageData ) {
    
    this.stack[ this.iterator ] = imageData;
    
    if ( this.stack.length <= 100 ) {
      
      this.iterator++;
      
    } else {
      
      this.stack.shift();
      
    }
    
    if ( this.ctx ) {
      
      this.draw();
      
    }
    
  },
  
  undo : function() {
    
    if ( this.iterator > 1 ) {
      
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
  
  draw : function( ctx ) {
    
    var data = this.load();
    
    ctx = ctx || this.ctx;
    
    if ( data && ctx ) {
      
      ctx.putImageData( data, 0, 0 );
      
    }
    
  }
  
});