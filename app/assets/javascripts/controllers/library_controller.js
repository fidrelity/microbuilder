//= require ./../views/library_view

/*
  LibraryController
  
  - attribute assetController tells whether backgrounds or graphics can be selected
*/

var LibraryController = Ember.Object.extend({

  assetController : null,

  init : function() {
    
    this.set( "assetController", App.graphicsController );
    
  }

});


/*
  GraphicsController
  
  - manages the graphics for: 
      asset selection
      stamp tool in the paint application
*/

var GraphicsController = Ember.ArrayController.extend({

  content : [],

  viewClass : GraphicView,

  init : function() {
    
    // load dummy graphics
    this.content.push(
      GraphicModel.create({ name : 'Mario', imagePath : '/assets/mario.png' }),
      GraphicModel.create({ name : 'Luigi', imagePath : '/assets/luigi.png' }),
      GraphicModel.create({ name : 'Plant', imagePath : '/assets/plant.png' })
    );
    
  }

});


/*
  BackgroundsController
  
  - manages the backgrounds
*/

var BackgroundsController = Ember.ArrayController.extend({

  content : [],

  viewClass : BackgroundView,

  init : function() {
    
    // load dummy graphics
    this.content.push(
      BackgroundModel.create({ imagePath : '/assets/preview.png' }),
      BackgroundModel.create({ imagePath : '/assets/paper.png' })
    );
    
  }

});