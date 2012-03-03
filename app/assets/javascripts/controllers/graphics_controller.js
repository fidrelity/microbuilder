/*
  GraphicsController
  
  - manages the graphics for: 
      asset selection
      stamp tool in the paint application
*/

//= require ./../views/library_view

var GraphicsController = Ember.ArrayController.extend({

  content : [],

  viewClass : GraphicsView,

  init : function() {
    
    // load dummy graphics
    this.content.push(
      GraphicModel.create({ name : 'Mario', imagePath : '/assets/mario.png' }),
      GraphicModel.create({ name : 'Luigi', imagePath : '/assets/luigi.png' }),
      GraphicModel.create({ name : 'Plant', imagePath : '/assets/plant.png' })
    );
    
  }

});
