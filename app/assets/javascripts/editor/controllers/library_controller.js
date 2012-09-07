/*
  LibraryController
  
  - manages all graphics
*/

var LibraryController = Ember.ArrayController.extend({

  graphic : null,

  showBackground : false,
  showOwn : true,

  content : [],

  display : [],

  selectFunction : null,

  size : null,

  sizes : [
    {
      name : 'all',
      max : 256,
      min : 0
    },
    {
      name : 'small',
      max : 64,
      min : 0
    },
    {
      name : 'medium',
      max : 128,
      min : 64
    },
    {
      name : 'large',
      max : 256,
      min : 128
    }
  ],
  
  page : 1,
  maxPage : 0,
  perPage : 14,
  
  init : function() {
    
    var self = this;
    
    this.addObserver( 'showBackground', function() {
      
      this.perPage = this.showBackground ? 10 : 14;
      
      self.updateDisplay( true );   
      
    });
    
    this.addObserver( 'showOwn', function() {
      
      self.updateDisplay( true );
      
    });
    
    this.addObserver( 'size', function() {
      
      self.updateDisplay( true );
      
    });
    
  },
  
  reset : function( _showBackground, _selectFunction ) {
    
    this.set( 'showBackground', _showBackground );
    this.set( 'selectFunction', _selectFunction );
    
    this.set( 'size', this.sizes[0] );
    this.set( 'graphic', null );
    
  },
  
  width : function() {
    
    return this.showBackground ? 905 : 813;
    
  }.property( 'showBackground' ),
  
  thumbSizeWidth : function() {
    
    return ( this.showBackground ? 160 : 96 );
    
  }.property( 'showBackground' ),
  
  thumbSizeHeight : function() {
    
    return ( this.showBackground ? 98 : 96 ) + 22;
    
  }.property( 'showBackground' ),
  
  updateDisplay : function( load, page ) {
    
    var display = this.content;
      
    page = page || 1;
    
    display = display.filterProperty( 'isBackground', this.showBackground );
    
    if ( this.showOwn ) {
    
      display = display.filterProperty( 'isOwn', true );
    
    } else {
    
      display = display.filterProperty( 'isPublic', true );
    
    }
    
    if ( !this.showBackground ) {
      
      display = this.filterSize( display );
      
    }
    
    display = this.filterPage( display, page );
    
    if ( display.length ) {
      
      this.set( 'display', display );
      
    }
    
    if ( load && ( display.length < this.perPage || page === 1 ) ) {
      
      this.loadGraphics( page );
      
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
  
  loadGraphics : function( page ) {
    
    var path,
      self = this;
    
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
      
    }
    
    $.ajax({
      url : path,
      type : 'GET',
      
      success: function( data ) {
        
        if ( data ) {
          
          if ( typeof data === "string" ) {
            
            data = JSON.parse( data );
            
          }
        
          self.appendGraphics( data, page );
        
        }
        
      }
      
    });
    
  },

  // Search a graphic by name
  search : function() {

    var term = $(".graphicSearchField").val();
    if(!term.length) return false;

    var path = '/graphics/search';
    var self = this;

    this.set("content", []);
    
    $.ajax({

      url : path,
      type : 'GET',
      data : { term: term, background : this.showBackground },
      
      success: function( data ) {
        
        if ( data ) {
          
          if ( typeof data === "string" ) {
            
            data = JSON.parse( data );            
            
          }
        
          self.appendGraphics( data, 1);
        
        }
        
      }
      
    });

  },
  
  appendGraphics : function( data, page ) {
    
    if ( !data.length ) {
      
      this.updateDisplay( false, this.page );
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
    
    var filterID = this.content.findProperty( 'ID', data.id ),
      graphic;
    
    if ( !filterID && data.id ) {
    
      graphic = GraphicModel.create();
      this.extendGraphic( graphic, data );
      
      if ( page === 1 ) {
      
        this.unshiftObject( graphic );
      
      } else {
        
        this.addObject( graphic );
        
      }
    
    }
    
  },
  
  loadGraphic : function( data ) {
    
    var graphic = GraphicModel.create({
      ID : data.ID,
      imagePath : data.url,
      frameWidth : data.frameWidth,
      frameHeight : data.frameHeight,
      frameCount : data.frameCount
    }), self = this;
    
    this.addObject( graphic );
    
    $.ajax({
      url : '/graphics/' + data.ID,
      type : 'GET',
      
      success: function( data ) {
        
        if ( data ) {
          
          if ( typeof data === "string" ) {
            
            data = JSON.parse( data );
            
          }
        
          self.extendGraphic( graphic, data );
        
        }
        
      }
      
    });
    
  },
  
  getGraphic : function( graphicID ) {
    
    return this.content.findProperty( 'ID', graphicID );
    
  },
  
  extendGraphic : function( graphic, data ) {
    
    var d = data;
    
    graphic.setProperties({
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
  
  select : function( _graphic ) {
    
    this.set( 'graphic', _graphic );
    
  },
  
  selectGraphic : function() {
    
    this.selectFunction.call( App.gameController, this.graphic );
    
  }

});
