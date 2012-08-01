var NewSpriteModel = Ember.Object.extend({
  
  stack : null,
  iterator : 0,
  
  init : function() {
    
    this.stack = [];
    this.iterator = 0;
    
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
    
  },
  
  undo : function() {
    
    if ( this.iterator > 0 ) {
      
      this.iterator--;
      
    }
    
  },
  
  redo : function() {
    
    if ( this.iterator < this.stack.length ) {
      
      this.iterator++;
      
    }
    
  }
  
});