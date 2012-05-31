var ClickTrigger = function() {
  
  this.gameObject = null;
  this.area = null;
  
};

ClickTrigger.prototype = {
  
  check : function( game ) {
    
    if ( game.mouse.clicked ) {
      
      if ( this.gameObject ) {
      
        return this.gameObject.getArea().contains( game.mouse.pos );
      
      } else {
        
        return this.area.contains( game.mouse.pos );
        
      }
      
    }
    
    return false;
    
  },
  
  draw : function( ctx ) {
    
    if ( this.area ) {
      
      ctx.strokeStyle = '#F77';
      this.area.draw( ctx );
      
    }
    
  }
  
};


var ContactTrigger = function() {
  
  this.gameObject = null;
  this.gameObject2 = null;
  
  this.area = null;
  
  triggered = false;
  
};

ContactTrigger.prototype = {
  
  check : null,
  
  checkTouch : function() {
    
    var overlaps = this.checkOverlap();
    
    if ( this.triggered && !overlaps ) {
      
      this.triggered = false;
      
    } else if ( !this.triggered && overlaps ) {
      
      this.triggered = true;
      
      return true;
      
    }
    
    return false;
    
  },
  
  checkOverlap : function() {
    
    if ( this.area ) {
      
      return this.gameObject.getArea().overlaps( this.area );
      
    } else {
      
      return this.gameObject.getArea().overlaps( this.gameObject2.getArea() );
      
    }
    
  },
  
  draw : function( ctx ) {
    
    if ( this.area ) {
      
      ctx.strokeStyle = '#F84';
      this.area.draw( ctx );
      
    }
    
  }
  
};