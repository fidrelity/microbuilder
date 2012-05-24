var Notifier = {


  init : function() {
    Notifier.wrapper = $('#flash_messages');
    Notifier.list = Notifier.wrapper.find("ul");
    Notifier.templateLi = Notifier.wrapper.find("#flash_template");
  },

  add : function(_msg, _type) {
    if(!_msg) return false;
    var type = _type || "info";

    switch(type) {
      case('success') : Notifier.add_success(_msg); break;
      case('info')    : Notifier.add_info(_msg); break;
      case('error')   : Notifier.add_error(_msg); break;
    }
  },

  add_error : function (_msg) {
    Notifier.append(_msg, 'error');
  },

  add_info : function (_msg) {
    Notifier.append(_msg, 'info');
  },

  add_success : function (_msg) {
    Notifier.append(_msg, 'success');

    setTimeout(function() { 
      Notifier.list.find(".alert-success").fadeOut(1000);
    }, 2000);
  },

  append : function(_msg, _type) {
    var clone = Notifier.templateLi.clone().removeAttr("id").hide();
    clone.html(_msg).addClass("alert-" + _type);
    Notifier.list.append(clone).fadeIn(300);
  },

  clear : function() {
    Notifier.list.find("li").not("#flash_template").remove();
  }

}

Notifier.init();