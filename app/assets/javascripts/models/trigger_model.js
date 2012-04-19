var TriggerModel = Ember.Object.extend({

  type : null,
  
  string : function() {
    
    return this.type
    
  }.property( 'type' ),
  
  getData : function() {
  
    return { type: this.type }
  
  },
  
  isComplete : true

});


var ObjectAreaTriggerModel = TriggerModel.extend({

  gameObject : null,
  area : null,
  
  atArea : false,
  atObject : false,

  onObject : function() {
    
    this.set( 'atObject', true );
    this.set( 'atArea', false );
    
    this.set( 'area', null );
    
  },
  
  onArea : function() {
    
    this.set( 'atArea', true );
    this.set( 'atObject', false );
    
    this.set( 'gameObject', null );
    
  },
  
  selectObject : function( gameObject ) {
    
    this.set( 'gameObject', gameObject );
    
  }

});


var ClickTriggerModel = ObjectAreaTriggerModel.extend({
  
  type : 'click',
  
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
        area: this.area.getData()
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

var ContactTriggerModel = ObjectAreaTriggerModel.extend({
  
  type : 'onContact',
  
  isContact : true,
  gameObject2 : null,
  
  selectObject2 : function( gameObject ) {
    
    this.set( 'gameObject2', gameObject );
    
  },
  
  word : function() {
    
    return this.get( 'isContact' ) ? 'contact' : 'overlap';
    
  }.property( 'isContact' ),
  
  string : function() {
    
    var name2 = this.get( 'gameObject2' ).name, str;
    
    if ( this.atArea ) {
      
      str = name2 + ' and area ' + this.get( 'area' ).string();
      
    } else {
    
      str = name2 + ' and ' + this.get( 'gameObject' ).name;
    
    }
    
    return str + ( this.isContact ? ' have contact' : ' overlap' );
    
  }.property( 'gameObject.name', 'gameObject2.name' ),
  
  getData : function() {
    
    if ( this.atArea ) {
      
      return {
        type: this.type,
        objectID: this.gameObject2.ID,
        area: this.area.getData()
      };
    
    } else {
    
      return {
        type: this.type,
        objectID: this.gameObject.ID,
        object2ID: this.gameObject2.ID
      };
    
    }
    
  },
  
  isComplete : function() {
    
    return ( this.get( 'gameObject' ) || this.get( 'area' ) ) && this.get( 'gameObject2' );
    
  }.property( 'gameObject', 'gameObject2', 'area' )
  
});

var StartTriggerModel = TriggerModel.extend({
  
  type : 'onStart'
  
});
