var PencilToolModel = Ember.Object.extend({

  isSelectable : true,
  oldX : 0,
  oldY : 0,
  isActive : false,
  
  init : function () {
    
  },
  
  click : function(toolModel) {
  
  },

  mousedown : function(_options) {
    this.isActive = true;   
  },

  mousemove : function(_options) {
    if(!this.isActive) return false;   
  },

  mouseup : function() {
    this.isActive = false;
  },

});