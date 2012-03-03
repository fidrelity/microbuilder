/*
  LibraryController
  
  - attribute assetController tells whether backgrounds or graphics can be selected
*/

var LibraryController = Ember.Object.extend({

  assetController : null,

  init : function() {
    
    this.assetController = App.graphicsController;
    
  }

});