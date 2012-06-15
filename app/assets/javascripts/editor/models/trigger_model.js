var ClickTriggerModel = Ember.Object.extend({
  
  type : 'click',
  
  'self' : function() {
    
    this.done();
    
  },
  
  'object' : function() {
    
    App.actionController.addObjectsOption( 'Choose the object to trigger the click', this, 2 );
    
  },
  
  'area' : function() {
    
    App.actionController.addAreaOption( 'Select the area to trigger the click', this, 2 );
    
  },
  
  clone : function() {
    
    return ClickTriggerModel.create({
      gameObject : this.gameObject,
      region : this.region ? this.region.clone() : null,
    });
    
  },
  
  string : function() {
    
    if ( this.region ) {
      
      return 'click in area ' + this.region.string();
      
    } else if ( this.gameObject ) {
    
      return 'click on ' + this.gameObject.name;
    
    } else {
      
      return 'click on ' + this.parentGameObject.name;
      
    }
    
  }.property( 'gameObject', 'area' ),
  
  getData : function() {
    
    var data = { type : 'click' };
    
    if ( this.region ) {
    
      data.area = this.region.getData();
    
    } else if ( this.gameObject ) {
    
      data.objectID = this.gameObject.ID;
    
    }
    
    return data;
    
  },
  
  parse : function( data ) {
    
    var d = data;
    
    this.setProperties({ 
      region : d.area ? new Area().copy( d.area ) : null,
      gameObject : App.gameObjectsController.getObject( d.objectID )
    });
    
    return this;
    
  }
  
});

var ContactTriggerModel = Ember.Object.extend({
  
  'touch' : function() {
    
    this.set( 'type', 'touch' );
    
    App.actionController.addButtonOption( 'Touches what?', ['object', 'area'], this, 2 );
    
  },
  
  'overlap' : function() {
    
    this.set( 'type', 'overlap' );
    
    App.actionController.addButtonOption( 'Overlaps what?', ['object', 'area'], this, 2 );
    
  },
  
  'object' : function() {
    
    App.actionController.addObjectsOption( 'Choose the object to trigger the ' + this.type, this, 3 );
    
  },
  
  'area' : function() {
    
    App.actionController.addAreaOption( 'Select the area to trigger the ' + this.type, this, 3 );
    
  },
  
  clone : function() {
    
    return ContactTriggerModel.create({
      type : this.type,
      gameObject : this.gameObject,
      region : this.region ? this.region.clone() : null,
    });
    
  },
  
  string : function() {
    
    var str = this.parentGameObject.name + ( this.type === 'touch' ? ' touches ' : ' overlaps ' );
    
    if ( this.region ) {
      
      str += 'area ' + this.region.string();
      
    } else if ( this.gameObject ) {
    
      str += this.gameObject.name;
    
    }
    
    return str;
    
  }.property( 'gameObject', 'area' ),
  
  getData : function() {
    
    var data = { type : this.type };
    
    if ( this.region ) {
    
      data.area = this.region.getData();
    
    } else if ( this.gameObject ) {
    
      data.objectID = this.gameObject.ID;
    
    }
    
    return data;
    
  },
  
  parse : function( data ) {
    
    var d = data;
    
    this.setProperties({
      type : d.type, 
      region : d.area ? new Area().copy( d.area ) : null,
      gameObject : App.gameObjectsController.getObject( d.objectID )
    });
    
    return this;
    
  }
  
});

var TimeTriggerModel = Ember.Object.extend({
  
  time : 0,
  time2 : 0,
  
  'exactly' : function() {
    
    this.set( 'type', 'exactly' );
    
    App.actionController.addTimeOption( 'Drag the handle to the time in the game', this.type, this, 2 );
    
    this.done();
    
  },
  
  'randomly' : function() {
    
    this.set( 'type', 'randomly' );
    
    App.actionController.addTimeOption( 'Drag the handles to set the time range', this.type, this, 2 );
    
    this.done();
    
  },
  
  setTime : function( time, time2 ) {
    
    this.set( 'time', time );
    this.set( 'time2', time2 );
    
  },
  
  clone : function() {
    
    return TimeTriggerModel.create({
      time : this.time,
      time2 : this.time2
    });
    
  },
  
  string : function() {
    
    if ( this.time2 ) {
      
      return 'randomly after ' + this.time + '-' + this.time2 + '% of the game';
      
    } else {
      
      return 'after ' + this.time + '% of the game';
      
    }
    
  }.property( 'time', 'time2' ),
  
  getData : function() {
    
    var data = { 
      type : 'time',
      time : this.time
    };
    
    if ( this.time2 ) {
    
      data.time2 = this.time2;
    
    }
    
    return data;
    
  },
  
  parse : function( data ) {
    
    var d = data;
    
    this.setProperties({ 
      time : d.time,
      time2 : d.time2
    });
    
    return this;
    
  }
  
});

var StartTriggerModel = Ember.Object.extend({
  
  type : 'start',
  
  clone : function() {
    
    return StartTriggerModel.create({
      type : this.type,
    });
    
  },
  
  getData : function() {
  
    return { type: this.type };
  
  }
  
});