var TriggerModel = Ember.Object.extend({

  type : null,
  
  string : function() {
    
    return this.type
    
  }.property( 'type' ),
  
  getData : function() {
  
    return { type: this.type }
  
  },
  
  isComplete : true,
  
  notify : function( name ) {
    
    if ( this.get( name ) ) {
      
      this.get( name ).call( this );
      
    } else {
      
      console.log( 'unknown trigger command: ' + name );
      
    }
    
  }

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

var NumberTriggerModel = TriggerModel.extend({

  gameObject: null,
  gameObject2: null,
  number : null, 
  type: null,
  
  selectedNumberBool : false,
  selectedGameObjectBool : false,
  
  selectedNumber: function () {
    this.set ('selectedNumberBool', true);
    this.set ('selectedGameObjectBool', false);
  },
  
  selectedGameObject: function () {
    this.set ('selectedNumberBool', false);
    this.set ('selectedGameObjectBool', true);
  },
  
  selectObject : function( gameObject ) {    
    this.set( 'gameObject', gameObject ); //equals this.gameObject = gameObject damit de view des mitgriagt
  },
  
  selectObject2 : function( gameObject ) {    
    this.set( 'gameObject2', gameObject );    
  },
  
  setTypeToGreaterThan : function ( ) {
    this.set( 'type', 'greatherThan');
  },

  setTypeToSmallerThan : function ( ) {
    this.set( 'type', 'smallerThan');
  },
  
  setTypeToEquals : function ( ) {
    this.set( 'type', 'equals');
  },
  
  setTypeToOnChange : function ( ) {
    this.set( 'type', 'onChange');
  },
  
  string : function() {
    switch(this.type) {
      case 'greatherThan':
        if(this.number)
          return 'number of' + this.gameObject.name + 'greather than' + this.number;
        else
          return 'number of' + this.gameObject.name + 'greather than' + 'number of' + this.gameObject2.name;
      case 'smallerThan':
        if(this.number)
          return 'number of' + this.gameObject.name + 'smaller than' + this.number;
        else
          return 'number of' + this.gameObject.name + 'smaller than' + 'number of' + this.gameObject2.name;
      case 'equals':
        if(this.number)
          return 'number of' + this.gameObject.name + 'equals' + this.number;
        else
          return 'number of' + this.gameObject.name + 'greather than' + 'number of' + this.gameObject2.name;
      case 'onChange':
          return 'number of' + this.gameObject.name + 'changes';
    }
  }.property( 'number', 'gameObject2' ), // .property sets on which data this function gets invoked
  
  getData : function() { //returns jSon Object for Parser
    if(this.number)
      return {
        type: this.type,
        objectID: this.gameObject.ID,
        number: this.number
      }
    else
      return {
        type: this.type,
        objectID: this.gameObject.ID,
        object2ID: this.gameObject2.ID
      } 
  },
  
  isComplete : function() {
     return (this.gameObject && (this.gameObject2 || this.number));
  }.property('gameObject', 'gameObject2', 'number')

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
    
    this.set( 'area', null );
    this.set( 'gameObject', null );
    
    this.set( 'atObject', false );
    this.set( 'atArea', false );
    
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
