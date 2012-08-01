var SpritesView = Ember.CollectionView.extend({
  
  contentBinding : 'App.paintController.content',
  
  itemViewClass: Ember.View.extend({
    
    ctx : null,
    
    tagName : 'canvas',
    
    classNames : ['spriteView'],
    
    didInsertElement : function() {
      
      if ( this.$().length ) {
      
        var canvas = this.$()[0],
          ctx = canvas.getContext( '2d' ),
          self = this, data;
        
        canvas.width = App.paintController.width;
        canvas.height = App.paintController.height;
        
        data = this.content.load();
        
        if ( data ) {
          
          ctx.putImageData( data, 0, 0 );
          
        }
        
        this.addObserver( 'App.paintController.sprite', function() {
        
          if ( self.content === App.paintController.sprite ) {
          
            self.selectSelf();
          
          }
        
        });
        
        if ( this.content === App.paintController.sprite ) {
        
          this.selectSelf();
        
        }
        
        this.ctx = ctx;
      
      }
      
    },
    
    click : function() {
      
      this.selectSelf();
      
      App.paintController.setSpriteModel( this.content );
      
    },
    
    selectSelf : function() {
      
      var childs = this._parentView._childViews, i;
      
      for ( var i = 0; i < childs.length; i++ ) {
      
        childs[i].$().removeClass( 'selected' );
      
      }
      
      this.$().addClass( 'selected' );
      
    }
    
  })
  
});