var StreamContainerView = Ember.ContainerView.extend({

  templateName : 'editor/templates/stream_template',

  classNames: ['stream-container']  
  
});

// ---------------------
// Game created message

var GameActivityView = Ember.View.extend({
  
  templateName: 'stream/templates/create_game_template',

  authorName : null,

  authorImage : null,

  authorPath : null,

  gameTitle : null,

  gamePath : null,

  gameImage : null

});

var UserOnGameView = Ember.View.extend({
  
  templateName: 'stream/templates/game_action_template',

  userName : null,
  
  userPath : null,
  
  userImage : null,

  authorName : null,

  authorPath : null,

  gameTitle : null,

  gamePath : null,

  gameImage : null,

  actionType : null

});

var GraphicActivityView = Ember.View.extend({
  
  templateName: 'stream/templates/create_graphic_template',

  authorName : null,

  authorImage : null,

  authorPath : null,

  graphicTitle : null,

  graphicPath : null,

  graphicImage : null,

  imageType : null

});