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
  
  atArea : false,
  atObject : false,
  
  gameObject : null,
  area : null,
  
  clickObject : function() {
    
    this.set( 'atObject', true );
    this.set( 'atArea', false );
    
    this.set( 'area', null );
    
  },
  
  clickArea : function() {
    
    this.set( 'atArea', true );
    this.set( 'atObject', false );
    
    this.set( 'gameObject', null );
    
  },
  
  string : function() {
    
    if ( this.atArea ) {
      
      return 'click in area ' + this.get( 'area' ).string();
      
    } else {
    
      return 'click on ' + this.get( 'gameObject' ).name;
    
    }
    
  }.property( 'gameObject.name', 'area.x' ),
  
  getData : function() {
    
    if ( this.atArea ) {
    
      return {
        type: 'onClick',
        area: this.get( 'area' ).getData()
      };
    
    } else {
    
      return {
        type: 'onClick',
        objectID: this.gameObject.ID
      };
    
    }
    
  },
  
  isComplete : function() {
    
    return this.get( 'gameObject' ) || this.get( 'area' );
    
  }.property( 'gameObject', 'area' )
  
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
