(function (factory) {
  if (typeof define === "function" && define.amd) {
  // AMD. Register as an anonymous module.
    define(["jquery", "cts"], factory);
  } else {
    factory(jQuery, CTS);
  }
}(function($, CTS) {
  var $name = "jQuery.cts.typeahead";
  var $default = { //Default Params
    "endpoint" : "http://www.perseus.tufts.edu/hopper/CTS?",  //URL of the repository CTS endpoint
    "inventories" : {}, // Dictionaries of inventory's name : label
    "version" : 3, // Version of CTS
    "namespace" : "http://chs.harvard.edu/xmlns/cts3/ti", //Namespace
    "lang" : "en",
    "css" : {}, //Custom css classes
    "retrieve" : false,
    "retrieve_scope" : null
  };
  // $css is the basic classes used for accessing DOM inside jQuery.cts.selector
  var $css = {
    //Global
    "container" : ["cts-selector"], // Container for the whole generated DOM
    "retrieve-button" : ["cts-selector-retriever"], //Button to retrieve the passage 

    //Citations-Passage Selection
    "citation-fieldset" : ["cts-selector-citation"], //Fieldset for passage selection
    "citation-fieldset-legend" : [], // Legend for passage fieldset
    "citation-label" : [], //<label> for passage's input
    "citation-input" : ["cts-selector-passage"], // input[type="number"] for passage selection
    "citation-input-container" : ["cts-selector-input-container"], //Input container for passage selection
  }
  var $lang = {};

  function Plugin ( element, options ) {
    this.element = $(element);
    // jQuery has an extend method which merges the contents of two or
    // more objects, storing the result in the first object. The first object
    // is generally empty as we don't want to alter the default options for
    // future instances of the plugin
    this.settings = $.extend( {}, $default, options );
    this._name = $name;

    if(this.settings["lang"] in $lang) {
      this.lang = $lang[this.settings["lang"]];
    } else {
      this.lang = $lang["en"];
    }

    this.repository = new CTS.repository(this.settings.endpoint, 3);
    this._defaultCSS = $css;
    this.css = this.mergeCSS();
    this.init();

    if(this.settings.retrieve !== "false") {
      this.retriever_init(this.settings.retrieve);
    }
  }

  $.extend(Plugin.prototype, {
    retriever_init : function(retrieve) {
      var _this = this,
          $button = $("<button />", {
            "class" : _this.getClass("retrieve-button")
          }),
          $urn = _this.element.val(),
          $target;

      if(typeof retrieve === "string") {
        $target = $(retrieve);
      } else {
        $target = _this.element;
      }

      $button.text(CTS.lang.get("retrieve_passage", _this.lang));

      _this.element.after($button);

      $button.on("click", function() {
        //We put some text to tell people they are loading
        $button.text(CTS.lang.get("loading", _this.lang));

        //We create the text instance 
        _this.text = CTS.Text(_this.element.val(), _this.repository.endpoint, _this.element.data("inventory"));
        //We load the text
        _this.text.retrieve(function() {
          //We feed our targer value
          $target.val(_this.text.getXml(_this.settings.retrieve_scope, "string"));
          //We reset legend of the button
          $button.text(CTS.lang.get("retrieve_passage", _this.lang));
        });
      });

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
        if(key in _this.settings.css && _this.settings.css instanceof Array) {
          css[key] = _this._defaultCSS[key].concat(_this.settings.css);
        } else {
          css[key] = _this._defaultCSS[key];
        }
      });
      return css;
    },
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
      var texts = [],
          _this = this;

      Object.keys(_this.repository.inventories).forEach(function(inventory_name) {
        var inventory = _this.repository.inventories[inventory_name].getRaw(_this.lang);

        Object.keys(inventory).forEach(function(textgroup) {
          Object.keys(inventory[textgroup]).forEach(function(work) {
            Object.keys(inventory[textgroup][work]).forEach(function(type) {
              Object.keys(inventory[textgroup][work][type]).forEach(function(text) {
                texts.push({
                  name : [textgroup, work, text, CTS.lang.get(type, _this.lang)].join(", "),
                  shortname : text,
                  type : CTS.lang.get(type, _this.lang),
                  fullname : [textgroup, work].join(", "),
                  urn : inventory[textgroup][work][type][text].urn,
                  citations : inventory[textgroup][work][type][text].citations,
                  inventory : inventory_name
                });
              });
            });
          });
        });
      });

      var BHTexts = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        limit: 10,
        local: texts 
      });
       
      // kicks off the loading/processing of `local` and `prefetch`
      BHTexts.initialize();
       
      // passing in `null` for the `options` arguments will result in the default
      // options being used

      this.element.addClass("typeahead");
      this.element.typeahead(null, {
        name: 'texts',
        displayKey: 'name',
        // `ttAdapter` wraps the suggestion engine in an adapter that
        // is compatible with the typeahead jQuery plugin
        source: BHTexts.ttAdapter(),
        templates: {
          suggestion: Handlebars.compile([
            '<p class="text-type">{{type}}</p>',
            '<p class="text-name">{{shortname}}</p>',
            '<p class="text-description">{{fullname}}</p>'
          ].join(''))
        }
      });
      this.element.on("typeahead:selected", function(event, suggestion, name) {
        _this.element.data("repository", suggestion.repository);
        _this.element.data("urn", suggestion.urn);
        _this.element.data("citations", suggestion.citations);
        //_this.passage();
      }); 
    }
  });

  $.fn.ctsTypeahead = function(options) {
    var args = arguments;
    if (!window.CTS) {
      throw new Error("CTS lib required");
    }

    if (options === undefined || typeof options === "object") {
      return this.each(function () {
        // Only allow the plugin to be instantiated once,
        // so we check that the element has no plugin instantiation yet
        if (!$.data(this, "_cts_typeahead")) {
          // if it has no instance, create a new one,
          // pass options to our plugin constructor,
          // and store the plugin instance
          // in the elements jQuery data object.
          $.data(this, "_cts_typeahead", new Plugin( this, options ));
        }
      });
    } else if (typeof options === "string" && options[0] !== "_" && options !== "init") {
      // Cache the method call
      // to make it possible
      // to return a value
      var returns;

      this.each(function () {
        var instance = $.data(this, "_cts_typeahead");
        // Tests that there's already a plugin-instance
        // and checks that the requested public method exists
        if (instance instanceof Plugin && typeof instance[options] === "function") {
          // Call the method of our plugin instance,
          // and pass it the supplied arguments.
          returns = instance[options].apply( instance, Array.prototype.slice.call( args, 1 ) );
        }
        // Allow instances to be destroyed via the 'destroy' method
        if (options === "destroy") {
          $.data(this, "_cts_typeahead", null);
        }
      });
      // If the earlier cached method
      // gives a value back return the value,
      // otherwise return this to preserve chainability.
      return returns !== undefined ? returns : this;
    }
  };
}));