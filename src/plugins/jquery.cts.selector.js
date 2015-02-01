(function (factory) {
  if (typeof define === "function" && define.amd) {
  // AMD. Register as an anonymous module.
    define(["jquery", "cts"], factory);
  } else {
    factory(jQuery, CTS);
  }
}(function($, CTS) {
  var $name = "jQuery.cts.selector";
  var $default = { //Default Params
    "endpoint" : "http://www.perseus.tufts.edu/hopper/CTS?",  //URL of the repository CTS endpoint
    "inventories" : {}, // Dictionaries of inventory's name : label
    "version" : 3, // Version of CTS
    "namespace" : "http://chs.harvard.edu/xmlns/cts3/ti", //Namespace
    "lang" : "en",
    "css" : {}, //Custom css classes
    "retrieve" : false,
    "retrieve_scope" : null,
    "passage" : true // Add the passage selector.
  };
  // $css is the basic classes used for accessing DOM inside jQuery.cts.selector
  var $css = {
    //Global
    "container" : ["cts-selector"], // Container for the whole generated DOM
    "retrieve-button" : [], //Button to retrieve the passage 


    //Selects
    "hidden-inventory" : ["cts-hidden-inventory"],
    "select-inventory" : ["cts-selector-inventory"], //Inventory <select />
    "select-textgroup" : ["cts-selector-textgroup"],
    "select-work" : ["cts-selector-work"],
    "select-text" : ["cts-selector-text"],
    "trigger-button" : ["cts-selector-trigger"],

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

    if(this.settings.retrieve !== false) {
      this.retriever_init(this.settings.retrieve);
    }
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

      $button.on("click", function(event) {
        // prevent the event from filtering up and
        // default submission based upon a button click
        // in case the plugin is embedded in a form
        event.stopPropagation();
        event.preventDefault();
        //We put some text to tell people they are loading
        $button.text(CTS.lang.get("loading", _this.lang));
        $target.trigger("cts-passage:retrieving");

        //We create the text instance 
        _this.text = CTS.Text(_this.element.val(), _this.repository.endpoint, _this.element.data("inventory"));
        //We load the text
        _this.text.retrieve(function() {
          //We feed our targer value
          $target.val(_this.text.getXml(_this.settings.retrieve_scope, "string"));
          //We reset legend of the button
          $button.text(CTS.lang.get("retrieve_passage", _this.lang));
          $target.trigger("cts-passage:retrieved");
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
    writePassage : function($context) {
      var _this = this,
          $element = _this.element,
          //$passages = $context.find("input.cts-selector-passage"),
          $urn = $element.data("urn"),
          $start = [],
          $end = [],
          $passage = [],
          $depth = $context.data("level"),
          $id = $context.attr("id"),
          $index = 0,
          $input,
          $val = 0;

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
      $element.data("inventory", $("div#" + $id + " .cts-selector-inventory, div#" + $id + " .cts-hidden-inventory").val());
      _this.element.trigger("cts-passage-:urn-updated");
      _this.element.trigger("cts-passage-:urn-passage");
    },
    passage : function(element, $context) {
      var $element = $(element),
          $option  = $element.find("option:selected"),
          $inputs = $context.find("fieldset.cts-selector-citation"),
          $level = 0,
          $citations = $option.data("citations"),
          $passage = 0,
          $id = $context.attr("id"),
          _this = this,
          $input,
          $container_passage,
          $input_id;

      _this.element.val(element.value);
      $context.data("level", $citations.length)

      if($inputs.length > 0) {
        $inputs.remove();
      }

      while($passage < 2) {
        $level = 0;
        $container_passage = $("<fieldset />", {
              "class" : _this.getClass("citation-fieldset")
            }),
            $legend = $("<legend />", {
              "class" : _this.getClass("citation-fieldset-legend")
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
          $label = $("<label />", {
            "for" : $input_id,
            "class" : _this.getClass("citation-label")
          });
          $input_container = $("<div />", { "class" : _this.getClass("citation-input-container") });
          $label.text(citation + " : ");
          $input_container.append($label);
          $input = $("<input />", {
            "name"  : "passage_" + $level,
            "type"  : "number",
            "size"  : 4,
            "min"   : 0,
            "class" : _this.getClass("citation-input"),
            "id"    : $input_id,
            "value" : 1
          });

          $label.after($input);

          $input.on("change", function() { _this.writePassage($context); })

          $container_passage.append($input_container);
          $level += 1;
        });

        $context.append($container_passage);
        $passage += 1;
      }
      $input.trigger("change");

    },
    select : function (element, $context) {
      var show,
          hide,
          $show;

      if(element.hasClass("cts-selector-inventory")) {
        hide = [".cts-selector-textgroup", ".cts-selector-work", ".cts-selector-text", ".cts-selector-citation"];
        show = ".cts-selector-textgroup[data-inventory='" + element.val() + "']";

      } else if(element.hasClass("cts-selector-textgroup")) {
        hide = [".cts-selector-work", ".cts-selector-text", ".cts-selector-citation"];
        show = ".cts-selector-work[data-inventory='" + element.attr("data-inventory") + "'][data-textgroup='" + element.val() + "']";
      } else if(element.hasClass("cts-selector-work")) {
        hide = [".cts-selector-text", ".cts-selector-citation"];
        show = ".cts-selector-text[data-inventory='" + element.attr("data-inventory") + "'][data-work='" + element.val() + "']";
      }

      $context.find(hide.join(", ")).hide();

      $show = $context.find(show);
      $show.show();

      //If you can't change the value (ie, there is only one value), trigger on change
      if($show.find("option").length === 1 ) {
        $show.trigger("change");
      }

    },
    generate : function () {
      var $id = 1,
          $inv1 = false,
          $textgroup1 = false,
          $work1 = false,
          $text1 = false;


      while($("div#cts-selector-" + $id).length == 1) {
        $id += 1;
      }
      var $id = "cts-selector-" + $id;
      this.id = $id;

      var data = this.repository.inventories,
        _this = this,
        $div = $("<div />", {
          "id" : $id,
          "class" : _this.getClass("container")
        });
 
    //Creating encapsuler
      this.element.after($div);

      if(Object.keys(data).length > 1) { // If we have more than one inventory, we must add a select for TextInventory
        var $inventory = $("<select />", {
          "name" : "inventory_name",
          "class" : _this.getClass("select-inventory")
        });

        Object.keys(_this.settings.inventories).forEach(function(key) {
          var opt = $("<option />", {
            "value" : key
          }).text(_this.settings.inventories[key]);
          $inventory.append(opt);
        });

        if(!$inv1) { $inv1 = $inventory; }

        $div.append($inventory);
        //Mapping onChange
        $inventory.on("change", function() { _this.select($(this), $div); });

      } else {
        var $inventory = $("<input />", {
          "type" : "hidden",
          "name" : "inventory_name",
          "class" : _this.getClass("hidden-inventory"),
          "value" : Object.keys(this.settings.inventories)[0]
        });
        $inv1 = $inventory;
        $div.append($inventory);
      }
      //Writing DOM

      //Create a loop over settings maybe ?
      Object.keys(_this.settings.inventories).forEach(function(key) {
        var $cid = $id + "-" + key//Container ID

        var $textgroup = $("<select />", {
          "name" : "cts-selector-" + key + "-textgroup",
          "data-inventory" : key,
          "style" : "display:none;",
          "class" : _this.getClass("select-textgroup")
        });

        $textgroup.on("change", function() { _this.select($(this), $div); });

        $div.append($textgroup);

        if(!$textgroup1) { $textgroup1 = $textgroup; }

        //Add a select for TextGroup
        _this.repository.inventories[key].textgroups.forEach(function(textgroup) {
          var $toption = $("<option />", {
            "value" : textgroup.urn
          });
          $toption.text(textgroup.getName(_this.lang));

          var $works = $("<select />", {
            "name" : "cts-selector-" + key + "-work",
            "data-inventory" : key,
            "data-textgroup" : textgroup.urn,
            "style" : "display:none;",
            "class" : _this.getClass("select-work")
          });
          if(!$work1) { $work1 = $works; }
          $div.append($works);
          $works.on("change", function() { _this.select($(this), $div); });

          //Add a select for Work
          textgroup.works.forEach(function(work) {

            var $woption = $("<option />", {
              "value" : work.urn
            });
            $woption.text(work.getTitle(_this.lang));
            $works.append($woption);

            //No we take care of Edition/Translation
            var $texts = $("<select />", {
              "name" : "cts-selector-" + key + "-work-texts",
              "data-inventory" : key,
              "data-textgroup" : textgroup.urn,
              "data-work" : work.urn,
              "style" : "display:none;",
              "class" : _this.getClass("select-text")
            });
            if(!$text1) { $text1 = $texts; }

            work.texts.forEach(function(text) {
              var $txoption = $("<option />", {
                "value" : text.urn
              });
              $txoption.data("citations", text.citations);
              $txoption.text(CTS.lang.get(text.type, _this.lang) + " " + text.getLabel(_this.lang))
              $texts.append($txoption);
            });

            $div.append($texts);
            $texts.on("change", function() {
              if(_this.settings.passage !== true) {
                _this.element.val(this.value);
              } else {
                _this.element.data("urn", this.value);
                _this.passage(this, $div);
              }
              _this.element.trigger("cts-passage-:urn-updated");
              _this.element.trigger("cts-passage-:urn-work");
            });
          });

          $textgroup.append($toption);
        });

        //Add a select for Text(Edition/Translation)
        //Add boxes for GetPassage
        //Create on changes.
      });
      $div.find("div[data-inventory='" + $inv1.val() + "']").show();
      $textgroup1.show();
      $work1.show();
      $text1.show();

      //We need to add a button which allows select when no change is triggered.
      var $YOU_WILL_PASS = $("<button />", {
        "class" : _this.getClass("trigger-button")
      });
      $YOU_WILL_PASS.text(CTS.lang.get("select", _this.lang));
      $YOU_WILL_PASS.on("click", function(event) {
        // prevent the event from filtering up and
        // default submission based upon a button click
        // in case the plugin is embedded in a form
        event.stopPropagation();
        event.preventDefault();
        $div.find("select:visible").last().trigger("change");
      });
      $div.append($YOU_WILL_PASS);

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
