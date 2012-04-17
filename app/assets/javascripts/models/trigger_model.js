var TriggerModel = Ember.Object.extend({

  type : null,
  
  string : function() {
    
    return this.type
    
  }.property(),
  
  getData : function() {
  
    return { type: this.type }
  
  },
  
  isComplete : function() {
    
    return true;
    
  }.property()

});

var ClickTriggerModel = TriggerModel.extend({
  
  type : 'click',
  
  isClick : true,
  
  gameObject : null,
  
  string : function() {
    
    return 'click on ' + this.get( 'gameObject' ).name;
    
  }.property( 'gameObject.name' ),
  
  getData : function() {
    
    return {
      type: 'onClick',
      objectID: this.gameObject.ID
    };
    
  },
  
  isComplete : function() {
    
    return this.get( 'gameObject' );
    
  }.property( 'gameObject' )
  
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
    
  }.property( 'gameObject.name', 'gameObject2.name' ),
  
  getData : function() {
    
    return {
      type: this.type,
      object1ID: this.gameObject.ID,
      object2ID: this.gameObject2.ID
    };
    
  },
  
  isComplete : function() {
    
    return this.get( 'gameObject' ) && this.get( 'gameObject2' );
    
  }.property( 'gameObject', 'gameObject2' )
  
});

var StartTriggerModel = TriggerModel.extend({
  
  type : 'onStart'
  
});
