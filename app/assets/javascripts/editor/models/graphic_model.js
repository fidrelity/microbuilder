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
  
  imagePath : 'assets/mario.png',
  
  isBackground : false,
  isPublic : false,
  isOwn : false,
  
  frameCount : 1,
  frameWidth : 32,
  frameHeight : 32,
  totalWidth : 0,
  
  init : function() {
    
    this.computeStyle();
    
  },
  
  computeStyle : function() {
    
    var g = this,
      zoom = 64 / Math.max( g.frameWidth, g.frameHeight ),
      width = g.frameWidth * zoom * g.frameCount,
      height = g.frameHeight * zoom;
    
    this.set( 'divStyle', 'width:64px;height:64px;background-image:url("' + g.imagePath + '");background-size:' + width + "px " + height + "px;" );
    
  },
  
  getData : function() {
    
    return {
      ID : this.ID,
      frameCount : this.frameCount,
      imagePath : this.imagePath
    }
    
  }
  
});
