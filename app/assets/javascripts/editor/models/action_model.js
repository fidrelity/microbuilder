var MoveActionModel = Ember.Object.extend({
  
  string : function() {
    
    var type = this.type,
      name = this.parentGameObject.name,
      other = this.gameObject ? this.gameObject.name : 'location ' + this.position.string();
    
    if ( this.region ) {
      
      other = 'area ' + this.region.string();
      
    }
    
    if ( type === 'moveTo' ) {
      
      name += ' moves to ' + other;
      
    } else if ( type === 'jumpTo' ) {
      
      name += ' jumps to ' + other;
      
    } else if ( type === 'moveIn' ) {
      
      if ( this.random ) {
        
        name += ' moves in random direction';
        
      } else if ( this.direction ) {
      
        name += ' moves in direction ' + Math.floor( this.angle() * -1 / Math.PI * 180 ) + '˚';
      
      } else {
        
        name += ' moves in direction of ' + other;
        
      }
      
    } else if ( type === 'swap' ) {
      
      name += ' swaps position with ' + other;
      
    } else if ( type === 'roam' ) {
      
      name += ' roams in ' + this.mode + ' mode within ' + other;
      
    } else if ( type === 'stop' ) {
      
      name += ' stops moving';
      
    }
    
    name += this.offset.norm() ? ' - offset ' + this.offset.string() : '';
    name += this.addSpeed ? ' - ' + this.speeds[ this.speed ] : '';
    
    return name;
    
  }.property( 'type', 'position', 'gameObject', 'random', 'mode', 'region', 'speed', 'offset' )
  
});

var ArtActionModel = Ember.Object.extend({
  
  string : function() {
    
    var name = this.parentGameObject.name;
    
    if ( this.frame2 ) {
      
      if ( this.mode === 'loop' ) {
        
        name += ' loops';
        
      } else if ( this.mode === 'ping-pong' ) {
        
        name += ' plays ping-pong';
        
      } else {
        
        name += ' animates once';
        
      }
      
      name += ' from frame ' + this.frame + ' to ' + this.frame2 + ' - ' + this.speeds[ this.speed ];
      
    } else if ( this.frame ) {
      
      name += ' displays frame ' + this.frame;
      
    } else if ( this.graphic ) {
      
      name += ' changes art to ' + this.graphic.name;
      
    } else {
      
      name += ' stops the animation';
      
    }
    
    return name;
    
  }.property( 'frame', 'frame2', 'mode', 'speed' ),
  
});

var WinLoseActionModel = Ember.Object.extend({
  
  string : function() {
    
    return this.type + ' the game';
    
  }.property( 'type' ),
  
});
