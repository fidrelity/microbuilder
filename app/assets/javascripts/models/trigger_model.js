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
  
  type : 'onContact',
  
  isContact : true,
  
  gameObject : null,
  gameObject2 : null,
  
  string : function() {
    
    var name = this.get( 'gameObject' ).name,
      name2 = this.get( 'gameObject2' ).name;
    
    if ( this.isContact ) {
    
      return 'contact between ' + name + ' and ' + name2;
      
    } else {
      
      return name + ' and ' + name2 + ' overlap';
      
    }
    
  }.property( 'gameObject', 'gameObject2' ),
  
  getData : function() {
    
    return {
      type: this.type,
      object1ID: this.gameObject.ID,
      object2ID: this.gameObject2.ID
    };
    
  }
  
});

var StartTriggerModel = TriggerModel.extend({
  
  type : 'onStart'
  
});
