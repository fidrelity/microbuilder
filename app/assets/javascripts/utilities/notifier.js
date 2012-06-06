// Single notification object
var Notification = function(_msg, _type) {
  this.msg = _msg;
  this.type = _type;
};

/*
  Notifier Object (05.2012)
    - works notification queue
    - Shows alert messages ('info, 'error', 'success')
*/
var Notifier = {

  queue : [],
  FADE_OUT_TIME : 6000,   // notes of type 'success' fade after this time out. Set to 0 to avoid this behavior
  wrapper: null,          // Surrounding wrapper of the messages

  init : function() { // call this, when document ready
    Notifier.wrapper = $('#flash-messages');
    Notifier.list = Notifier.wrapper.find("ul");
    Notifier.templateLi = Notifier.list.find("#flash-template");

    // Set close event
    Notifier.wrapper.find(".closeFlash").live("click", function() {
      $(this).parent().hide();
    });
    
    return Notifier;
  },

  // Add a new notification to queue
  add : function(_msg, _type) {
    if(!_msg) return false;
    var type = _type || "info";

    Notifier.queue.push(new Notification(_msg, _type));    
    return Notifier;
  },

  // Dequeues notifications
  notify : function () {
    if(!Notifier.queue.length) return false;
    
    for (var i = 0; i < Notifier.queue.length; i++) {
      Notifier.append(Notifier.queue.pop());
    };

    if(Notifier.FADE_OUT_TIME > 0) {
      setTimeout(function() {
        Notifier.list.find(".alert-success").fadeOut(1000);
      }, Notifier.FADE_OUT_TIME);
    }
    return Notifier;
  },

  // Append a new li element
  append : function(notification) {
    var clone = Notifier.templateLi.clone().removeAttr("id").hide();
    clone.find(".msg").html(notification.msg);
    clone.addClass("alert-" + notification.type);
    Notifier.list.append(clone);
    clone.fadeIn(500);
    return Notifier;
  },

  // Clears notification list
  clear : function() {
    Notifier.list.find("li").not("#flash_template").remove();
    return Notifier;
  },

  // ----------------------------------------
  // Shows a popup with a loader animation
  showLoader : function(_msg) {
    if(!_msg) return false;

    window.scrollTo(0, 0);
    
    var overlayHeight = $(document).height();
    $(".paintOverlay").css({ height : overlayHeight }).fadeTo(800, 0.8);

    var overlayMessageWrapper = $(".paintOverlayMessage");
    //
    overlayMessageWrapper.find(".message").html(_msg);
    //    
    var newLeft = ( $(document).width() / 2) - ( overlayMessageWrapper.width() / 2) + "px";
    overlayMessageWrapper.css({left: newLeft});

    return Notifier;
  },

  hideLoader : function() {
    $(".paintOverlay").hide();
    return Notifier;
  }


};