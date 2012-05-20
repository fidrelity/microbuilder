$(document).ready(function() {  

  /* Pusher Events*/
  var pusher = new Pusher('a4bc39aab42024a54d27');

  // -----------------------------------------------
  // New Game
  var channel = pusher.subscribe('game_channel');

  channel.bind('newgame', function(data) {
    var gameObj = $('#game-li-template').clone();
    var content = gameObj.find('.thumbnail');
    content.prepend('<a href="/users/'+data.author_id+'">by '+data.author+'</a>');
    content.prepend('<h4>'+data.name+'</h4>');
    content.prepend('<img src="/assets/game.png" alt="Game">');

    $(".thumbnails").prepend(gameObj);
    gameObj.fadeIn(1000);
    $(".thumbnails").find('.span2').last().remove()
  });

  // -----------------------------------------------
});