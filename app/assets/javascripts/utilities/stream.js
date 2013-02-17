var Stream = function() {

  this.pusher = null;
  this.channel = null; 

  this.streamWrapper = $('.activity-list');

  this.showSpeed = 700;

};

Stream.prototype.editLink = function(_obj, _target, _title) {

  _obj.html(_title).attr("href", _target);

};

// ----------------------
GameStream = function() {

  this.liClass = "create-activity";

};

GameStream.prototype = new Stream();
GameStream.prototype.constructor = Stream;

extend( GameStream.prototype, {

  push : function( _data ) {

    var authorName = _data.game_author_name;
    //var authorId = _data.game_author_id;
    var gameTitle = _data.game_title;
    //var gameId = _data.game_id;
    var gameImgPath = _data.game_img_path;

    var authorPath = _data.author_path;
    var gamePath = _data.game_path;

    // DOM elemtens
    var clone = this.streamWrapper.find('.' + this.liClass).first().clone().hide();

    var avatarObj = clone.find(".avatar-stream").find(".stream-image");
    var authorLinkObj = clone.find(".stream-user");
    var popUpObj = clone.find(".stream-popup");

    // Insert data
    this.editLink(authorLinkObj, gamePath, authorName);

    

    // Show
    clone.prependTo(this.streamWrapper).show(this.showSpeed);

    return this;

  }

});


// ----------------------
RateStream = function() {

};

// ----------------------
GraphicStream = function() {

};

// ----------------------
PublishGraphicStream = function() {

};


