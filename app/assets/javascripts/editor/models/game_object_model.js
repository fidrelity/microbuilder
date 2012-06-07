var GameObjectModel = Ember.Object.extend({
  
  name : null,
  ID : null,
  
  position : null,
  graphic : null,
  
  behaviours : null,
  startBehaviour : null,
  
  init : function() {
    
    this.ID = App.game.gameObjectCounter++;
    
    this.set( 'behaviours', [] );
    
    this.set( 'startBehaviour', BehaviourModel.create());
    this.startBehaviour.addTrigger( StartTriggerModel.create() );
    
  },
  
  clone : function() {
    
    var obj = GameObjectModel.create({
      
      name : incrementString( this.name ),
      graphic : this.graphic,
      position : new Vector( 30, 30 ).addSelf( this.position )
      
    });
    
    App.gameObjectsController.set( 'current', obj );
    
    obj.set( 'behaviours', this.cloneBehaviours() );
    obj.set( 'startBehaviour', this.startBehaviour.clone() );
    
    return obj;
    
  },
  
  cloneBehaviours : function() {
    
    var b = [];
    
    for ( var i = 0; i < this.behaviours.length; i++ ) {
      
      b.push( this.behaviours[i].clone() );
      
    }
    
    return b;
    
  },
  
  getData : function( graphics ) {
  
    var behaviours = [], 
      b, i;
  
    if ( graphics.indexOf( this.graphic ) < 0 ) {
      
      graphics.push( this.graphic.getData() );
      
    }
    
    b = this.startBehaviour.getData( graphics );
    
    if ( b ) {
    
      behaviours.push( b );
    
    }
      
    for ( i = 0; i < this.behaviours.length; i++ ) {
      
      b = this.behaviours[i].getData( graphics );
      
      if ( b ) {
        
        behaviours.push( b );
      
      }
      
    }
    
    return {
      ID : this.ID,
      name : this.name,
      graphicID : this.graphic.ID,
      position : this.position.getData(),
      behaviours : behaviours
    };
  
  },
  
  getSimpleData : function( graphics ) {
  
    if ( graphics.indexOf( this.graphic ) < 0 ) {
      
      graphics.push( this.graphic.getData() );
      
    }
    
    return {
      ID : this.ID,
      graphicID : this.graphic.ID,
      position : this.position.getData()
    };
  
  }
  
});
