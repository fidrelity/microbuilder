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
  graphicCount : 123,
  
  pages : function() {
    
    return Math.ceil( this.graphicCount / this.perPage );
    
  }.property( 'graphicCount', 'perPage' ),
  
  reset : function( _showBackground, _selectFunction ) {
    
    this.set( 'showBackground', _showBackground );
    this.set( 'selectFunction', _selectFunction );
    
    this.set( 'perPage', _showBackground ? 10 : 14 );
    this.set( 'size', this.sizes[0] );
    
    this.clear();
    
  },
  
  clear : function() {
    
    this.set( 'page', 1 );
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
  
  graphicSaved : function( data ) {
    
    this.appendGraphics( [data] );
    
    App.gameController.searchGraphic();
    
  },
  
  loadGraphics : function() {
    
    var path,
      self = this;
    
    if ( this.showBackground ) {
      
      if ( this.showOwn ) {
        
        path = 'users/current/graphics/backgrounds?';
        
      } else {
        
        path = 'graphics/public?backgrounds=true&';
        
      }
      
    } else {
      
      path = this.showOwn ? 'users/current/graphics' : 'graphics/public';
      
      path += '?min_size=' + this.size.min + '&max_size=' + this.size.max + '&';
      
    }
    
    path += 'page=' + this.page;
    
    console.log( path );
    
    $.ajax({
      url : path,
      type : 'GET',
      
      success: function( data ) {
        
        if ( data ) {
          
          if ( typeof data === "string" ) {
            
            data = JSON.parse( data );
            
          }
          
          console.log( data );
          
          self.appendGraphics( data.graphics, data.size );
        
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
    
    console.log( path );
    
    $.ajax({

      url : path,
      type : 'GET',
      data : { term: term, background : this.showBackground },
      
      success: function( data ) {
        
        if ( data ) {
          
          if ( typeof data === "string" ) {
            
            data = JSON.parse( data );            
            
          }
          
          console.log( data );
          
          self.appendGraphics( data.graphics, data.size );
        
        }
        
      }
      
    });

  },
  
  appendGraphics : function( graphics, size ) {
    
    var display = [], graphic;
    
    for ( var i = 0; i < graphics.length; i++ ) {
      
      graphic = this.parseGraphic( graphics[i] );
      
      if ( graphic ) {
        
        display.push( graphic );
        
      }
      
    }
    
    this.set( 'display', display );
    this.set( 'graphicCount', size );
    
    this.updateButtons();
    
  },
  
  parseGraphic : function( data ) {
    
    var graphic = this.content.findProperty( 'ID', data.id );
    
    if ( graphic ) {
      
      return graphic;
      
    } else if ( data.id ) {
      
      graphic = GraphicModel.create();
      this.extendGraphic( graphic, data );
      
      this.addObject( graphic );
      return graphic;
      
    }
    
    return null;
    
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
    
    if ( !this.showOwn ) {
      
      this.set( 'showOwn', true );
      this.clear();
      
      this.loadGraphics();
      
    }
    
  },
  
  showPublics : function() {
    
    if ( this.showOwn ) {
      
      this.set( 'showOwn', false );
      this.clear();
      
      this.loadGraphics();
      
    }
    
  },
  
  setSize : function( _index ) {
    
    if ( this.size !== this.sizes[_index] ) {
      
      this.set( 'size', this.sizes[_index] );
      this.clear();
      
      this.loadGraphics();
      
    }
    
  },
  
  next : function() {
    
    if ( this.page < Math.ceil( this.graphicCount / this.perPage ) ) {
      
      this.set( 'page', this.page + 1 );
      this.set( 'graphic', null );
      
      this.loadGraphics();
      
    }
    
  },
  
  previous : function() {
    
    if ( this.page > 1 ) {
      
      this.set( 'page', this.page - 1 );
      this.set( 'graphic', null );
      
      this.loadGraphics();
      
    }
    
  },
  
  select : function( _graphic ) {
    
    this.set( 'graphic', _graphic );
    
  },
  
  selectGraphic : function() {
    
    this.selectFunction.call( App.gameController, this.graphic );
    
  },
  
  updateButtons : function() {
    
    if ( this.page === 1 ) {
      
      $( '#previousButton' ).addClass( 'disabled' );
      
    } else {
      
      $( '#previousButton' ).removeClass( 'disabled' );
      
    }
    
    if ( this.page === Math.ceil( this.graphicCount / this.perPage ) ) {
      
      $( '#nextButton' ).addClass( 'disabled' );
      
    } else {
      
      $( '#nextButton' ).removeClass( 'disabled' );
      
    }
    
  }

});
