var ClickTriggerModel = Ember.Object.extend({
  
  type : 'click',
  
  isClick : true,
  
  gameObject : null,
  
  getData : function() {
    
    return {
      type: "onClick",
      objectID: this.gameObject.ID
    };
    
  }
  
});

var ContactTriggerModel = Ember.Object.extend({
  
  type : 'contact',
  
  isContact : true,
  
  gameObject : null,
  gameObject2 : null,
  
  getData : function() {
    
    return {
      type: "onContact",
      object1ID: this.gameObject.ID,
      object2ID: this.gameObject2.ID
    };
    
  }
  
});
