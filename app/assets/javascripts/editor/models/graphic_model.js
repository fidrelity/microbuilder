/**
  GraphicModel in backend
  
  {
    "id":18,
    "name":"1332157251_2.png",
    "url":"/graphics/18/1332157251_2.png",
    "user_name":"Andre",
    "background":false,
    "frame_count":1,
    "frame_width":64,
    "frame_height":64,
    "is_own":true,
    "public":true,
  }
*/

var GraphicModel = Ember.Object.extend({
  
  ID : null,
  name : null,
  userName : null,
  
  imagePath : null,
  
  isBackground : false,
  isPublic : false,
  isOwn : false,
  
  frameCount : 1,
  frameWidth : 0,
  frameHeight : 0,
  
  divStyle : function() {
    
    var g = this,
      zoom, offset, width, height;
    
    if ( g.isBackground ) {
      
      return "background-image:url(" + g.imagePath + ");background-size:160px 98px;width:160px;height:98px;";
      
    } else {
      
      zoom = 96 / Math.max( g.frameWidth, g.frameHeight );
      
      if ( zoom < 1 ) {
        
        width = g.frameWidth * zoom;
        height = g.frameHeight * zoom;
        
      } else {
        
        width = g.frameWidth < 96 ? g.frameWidth : 96;
        height = g.frameHeight < 96 ? g.frameHeight : 96;
        
      }
      
      offset = { x: Math.floor( ( 96 - width ) * 0.5 ), y: Math.floor( ( 96 - height ) * 0.5 ) };
      
      return "background-image:url(" + g.imagePath + ");" + 
        "width:" + width + "px;height:" + height + "px;" + 
        "background-size:" + width * g.frameCount + "px " + height + "px;" + 
        "position:relative;top:" + offset.y + "px;left:" + offset.x + "px;";
      
    }
  
  }.property( 'frameWidth', 'frameHeight' ),
  
  getData : function() {
    
    return {
      ID : this.ID,
      frameWidth : this.frameWidth,
      frameHeight : this.frameHeight,
      frameCount : this.frameCount,
      url : this.imagePath
    }
    
  }
  
});
