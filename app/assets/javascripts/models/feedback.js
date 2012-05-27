var Feedback = {
  wrapper : null,
  textarea : null,
  subject : null,

  init : function() {
    Feedback.wrapper = $("#feedback");
    $('.showFeedback').click(function() { Feedback.show(); });
    $('.closeFeedback').click(function() { Feedback.close(); });
    Feedback.textarea = Feedback.wrapper.find("#body");
    Feedback.subject = Feedback.wrapper.find("#subject");
  },

  show : function() {
    Feedback.clear();
    if(Feedback.wrapper.is(":visible")) {
      Feedback.close();
    } else {
      var newX = ($(document).width() / 2) - (Feedback.wrapper.width() / 2);
      var newY = 200;
      Feedback.wrapper.css({left: newX, top: newY}).fadeIn(800);
      Feedback.subject.focus();
    }
  },

  clear : function() {
    Feedback.subject.val("");
    Feedback.textarea.val("");
    Feedback.textarea.removeClass("errorForm");
  },

  close : function(_time) {
    var _time = _time || 0;
    Feedback.wrapper.hide(_time);    
  }
};