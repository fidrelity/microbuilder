var TriggerModel = Ember.Object.extend({

  type : null,
  
  string : function() {
    
    return this.type
    
  }.property(),
  
  getData : function() {
  
    return { type: this.type }
  
  }

});

var ClickTriggerModel = TriggerModel.extend({
  
  type : 'click',
  
  isClick : true,
  
  gameObject : null,
  
  string : function() {
    
    return 'click on ' + this.get( 'gameObject' ).name;
    
  }.property( 'gameObject' ),
  
  getData : function() {
    
    return {
      type: 'onClick',
      objectID: this.gameObject.ID
    };
    
  },
  
});

var ContactTriggerModel = TriggerModel.extend({
  
  type : 'contact',
  
  isContact : true,
  
  gameObject : null,
  gameObject2 : null,
  
  string : function() {
    
    return 'contact between ' + this.get( 'gameObject' ).name + ' and ' + this.get( 'gameObject2' ).name;
    
  }.property( 'gameObject', 'gameObject2' ),
  
  getData : function() {
    
    return {
      type: 'onContact',
      object1ID: this.gameObject.ID,
      object2ID: this.gameObject2.ID
    };
    
  }
  
});

var StartTriggerModel = TriggerModel.extend({
  
  type : 'onStart'
  
});
