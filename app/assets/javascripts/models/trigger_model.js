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

