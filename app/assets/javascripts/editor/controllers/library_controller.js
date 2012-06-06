/*
  LibraryController
  
  - manages all graphics
*/

var LibraryController = Ember.ArrayController.extend({

  showBackground : false,
  showOwn : true,

  content : [],

  display : [],

  selectFunction : null,

  size : null,

  sizes : [
    {
      name : 'small',
      max : 64,
      min : 0,
      string : 'small (64 x 64)'
    },
    {
      name : 'medium',
      max : 128,
      min : 64,
      string : 'medium (128 x 128)'
    },
    {
      name : 'big',
      max : 256,
      min : 128,
      string : 'big (256 x 256)'
    }
  ],
  
  page : 1,
  maxPage : 0,
  perPage : 12,

  init : function() {

    // load dummy graphics
    // this.content.push(
    //   GraphicModel.create({ ID : -1, name : 'Mario', imagePath : '/assets/mario.png', isPublic : true, frameWidth: 64, frameHeight: 64 }),
    //   GraphicModel.create({ ID : -2, name : 'Luigi', imagePath : '/assets/luigi.png', isPublic : true, frameWidth: 96, frameHeight: 65 }),
    //   GraphicModel.create({ ID : -3, name : 'Plant', imagePath : '/assets/plant.png', isPublic : true, frameWidth: 103, frameHeight: 128 }),
    //   GraphicModel.create({ ID : -4, name : 'Sprite', imagePath : '/assets/marioSprite.png', isPublic : true, frameWidth: 128, frameHeight: 128, frameCount: 5 }),
    //   
    //   GraphicModel.create({ ID : -5, name : 'Preview', imagePath : '/assets/preview.png', isBackground : true, isPublic : true, frameWidth: 640, frameHeight: 390 }),
    //   GraphicModel.create({ ID : -6, name : 'Paper', imagePath : '/assets/paper.png', isBackground : true, isPublic : true, frameWidth: 640, frameHeight: 390 })
    // );
    
    var self = this;
    
    this.set( 'size', this.sizes[0] );
    
    this.addObserver( 'showBackground', function() {
      
      self.updateDisplay( true );   
      
    });
    
    this.addObserver( 'showOwn', function() {
      
      self.updateDisplay( true );
      
    });
    
    this.addObserver( 'size', function() {
      
      self.updateDisplay( true );
      
    });
    
  },
  
  thumbSizeWidth : function() {
    
    return this.showBackground ? 210 : this.size.max;
    
  }.property( 'size', 'showBackground' ),
  
  thumbSizeHeight : function() {
    
    return ( this.showBackground ? 130 : this.size.max ) + 25;
    
  }.property( 'size', 'showBackground' ),
  
  updateDisplay : function( load, page ) {
    
    var display = this.content,
      path = '';
      
    page = page || 1;
    
    display = display.filterProperty( 'isBackground', this.showBackground );
    
    if ( this.showOwn ) {
    
      display = display.filterProperty( 'isOwn', true );
    
    } else {
    
      display = display.filterProperty( 'isPublic', true );
    
    }
    
    if ( this.showBackground ) {
      
      if ( this.showOwn ) {
        
        path = 'users/current/graphics/backgrounds?page=' + page;
        
      } else {
        
        path = 'graphics/public?backgrounds=true&page=' + page;
        
      }
      
    } else {
      
      path = this.showOwn ? 'users/current/graphics' : 'graphics/public';
      
      path += '?min_size=' + this.size.min + '&max_size=' + this.size.max;
      
      path += '&page=' + page;
      
      display = this.filterSize( display );
      
    }
    
    display = this.filterPage( display, page );
    
    this.set( 'display', display );
    
    if ( load && ( display.length < this.perPage || page === 1 ) ) {
      
      this.loadGraphics( path, page );
      
    } else {
      
      this.set( 'page', page );
      
    }
    
  },
  
  filterSize : function( graphics ) {
    
    var result = [];
    
    for ( var i = 0; i < graphics.length; i++ ) {
      
      if ( graphics[i].frameWidth <= this.size.max && graphics[i].frameHeight <= this.size.max && 
        ( graphics[i].frameWidth > this.size.min || graphics[i].frameHeight > this.size.min ) ) {
        
        result.push( graphics[i] );
        
      }
      
    }
    
    return result;
    
  },
  
  filterPage : function( graphics, page ) {
    
    return graphics.splice( ( page - 1 ) * this.perPage, this.perPage );
    
  },
  
  graphicSaved : function( data ) {
    
    this.appendGraphics( [data] );
    
    App.gameController.searchGraphic();
    
  },
  
  loadGraphics : function( path, page ) {
    
    var self = this;
    
    $.ajax({
      url : path,
      type : 'GET',
      
      success: function( data ) {
        
        if ( data ) {
          
          if (typeof data === "string") {
            
            data = JSON.parse( data );
            
          }
        
          self.appendGraphics( data, page );
        
        }
        
      }
      
    });
    
  },
  
  appendGraphics : function( data, page ) {
    
    if ( !data.length ) {
      
      this.updateDisplay( false, this.page );
      
      //TODO disable next
      
      return;
      
    }
    
    if ( page === 1 ) {
      
      for ( var i = data.length - 1; i >= 0; i-- ) {
      
        this.parseGraphic( data[i], page );
      
      }
      
    } else {
    
      for ( var i = 0; i < data.length; i++ ) {
      
        this.parseGraphic( data[i], page );
      
      }
    
    }
    
    this.updateDisplay( false, page );
    
  },
  
  parseGraphic : function( data, page ) {
    
    var d = data,
      filterID = this.content.filterProperty( 'ID', d.id ),
      graphic;
    
    if ( !filterID.length && d.id ) {
    
      graphic = GraphicModel.create({
        ID : d.id,
        name : d.name,
        userName : d.user_name,
        imagePath : d.url,
        isBackground : d.background,
        isPublic : d.public,
        isOwn : d.is_own,
        frameCount : d.frame_count,
        frameWidth : d.frame_width,
        frameHeight : d.frame_height
      });
      
      if ( page === 1 ) {
      
        this.unshiftObject( graphic );
      
      } else {
        
        this.addObject( graphic );
        
      }
    
    }
    
  },
  
  showOwns : function() {
    
    this.set( 'showOwn', true );
    
  },
  
  showPublics : function() {
    
    this.set( 'showOwn', false );
    
  },
  
  next : function() {
    
    this.updateDisplay( true, this.page + 1 );
    
  },
  
  previous : function() {
    
    if ( this.page > 1 ) {
    
      this.updateDisplay( true, this.page - 1 );
    
    }
    
  },

});
