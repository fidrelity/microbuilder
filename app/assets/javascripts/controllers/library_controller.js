/*
  LibraryController
  
  - manages all graphics
*/

var LibraryController = Ember.ArrayController.extend({

  mode : null, // [ 'graphic', 'background' ]
  tabState : 'own', // [ 'own', 'public' ]

  content : [],

  display : [],

  init : function() {

    // load dummy graphics
    this.content.push(
      GraphicModel.create({ name : 'Mario', imagePath : '/assets/mario.png', isPublic : true }),
      GraphicModel.create({ name : 'Luigi', imagePath : '/assets/luigi.png', isPublic : true }),
      GraphicModel.create({ name : 'Plant', imagePath : '/assets/plant.png', isPublic : true }),
      GraphicModel.create({ name : 'Raidel', imagePath : 'https://s3.amazonaws.com/mbgfx/app/public/graphics/7/4_1331553640.png', isPublic : true }),
      
      GraphicModel.create({ name : 'Preview', imagePath : '/assets/preview.png', isBackground : true, isPublic : true }),
      GraphicModel.create({ name : 'Paper', imagePath : '/assets/paper.png', isBackground : true, isPublic : true })
    );
    
    var self = this;
    
    this.addObserver( 'mode', function() {
      
      self.updateDisplay( true );
      
    });
    
    this.addObserver( 'tabState', function() {
      
      self.updateDisplay( true );
      
    });
    
  },
  
  setMode : function( mode ) {
    
    this.set( 'mode', mode );
    
  },
  
  updateDisplay : function( load ) {
    
    var display = this.content,
      mode = this.get( 'mode' ),
      tabState = this.get( 'tabState' ),
      path = '';
    
    if ( mode === 'graphic' ) {
    
      display = display.filterProperty( 'isBackground', false );
    
      path = 'users/current/graphics';
    
    } else if ( mode === 'background' ) {
      
      display = display.filterProperty( 'isBackground', true );
      
      path = 'users/current/graphics/backgrounds';
      
    }
    
    if ( tabState === 'own' ) {
      
      display = display.filterProperty( 'isPublic', false );
      
    } else if ( tabState === 'public' ) {
      
      display = display.filterProperty( 'isPublic', true );
      
      path = 'graphics/public';
      
    }
    
    this.set( 'display', display );
    
    
    if ( load ) {
      
      this.loadGraphics( path );
      
    }
    
  },
  
  filter : function( key, value ) {
    
    this.set( 'display', this.content.filterProperty( key, value ) );
    
  },
  
  graphicSaved : function( data ) {
    
    this.apppendGraphics( [data] );
    
    App.gameController.searchGraphic();
    
  },
  
  loadGraphics : function( path ) {
    
    var self = this
    
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
    
    this.updateDisplay( false );
    
  },
  
  showOwn : function() {
    
    this.set( 'tabState', 'own' );
    
  },
  
  showPublic : function() {
    
    this.set( 'tabState', 'public' );
    
  }

});
