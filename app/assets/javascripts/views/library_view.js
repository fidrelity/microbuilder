var LibraryView = Ember.View.extend({
  
  templateName : 'templates_library_template'
  
});

var GraphicOldView = Ember.View.extend({
  
  graphic : null,
  
  select : function() {
    
    var graphic = this.get('graphic');
    
    if ( graphic.isBackground ) {
      
      App.gameController.selectBackground( graphic );
      
    } else {
    
      App.gameController.selectGraphic( graphic );
    
    }
    
  }
  
});

var GraphicView = Ember.View.extend({

  name : '',
  imagePath : '',

  width : 0,
  height : 0,

  templateName : 'templates_graphic_template',
  
  imageStyle : function() {
    
    return "background-image: url(" + this.get( 'imagePath' ) + "); width:" + this.get( 'width' ) + "px;height:" + this.get( 'height' ) + "px";
    
  }.property( 'imagePath', 'width', 'height' )

});