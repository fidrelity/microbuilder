var StorageView = Ember.View.extend({
  
  templateName : 'editor/templates/storage_template',
  
  didInsertElement : function() {
    
    this.games = [];
    
    for(var i in window.localStorage){
       this.game = localStorage.getItem(i);
       try {
         json = JSON.parse(this.game);
         if(json != null && this.game.length>56) this.games.push(this.game);
       }
       catch(err) {
         // showHelp might crash the json parser
       }
       
    }
    
    if (this.games.length > 0) {
      $.each(this.games, function(index, value) {
        
        $('#localGames').append('<li onclick="App.storageLoad('+(index+1)+')">Game'+(index+1)+'</li>');
        
      })
      
      //console.log(this.games);
    
    }
    
    else {
    
      $('#storageView').remove();
    
    }
  
  }
  
});