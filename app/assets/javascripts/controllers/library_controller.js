/*
  LibraryController
  
  - manages all graphics
*/

var LibraryController = Ember.ArrayController.extend({

  content : [],

  display : [],

  init : function() {

    // load dummy graphics
    this.content.push(
      GraphicModel.create({ name : 'Mario', imagePath : '/assets/mario.png' }),
      GraphicModel.create({ name : 'Luigi', imagePath : '/assets/luigi.png' }),
      GraphicModel.create({ name : 'Plant', imagePath : '/assets/plant.png' }),
      
      GraphicModel.create({ name : 'Preview', imagePath : '/assets/preview.png', isBackground : true }),
      GraphicModel.create({ name : 'Paper', imagePath : '/assets/paper.png', isBackground : true })
    );
    
  },
  
  filter : function( key, value ) {
    
    this.set( 'display', this.content.filterProperty( key, value ) );
    
  }

});