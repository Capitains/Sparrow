(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['cts'], factory);
  } else {
    factory(CTS);
  }
}(function(CTS) {

  var _setValue = function (key, value) {
    this.options[key]["value"] = value;
  }

  var _getValues = function() {
    var data = {},
        _this = this;
    Object.keys(_this.options).forEach(function(key) {
      data[key] = _this.options[key]["value"] || _this.options[key]["default"];
    });
    return data;
  }

  var _getOptions = function() {
    return this.options;
  }

  var _send = function(callback, format) {
    var _this = this;
    if (typeof format === "undefined") { format = "text/xml"; }
    //function(method, url, callback, type, async)
    CTS.utils.xhr(_this.method, _this.endpoint, function(data) {
      if(typeof callback === "function") { callback(data); }
    }, format, _this.getValues());
  }

  /**
   * LLT Tokenizer HTTP REST API
   *
   * @Github : https://github.com/latin-language-toolkit/llt
   * 
   */
  var _llt_tokenizer = function(endpoint, options) {

    return {
      method : "POST",
      endpoint : endpoint,
      options : {
        "xml" : {
          "type" : "boolean",
          "html" : "checkbox",
          "default" : true
        },
        "inline" : {
          "type" : "boolean",
          "html" : "hidden",
          "default" : true
        },
        "splitting" : {
          "type" : "boolean",
          "html" : "checkbox",
          "default" : true
        },
        "merging" : {
          "type" : "boolean",
          "html" : "checkbox",
          "default" : false
        },
        "shifting" : {
          "type" : "boolean",
          "html" : "checkbox",
          "default" : false
        },
        "text" : {
          "type" : "text", // Text unlinke string is a big thing
          "html" : "textarea"
        },
        "remove_node" : {
          "type" : "list",
          "html" : "input",
          "default" : ["teiHeader","head","speaker","note","ref"]
        },
        "go_to_root" : {
          "type" : "string",
          "html" : "input",
          "default" : "TEI"
        },
        "ns" : {
          "type" : "string",
          "html" : "input",
          "default" : "http://www.tei-c.org/ns/1.0"
        }
      },
      setValue : _setValue,
      getValues  : _getValues,
      getOptions : _getOptions,
      send : _send
    }
  }  

  /**
   *  Create a new service
   *
   *  @param
   *
   */
  var _new = function(service, endpoint, option) {
    if(typeof service === "string") {
      if(service in this._services) {
        return new this._services[service](endpoint, option);
      } else {
        throw service + " is Unknown."
      }
    } else {
      //Place holder
    }
  }
  CTS.service = {
    _services : {
      "llt.tokenizer" : _llt_tokenizer
    },
    "new" : _new
  }
}));