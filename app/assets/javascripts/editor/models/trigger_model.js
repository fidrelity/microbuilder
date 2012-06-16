var ClickTriggerModel = Ember.Object.extend({
  
  string : function() {
    
    if ( this.region ) {
      
      return 'click in area ' + this.region.string();
      
    } else if ( this.gameObject ) {
    
      return 'click on ' + this.gameObject.name;
    
    } else {
      
      return 'click on ' + this.parentGameObject.name;
      
    }
    
  }.property( 'gameObject', 'area' ),
  
});

var ContactTriggerModel = Ember.Object.extend({
  
  string : function() {
    
    var str = this.parentGameObject.name + ( this.type === 'touch' ? ' touches ' : ' overlaps ' );
    
    if ( this.region ) {
      
      str += 'area ' + this.region.string();
      
    } else if ( this.gameObject ) {
    
      str += this.gameObject.name;
    
    }
    
    return str;
    
  }.property( 'gameObject', 'area' ),
  
});

var TimeTriggerModel = Ember.Object.extend({
  
  string : function() {
    
    if ( this.time2 ) {
      
      return 'randomly after ' + this.time + '-' + this.time2 + '% of the game';
      
    } else {
      
      return 'after ' + this.time + '% of the game';
      
    }
    
  }.property( 'time', 'time2' ),
  
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