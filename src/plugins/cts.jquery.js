(function (factory) {
  if (typeof define === "function" && define.amd) {
  // AMD. Register as an anonymous module.
    define(["jquery", "cts"], factory);
  } else {
    factory(jQuery, CTS);
  }
}(function($, CTS) {
  var $name = "jQuery.cts";
  var $default = { //Default Params
    "endpoint" : "http://www.perseus.tufts.edu/hopper/CTS?",  //URL of the repository CTS endpoint
    "inventories" : {}, // Dictionaries of inventory's name : label
    "version" : 3, // Version of CTS
    "namespace" : "http://chs.harvard.edu/xmlns/cts3/ti", //Namespace
    "lang" : "en"
  };
  var $lang = {};

  function Plugin ( element, options ) {
    this.element = $(element);
    // jQuery has an extend method which merges the contents of two or
    // more objects, storing the result in the first object. The first object
    // is generally empty as we don't want to alter the default options for
    // future instances of the plugin
    this.settings = $.extend( {}, $default, options );
    this._name = $name;

    this.blocks = []; //Dom Set of the original elements

    if(this.settings["lang"] in $lang) {
      this.lang = $lang[this.settings["lang"]];
    } else {
      this.lang = $lang["en"];
    }
    
    this.repository = new CTS.repository(this.settings.endpoint, 3);

    this.init();
  }

  $.extend(Plugin.prototype, {
    init: function () {
   		var _this = this;
      //Setting up inventories in this.inventori
      Object.keys(_this.settings.inventories).map(function(key) {
      	_this.repository.addInventory(key, _this.settings.inventories[key]);
      });

      _this.repository.load(function() {
      	_this.generate();
      });
    },
    generate : function () {
      var data = this.repository.inventories,
	      $div = $("<div />", {
	      	"id" : "cts-selector-1"
	      }),
	      _this = this;

	  //Creating encapsuler
      this.element.after($div);

      if(data.length > 1) { // If we have more than one inventory, we must add a select for TextInventory
        var $inv = $div.append($("<select />", {
      		"name" : "inventory_name"
      	}));

		Object.keys(_this.settings.inventories).map(function(key) {
			$inv.append($("<option />", {
				"value" : key
			}).text(_this.settings.inventories[key]));
		});

      } else {
      	var $inv = $div.append($("<input />", {
      		"type" : "hidden",
      		"name" : "inventory_name",
      		"value" : Object.keys(this.settings.inventories)[0]
      	}));
      }

      //Add a select for TextGroup
      //Add a select for Work
      //Add a select for Text(Edition/Translation)
      //Add boxes for GetPassage
      //Create on changes.
    }
  });

  $.fn.ctsSelector = function(options) {
    var args = arguments;
    if (!window.CTS) {
      throw new Error("CTS lib required");
    }

    if (options === undefined || typeof options === "object") {
      return this.each(function () {
        // Only allow the plugin to be instantiated once,
        // so we check that the element has no plugin instantiation yet
        if (!$.data(this, "_cts_selector")) {
          // if it has no instance, create a new one,
          // pass options to our plugin constructor,
          // and store the plugin instance
          // in the elements jQuery data object.
          $.data(this, "_cts_selector", new Plugin( this, options ));
        }
      });
    } else if (typeof options === "string" && options[0] !== "_" && options !== "init") {
      // Cache the method call
      // to make it possible
      // to return a value
      var returns;

      this.each(function () {
        var instance = $.data(this, "_cts_selector");
        // Tests that there's already a plugin-instance
        // and checks that the requested public method exists
        if (instance instanceof Plugin && typeof instance[options] === "function") {
          // Call the method of our plugin instance,
          // and pass it the supplied arguments.
          returns = instance[options].apply( instance, Array.prototype.slice.call( args, 1 ) );
        }
        // Allow instances to be destroyed via the 'destroy' method
        if (options === "destroy") {
          $.data(this, "_cts_selector", null);
        }
      });
      // If the earlier cached method
      // gives a value back return the value,
      // otherwise return this to preserve chainability.
      return returns !== undefined ? returns : this;
    }
  };
}));