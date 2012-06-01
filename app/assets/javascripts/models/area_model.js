var AreaModel = Ember.Object.extend({
  
  x : 0,
  y : 0,
  width : 0,
  height : 0,
  
  clone : function() {
    
    return AreaModel.create( this.getData() );
    
  },
  
  getData : function() {
    
    return {
      x : this.x,
      y : this.y,
      width : this.width,
      height : this.height
    }
    
  },
  
  string : function() {
    
    return '( ' + this.x + ' | ' + this.y + ' | ' + this.width + ' | ' + this.height + ' )';
    
  }
  
});
