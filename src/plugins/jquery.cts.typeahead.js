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
    "retrieve-button-container" : [""], // Div containing retrieve button

    //Citations-Passage Selection
    "citation" : [], // Div containing each passage container
    "citation-container" : ["cts-selector-passage-container"], //Fieldset for passage selection
    "citation-container-legend" : ["cts-selector-passage-label"], // Legend for passage fieldset
    "citation-input" : ["cts-selector-passage-number"]
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

  }

  $.extend(Plugin.prototype, {
    retriever_init : function(retrieve) {
      var _this = this,
          $button = $("<button />", {
            "class" : _this.getClass("retrieve-button")
          }),
          $target;

      if(typeof retrieve === "string") {
        $target = $(retrieve);
      } else {
        $target = _this.element;
      }

      $button.text(CTS.lang.get("retrieve_passage", _this.lang));

      _this.retriever_div.append($button);

      $button.on("click", function(event) {
        // prevent the event from filtering up and
        // default submission based upon a button click
        // in case the plugin is embedded in a form
        event.stopPropagation();
        event.preventDefault();
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
    getPassageString : function() {
      var _this = this,
          $element = _this.element,
          $urn = $element.data("urn"),
          $context = _this.context,
          $id = $context.attr("id"),
          $depth = $context.data("level"),
          $start = [],
          $end = [],
          $passage = [],
          $index = 0,
          $val = 0,
          $input;


      //Start first
      while($index < $depth) {
        $input = $context.find("input#" + $id + "-0-level-" + $index);
        $val = parseInt($input.val());
        if($val > 0) {
          $start.push($val);
        } else {
          break;
        }
        $index += 1;
      }
      if($start.length > 0) {
        $urn += ":" + $start.join(".");
        //We check for an end only if we have a start
        $index = 0;
        while($index < $depth) {
          $input = $context.find("input#" + $id + "-1-level-" + $index);
          $val = parseInt($input.val());
          if($val > 0) {
            $end.push($val);
          } else {
            break;
          }
          $index += 1;
        }
        //We have the $end processed, we check if this its length is equal to $start
        if($end.length == $start.length) {
          //We check if they are bigger than $start
          if(parseInt($start.join("")) < parseInt($end.join(""))) {
            $urn += "-" + $end.join(".");
          }
        }
      }
      $element.val($urn);
    },
    generatePassage : function($urn, $citations) {
      var $inputs = this.citation_div.find("*"),
          $id = this.context.attr("id"),
          $passage = 0,
          $level = 0,
          _this = this;

      _this.element.val($urn);
      this.context.data("level", $citations.length);

      if($inputs.length > 0) {
        $inputs.remove();
      }

      while($passage < 2) {
        $level = 0;
        $container_passage = $("<div />", {
              "class" : _this.getClass("citation-container")
            }),
            $legend = $("<span />", {
              "class" : _this.getClass("citation-container-legend")
            }),
            $text = "stop_passage";

        if($passage % 2 === 0) {
          $text = "start_passage";
        }
        $legend.text(CTS.lang.get($text, _this.lang));

        $container_passage.append($legend);
        $citations.forEach(function(citation) {

          //Create the label for nice HTML formatting/guidelines
          $input_id = $id + "-" + $passage + "-level-" + $level;
          $input = $("<input />", {
            "name"  : "passage_" + $level,
            "type"  : "number",
            "size"  : 4,
            "min"   : 0,
            "class" : _this.getClass("citation-input"),
            "id"    : $input_id,
            "placeholder" : citation
          });

          $container_passage.append($input);

          $input.on("change", function() { _this.getPassageString(); })

          $level += 1;
        });

        _this.citation_div.append($container_passage);
        $passage += 1;
      }
      $input.trigger("change");

    },
    generateId : function() {
      var $id = 1;
      while($("div#cts-typeahead-" + $id).length >= 1) {
        $id += 1;
      }
      $id = "cts-typeahead-" + $id;
      return $id;
    },
    generate : function () {
      var texts = [];
      var _this = this;

      _this.context = $("<div />", {
        "class" : _this.getClass("container"),
        "id" : _this.generateId()
      });
      _this.retriever_div = $("<div />", {
        "class" : _this.getClass("retrieve-button-container")
      });
      _this.citation_div = $("<div />", {
        "class" : _this.getClass("citation")
      });


      /**
       * We create the basic DOM first
       */

      _this.typeahead = $("<input />", {
        "class" : "typeahead"
      });
      _this.element.after(_this.context);

      _this.context.append(_this.typeahead);
      _this.element.hide();
      _this.context.append(this.citation_div);
      _this.context.append(_this.retriever_div);


      if(this.settings.retrieve !== "false") {
        this.retriever_init(this.settings.retrieve);
      }

      // Then we transform our inventories data into a list of small object
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

      // We instantiate Bloodhound
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

      this.typeahead.typeahead(null, {
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
      this.typeahead.on("typeahead:selected", function(event, suggestion, name) {
        _this.element.data("inventory", suggestion.inventory);
        _this.element.data("urn", suggestion.urn);
        _this.element.data("citations", suggestion.citations);
        _this.element.val(suggestion.urn);
        _this.generatePassage(suggestion.urn, suggestion.citations);
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
