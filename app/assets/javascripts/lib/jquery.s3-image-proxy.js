(function() {
  var $,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  $ = jQuery;

  $.fn.extend({
    s3ImageProxy: function(options) {
      var Proxy, load_image, log, proxy, settings, timestamp;
      Proxy = (function() {

        function _Class(options) {
          this.on_message = __bind(this.on_message, this);          window.addEventListener('message', this.on_message, false);
          this.load(options.url);
        }

        _Class.prototype.load = function(url) {
          var loader;
          this.remote_domain = url.match(/http:\/\/[^/]+/)[0];
          loader = document.createElement('iframe');
          loader.setAttribute('style', 'display:none');
          loader.src = "" + url + "?stamp=" + (this.timestamp());
          return document.body.appendChild(loader);
        };

        _Class.prototype.is_loaded = function() {
          return !!this.end_point;
        };

        _Class.prototype.on_message = function(event) {
          var message;
          if (event.origin !== this.remote_domain) return;
          message = JSON.parse(event.data);
          switch (message.action) {
            case 'init':
              return this.end_point = event.source;
            default:
              console.log();
              return $($('#' + message.id)).trigger("imageData", message.bits);
          }
        };

        _Class.prototype.send = function(message) {
          var _this = this;
          if (this.is_loaded()) {
            return this.end_point.postMessage(JSON.stringify(message), this.remote_domain);
          } else {
            return window.setTimeout((function() {
              return _this.send(message);
            }), 200);
          }
        };

        _Class.prototype.timestamp = function() {
          return (Math.random() + "").substr(-10);
        };

        return _Class;

      })();
      load_image = function(img) {
        var i, path;
        path = img.attr('data-path');
        i = 0;
        while (settings["s3remote"].charAt(i) === img.attr("src").charAt(i)) {
          i++;
        }
        return proxy.send({
          action: 'load',
          path: img.attr("src").substring(i),
          id: img.attr('id')
        });
      };
      timestamp = function() {
        return (Math.random() + "").substr(-10);
      };
      settings = {
        s3remote: "http://s3.remote/with/trailing/slash",
        proxyFile: "proxy.html",
        debug: false
      };
      settings = $.extend(settings, options);
      proxy = new Proxy({
        url: settings["s3remote"] + settings["proxyFile"],
        application: this
      });
      log = function(msg) {
        if (settings.debug) {
          return typeof console !== "undefined" && console !== null ? console.log(msg) : void 0;
        }
      };
      return this.each(function() {
        $(this).attr('id', timestamp);
        $(this).bind("imageData", function(evt, bits) {
          $(this).attr('src', bits);
          return $(this).unbind("imageData");
        });
        return load_image($(this));
      });
    }
  });

}).call(this);
