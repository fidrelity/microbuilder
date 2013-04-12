/*
  Todo>
    - separate public / private stream    
    - multiple inserts when Stream.create
    - reinit jsScrollPane
    - fancy prepend effect
*/

var StreamContainerView = Ember.ContainerView.extend({

  templateName : 'editor/templates/stream_template',

  tagName : "ul",

  classNames: ['stream-container'],

  pusher : null,

  didInsertElement : function() {

    this.loadStream();

    this.registerPusherEvents();

  },

  loadStream : function() {

    var self = this;

     $.ajax({

      url : "/stream/public_stream",

      type : 'GET',
      
      success: function( data ) {
        
        if ( data ) {
          
          if ( typeof data === "string" ) {
            
            data = JSON.parse( data );
            
          }
          
          self.displayMessages(data);  
        
        }
        
      }
      
    });

  },

  registerPusherEvents : function() {

    // Create Game Activity
    var stream_channel = this.pusher.subscribe('stream_channel');

    var self = this;

    stream_channel.bind('game_create', function(data) {

      self.addGameMessage(data);

    });

    // Graphic created
    stream_channel.bind('graphic_create', function(data) {      
      
      self.addGraphicMessage(data);

    });

    // Game action created - like, dislike, commented
    stream_channel.bind('game_action', function(data) {

      self.addGameActionMessage(data);

    });

  },

  displayMessages : function(messages) {

    messages.reverse();

    var messageLength = messages.length;

    for ( var i = 0; i < messageLength; i++ ) {

      this.addMessage( messages[i] );

    }

  },

  addMessage : function(data) {

    if (!data) return false;

    var type = data.type;    

    switch(type) {

      case("game") : this.addGameMessage(data);
                     break;

      case("graphic") : this.addGraphicMessage(data); 
                        break;

      case("graphic_publish") : this.addGraphicMessage(data, 'published');
                                break;

      case("like") :  this.addGameActionMessage(data); 
                      break;

      case("dislike") : this.addGameActionMessage(data); 
                        break;

      case("comment") : this.addGameActionMessage(data);
                        break;
    }

  },

  addGameMessage : function(data) {

    this.get('childViews').unshiftObject( GameActivityView.create({
      authorName : data.authorName,
      authorPath : data.authorPath,
      authorImage : data.authorImage,
      gameTitle : data.gameTitle,
      gamePath : data.gamePath,
      gameImage : data.gameImage
    }) );

    return this;

  },

  addGraphicMessage : function(data, publishedVerb) {

    var verb = publishedVerb || 'painted';

    this.get('childViews').unshiftObject( GraphicActivityView.create({
      authorName : data.authorName,
      authorPath : data.authorPath,
      authorImage : data.authorImage,
      graphicTitle : data.graphicTitle,
      graphicPath : data.graphicPath,
      imageType : data.imageType,
      verb : verb
    }) );

    return this;

  },

  addGameActionMessage : function(data) {
    
    this.get('childViews').unshiftObject( UserOnGameView.create({
      userName : data.userName,
      userPath : data.userPath,
      userImage : data.userImage,
      authorName : data.authorName,
      authorPath : data.authorPath,          
      gameTitle : data.gameTitle,
      gamePath : data.gamePath,
      gameImage : data.gameImage,
      actionType : data.actionType // liked, disliked, commented on
    }) );

    return this;

  }
  
});

// ---------------------
// Game created message

var GameActivityView = Ember.View.extend({

  didInsertElement : function() { 

    reinitStreamPopUp();

  },
  
  templateName: 'stream/templates/create_game_template',

  authorName : null,

  authorImage : null,

  authorPath : null,

  gameTitle : null,

  gamePath : null,

  gameImage : null,

  popUpThumb : function() {

    return '<img src="' + this.get("gameImage") + '">';
    
  }.property("gameImage")

});

// For: like, dislike, comment - on game
var UserOnGameView = Ember.View.extend({
  
  templateName: 'stream/templates/game_action_template',

  didInsertElement : function() { 

    reinitStreamPopUp();    

  },

  userName : null,
  
  userPath : null,
  
  userImage : null,

  authorName : null,

  authorPath : null,

  gameTitle : null,

  gamePath : null,

  gameImage : null,

  actionType : null,

  isAnonymous : function() {

    return this.get('userName') === 'Anonymous' || this.get('userName').length === 0;

  }.property("userName"),

  popUpThumb : function() {

    return '<img src="' + this.get("gameImage") + '">';
    
  }.property("gameImage"),

  userIsAuthor : function() {

    return this.get('authorName') === "your";

  }.property("authorName")

});

// Graphic created message
var GraphicActivityView = Ember.View.extend({

  didInsertElement : function() { 

    reinitStreamPopUp();

  },
  
  templateName: 'stream/templates/create_graphic_template',

  authorName : null,

  authorImage : null,

  authorPath : null,

  graphicTitle : null,

  graphicPath : null,

  imageType : null,

  verb : 'painted',

  popUpThumb : function() {

    return '<img src="' + this.get("graphicPath") + '">';
    
  }.property("graphicPath")

});

//
function reinitStreamPopUp() {

  $('.stream-popup').popover({ placement: 'right', trigger: 'hover' });

}