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
      zoom = 96 / Math.max( g.frameWidth, g.frameHeight ),
      width = g.frameWidth * zoom,
      height = g.frameHeight * zoom,
      offset = { x: Math.floor( ( 96 - g.frameWidth * zoom ) * 0.5 ), y: Math.floor( ( 96 - height ) * 0.5 ) };
    
    return 'width:' + width + 'px;height:' + height + 'px;position:relative;top:' + offset.y + 'px;left:' + offset.x + "px;" +
      'background-image:url("' + g.imagePath + '");background-size:' + width * g.frameCount + "px " + height + "px;";
    
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
