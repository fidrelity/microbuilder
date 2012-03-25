/*
  LibraryController
  
  - manages all graphics
*/

var LibraryController = Ember.ArrayController.extend({

  mode : 'graphic',

  content : [],

  display : [],

  init : function() {

    // load dummy graphics
    this.content.push(
      GraphicModel.create({ name : 'Mario', imagePath : '/assets/mario.png' }),
      GraphicModel.create({ name : 'Luigi', imagePath : '/assets/luigi.png' }),
      GraphicModel.create({ name : 'Plant', imagePath : '/assets/plant.png' }),
      GraphicModel.create({ name : 'Raidel', imagePath : 'https://s3.amazonaws.com/mbgfx/app/public/graphics/7/4_1331553640.png' }),
      
      GraphicModel.create({ name : 'Preview', imagePath : '/assets/preview.png', isBackground : true }),
      GraphicModel.create({ name : 'Paper', imagePath : '/assets/paper.png', isBackground : true })
    );
    
  },
  
  setMode : function( mode ) {
    
    this.set( 'mode', mode );
    
    this.loadGraphics( mode === 'background' );
    this.updateDisplay();
    
  },
  
  updateDisplay : function() {
    
    if ( this.get( 'mode' ) === 'graphic' ) {
    
      this.filter( 'isBackground', false );
    
    } else {
      
      this.filter( 'isBackground', true );
      
    }
    
  },
  
  filter : function( key, value ) {
    
    this.set( 'display', this.content.filterProperty( key, value ) );
    
  },
  
  graphicSaved : function( data ) {
    
    this.apppendGraphics( [data] );
    
    App.gameController.searchGraphic();
    
  },
  
  loadGraphics : function( isBackground ) {
    
    var self = this,
      path = isBackground ? 'users/current/graphics/backgrounds' : 'users/current/graphics';
    
    $.ajax({
      url : path,
      type : 'GET',
      
      success: function( data ) {
        
        self.appendGraphics( data );
        
      }
      
    });
    
  },
  
  appendGraphics : function( data ) {
    
    for ( var i = 0; i < data.length; i++ ) {
      
      var d = data[i],
          filterID = this.content.filterProperty( 'ID', d.id );
      
      if ( !filterID.length ) {
      
        this.addObject(
          GraphicModel.create({
            ID : d.id,
            name : d.name,
            userName : d.user_name,
            imagePath : d.url,
            isBackground : d.background,
            frameCount : d.frame_count,
            frameWidth : d.frame_width,
            frameHeight : d.frame_height
          })
        );
      
      }
      
    }
    
    this.updateDisplay();
    
  }

});
