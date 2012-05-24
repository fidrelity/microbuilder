var Notification = function(_msg, _type) {
  this.msg = _msg;
  this.type = _type;
};

var Notifier = {

  queue : [],
  FADE_OUT_TIME : 6000,

  init : function() {
    Notifier.wrapper = $('#flash-messages');
    Notifier.list = Notifier.wrapper.find("ul");
    Notifier.templateLi = Notifier.list.find("#flash-template");
  },

  add : function(_msg, _type) {
    if(!_msg) return false;
    var type = _type || "info";

    Notifier.queue.push(new Notification(_msg, _type));
  },

  notify : function () {
    for (var i = 0; i < Notifier.queue.length; i++) {
      Notifier.append(Notifier.queue[i]);
    };

    setTimeout(function() { 
      Notifier.list.find(".alert-success").fadeOut(1000);
    }, Notifier.FADE_OUT_TIME);
  },

  append : function(notification) {
    var clone = Notifier.templateLi.clone().removeAttr("id").hide();
    clone.html(notification.msg).addClass("alert-" + notification.type).show();
    Notifier.list.append(clone);
  },

  clear : function() {
    Notifier.list.find("li").not("#flash_template").remove();
  }

};