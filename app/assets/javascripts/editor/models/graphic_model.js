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
    "frame_height":64
  }
*/

var GraphicModel = Ember.Object.extend({
  
  ID : null,
  name : null,
  userName : null,
  
  imagePath : null,
  
  isBackground : false,
  isPublic : false,
  
  frameCount : 1,
  frameWidth : null,
  frameHeight : null,
  totalWidth : null,

  init : function() {

    this.resizeWidth = this.frameWidth <= 96 ? this.frameWidth :  ((this.frameWidth * this.frameCount) / 2);
  
  },
  
  getData : function() {
    
    return {
      ID : this.ID,
      frameCount : this.frameCount,
      imagePath : this.imagePath
    }
    
  },
  
  imageWidth : function() {
    
    return this.frameCount * this.frameWidth;
    
  }.property( 'frameCount', 'frameWidth' )
  
});
