var GameEditor = function() {
    
}

GameEditor.prototype = {
    
    data : {},
    
    init : function() {
        
        this.gameObjects = [];
        this.background = null;
        this.name = "";
        this.instructions = "";
        this.duration = 0;
        
        this.fsm = new StateMachine(this);
        
        this.fsm.init({

          initial : 'default',

          states : [
            { name : 'default' },
            { name : 'test' },
            { name : 'background_select' },
            { name : 'background_draw' },
            { name : 'object_select' },
            { name : 'object_draw' },
            { name : 'placement' }
          ],

          transitions : [
          
            { name : 'select_background', from : 'default', to: 'background_select', callback: this.onSelectBackground },
            { name : 'new_background', from : 'background_select', to: 'background_draw' },
            { name : 'add_background', from : 'background_draw', to: 'default' },
            { name : 'cancel_background', from : 'background_draw', to: 'background_select' },
            { name : 'selected_background', from : 'background_select', to: 'default' },
            { name : 'no_background', from: 'background_select', to: 'default'},
            
            { name : 'select_object', from : 'default', to: 'object_select', callback: this.onSelectObject },
            { name : 'new_object', from : 'object_select', to: 'object_draw' },
            { name : 'add_object', from : 'object_draw', to: 'placement' },
            { name : 'cancel_object', from : 'object_draw', to: 'object_select' },
            { name : 'place_object', from: 'placement', to: 'default' },
            // { name : 'selected_object', from: 'object_select', to: 'placement', callback: this.onSelectedObject},
            { name : 'selected_object', from: 'object_select', to: 'default', callback: this.onSelectedObject},
            { name : 'no_object', from: 'object_select', to: 'default' }
            
          ]

        });
        
        this.initClickHandlers();
        
    },
    
    initClickHandlers : function() {
        
        var self = this,
            fsm = this.fsm;
        
        $('#background_button').click(function(e) {
            
            fsm.select_background();
            e.preventDefault();
            
        });
        
        $('#add_object_button').click(function(e) {
            
            fsm.select_object();
            e.preventDefault();
            
        });
        
        $('.asset').live('click', function(e) {
            
            if ( fsm.hasState( 'object_select' ) ) {
                
                fsm.selected_object();
                self.addGameObject( $(this).data('id'), $("> img", this).attr('src') );
                
            }
            
            e.preventDefault();
            
        });
        
    },
    
    parse : function( gameData ) {
      
      
    },
    
    compile : function() {
    
        return {};
    
    },
    
    onSelectBackground : function( fsm ) {
        
        this.open( 'background_library', function() {
          
          fsm.no_background();
          
        });
        
    },
    
    onSelectObject : function ( fsm ) {
        
        this.open( 'assets_library', function() {
          
          fsm.no_object();
          
        });
        
    },
    
    onSelectedObject : function(fsm) {
        
        this.close( 'assets_library' );
        
    },
    
    addGameObject : function(id, filename) {
        
        $('#objects').append("<img src="+filename+" data-id="+id+" />");
        
        this.gameObjects.push({ 'id' : id, 'filename' : filename });
        
    },
    
    open : function( name, onClose ) {
      
      onClose = onClose || function(){};
      
      $('#' + name).lightbox_me({
            centered : true,
            'onClose' : onClose
      });
      
    },
    
    close : function( name ) {
      
      $('#' + name).trigger('close');
      
    }

}