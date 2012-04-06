var LibraryView = Ember.View.extend({
  
  templateName : 'templates_library_template'
  
});

var GraphicView = Ember.View.extend({

  name : '',
  imagePath : '',

  width : 0,
  height : 0,

  templateName : 'templates_graphic_template',
  
  imageStyle : function() {
    
    return this.get( 'imagePath' );
    //return "background-image: url(" + this.get( 'imagePath' ) + "); width:" + this.get( 'width' ) + "px;height:" + this.get( 'height' ) + "px";
    
  }.property( 'imagePath', 'width', 'height' )

});