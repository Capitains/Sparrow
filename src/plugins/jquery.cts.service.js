(function (factory) {
  if (typeof define === "function" && define.amd) {
  // AMD. Register as an anonymous module.
    define(["jquery", "cts"], factory);
  } else {
    factory(jQuery, CTS);
  }
}(function($, CTS) {
  var $name = "jQuery.cts.service";
  var $default = { //Default Params
    "endpoint" : "http://www.perseus.tufts.edu/hopper/CTS?",  //URL of the repository CTS endpoint
    "lang" : "en",
    "css" : {}, //Custom css classes
    "trigger" : null,
    "click" : null,
    "DOM" : {},
    "defaults" : {},
    "show" : true,
    "callback" : null,
    "names" : {}
  };
  // $css is the basic classes used for accessing DOM inside jQuery.cts.service
  var $css = {
    //Global
    "container" : ["cts-service"], // Container for the whole generated DOM
    "container-legend" : ["cts-service-legend"], // Container for the whole generated DOM

    "field-container" : [], // 
    "field-label" : [], // 
    "field-input-container" : [], //
    "field-text" : [], //
    "field-textarea" : [], //
    "field-checkbox" : [] //
  }
  var $lang = {"en" : "en"};

  function Plugin ( element, service, options ) {
    this.element = $(element);
    // jQuery has an extend method which merges the contents of two or
    // more objects, storing the result in the first object. The first object
    // is generally empty as we don't want to alter the default options for
    // future instances of the plugin
    this.settings = $.extend( {}, $default, options );
    this._name = $name;
    this.serviceName = service;
    this.service = CTS.service.new(service, this.settings.endpoint, {});

    if(this.settings["lang"] in $lang) {
      this.lang = $lang[this.settings["lang"]];
    } else {
      this.lang = $lang["en"];
    }  
    this._defaultCSS = $css;
    this.css = this.mergeCSS();
    this.inputs = {}; // key = parameter name, value = element
    this.init();
  }

  $.extend(Plugin.prototype, {
    generateId : function() {
      var $id = 1;

      while($("div#cts-service-" + $id).length >= 1) {
        $id += 1;
      }
      $id = "cts-service-" + $id;
      this.id = $id;
      return $id;
    },
    send : function() {
      var data = this.getValues(),
          _this = this;

      //Setting values
      Object.keys(data).forEach(function(param) {
        _this.service.setValue(param, data[param]);
      });

      //Sending data
      _this.element.trigger("cts-service:"+_this.serviceName+":doing");
      _this.service.send(function(data) {
        if(typeof _this.settings.callback === "function") { _this.settings.callback(data); }
        _this.element.trigger("cts-service:"+_this.serviceName+":done");
      }, "text");
    },
    makeInput : function(key, object) {
      var _this = this,
          $default = (key in this.settings.defaults) ? this.settings.defaults[key] : this.service.options[key].default,
          $input;

      if(object.html === "hidden") {
        $input = $("<input />", { 
          "type" : "hidden",
          "value" : $default
        });
        _this.container.append($input);
      } else {
        var $container = $("<div />", { "class" : _this.getClass("field-container")}),
            $label = $("<label />", {"class" : _this.getClass("field-label"), "for" : _this.id + "-" + key}),
            $inputContainer = $("<div />", {"class" : _this.getClass("field-input-container")});
        $label.text(_this.translate(key));
        $container.append($label);

        if(object.html === "checkbox") {
          $input = $("<input />", {
            "type" : "checkbox",
            "class" : _this.getClass("field-checkbox")
          });
          $input[0].checked = $default;
        } else if (object.html === "input") {
          $input = $("<input />", {
            "type" : "text",
            "value" : $default,
            "class" : _this.getClass("field-text")
          });
        } else if (object.html === "textarea") {
          $input = $("<textarea />", {
            "type" : "text",
            "value" : $default,
            "class" : _this.getClass("field-textarea")
          });
          $input.text($default)
        }
        $input.attr("id", _this.id + "-" + key);
        $inputContainer.append($input);
        $container.append($inputContainer);

        _this.container.append($container);
      }
      if(key in _this.settings.names) {
        $input.attr("name", _this.settings.names[key]);
      }
      return $input;
    },
    init : function() {
      var _this = this;

      _this.generateId();

      //We create the container
      _this.container = $("<fieldset />", {
        "class" : _this.getClass("container"),
        "id" : _this.id
      });
      _this.legend = $("<legend />", {
        "class" : _this.getClass("container-legend")
      });
      _this.legend.text(CTS.lang.get(_this.serviceName, _this.lang));
      _this.container.append(_this.legend);
      this.element.append(_this.container);

      //We create the input
      Object.keys(_this.service.options).forEach(function(param) {
        var $input;
        if(param in _this.settings.DOM) {
          $input = _this.settings.DOM[param];
        } else {
          $input = _this.makeInput(param, _this.service.options[param]);
        }
        _this.inputs[param] = $input;
      });

      if(typeof _this.settings.trigger === "string") {
        _this.element.on(_this.settings.trigger, function () { _this.send(); });
      }

      if(typeof _this.settings.click !== "undefined" && _this.settings.click !== null ) {
        if(typeof _this.settings.click === "string") {
          $(_this.settings.click).on("click", function() { _this.send(); });
        } else if (_this.settings.click instanceof jQuery) {
          _this.settings.click.on("click", function () { _this.send(); });
        }

      }
      // Show / hide
      if(_this.settings.show === false) {
        _this.container.hide();
      } else if(typeof _this.settings.show === "string") {
        _this.element.on(_this.settings.show, function () { _this.container.toggle(); });
      }
    },
    getValues : function() {
      var _this = this,
          data = {};
      Object.keys(_this.inputs).forEach(function(param) {
        var $input = _this.inputs[param];
        if(typeof $input === "string") {
          var $input = $($input);
          if($input.attr("type") === "checkbox") {
            data[param] = $($input).is(":checked");
          } else {
            data[param] = $($input).val();
          }
        } else if (typeof $input === "function") {
          data[param] = $input();
        } else if($input.is("[type='checkbox']")) {
          data[param] = $input.is(':checked');
        } else{
          data[param] = $input.val();
        }
        if(typeof data[param] === "string") {
          if(_this.service.options[param].type === "boolean") {
            data[param] = (data[param] === "true" || data[param] === true) ? true : false;
          } else if (_this.service.options[param].type === "list") {
            data[param] = data[param].replace(/\s+/g, '').split(",");
          }
        }
      });
      return data;
    },
    translate : function(key) {
      return CTS.lang.get(this.serviceName + "." + key, this.lang);
    },
    getClass : function(key) {
      if(this.css[key].length > 0) {
        return this.css[key].join(" ");
      }
      return "";
    },
    mergeCSS : function() {
      var _this = this,
          css = {};
      Object.keys(_this._defaultCSS).forEach(function(key) {
        if(key in _this.settings.css && _this.settings.css[key] instanceof Array) {
          css[key] = _this._defaultCSS[key].concat(_this.settings.css[key]);
        } else {
          css[key] = _this._defaultCSS[key];
        }
      });
      return css;
    }
  });

  $.fn.ctsService = function(serviceName, options) {
    var args = arguments;
    if (!window.CTS) {
      throw new Error("CTS lib required");
    }

    if (options === undefined || typeof options === "object") {
      return this.each(function () {
        // Only allow the plugin to be instantiated once,
        // so we check that the element has no plugin instantiation yet
        if (!$.data(this, "_cts_service_"+serviceName)) {
          // if it has no instance, create a new one,
          // pass options to our plugin constructor,
          // and store the plugin instance
          // in the elements jQuery data object.
          $.data(this, "_cts_service_"+serviceName, new Plugin( this, serviceName, options ));
        }
      });
    } else if (typeof options === "string" && options[0] !== "_" && options !== "init") {
      // Cache the method call
      // to make it possible
      // to return a value
      var returns;

      this.each(function () {
        var instance = $.data(this, "_cts_service_"+serviceName);
        // Tests that there's already a plugin-instance
        // and checks that the requested public method exists
        if (instance instanceof Plugin && typeof instance[options] === "function") {
          // Call the method of our plugin instance,
          // and pass it the supplied arguments.
          returns = instance[options].apply( instance, Array.prototype.slice.call( args, 1 ) );
        }
        // Allow instances to be destroyed via the 'destroy' method
        if (options === "destroy") {
          $.data(this, "_cts_service_"+serviceName, null);
        }
      });
      // If the earlier cached method
      // gives a value back return the value,
      // otherwise return this to preserve chainability.
      return returns !== undefined ? returns : this;
    }
  };
}));
