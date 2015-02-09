(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['cts'], factory);
  } else {
    factory(CTS);
  }
}(function(CTS) {

  CTS.service = {
    services : {}
  }
  /**
   * Set the value of a field
   *
   * @param  key       {string}  Field whom value has to change  
   * @param  value     {string}  New value for given field
   *
   */
  var setValue = function (key, value) {
    this.options[key]["value"] = value;
  }

  /**
   * Return values of current object
   *
   * @return  {object}  A dictionary of key-value pair where key are field name
   *
   */
  var getValues = function() {
    var data = {},
        _this = this;
    Object.keys(_this.options).forEach(function(key) {
      data[key] = _this.options[key]["value"] || _this.options[key]["default"];
    });
    return data;
  }

  /**
   *  Get the option of the current instance
   *
   * @return  {object}  Dictionary of pair key-object where key are field name and object contain datatype, html and default value 
   *
   */
  var getOptions = function() {
    return this.options;
  }

  var send = function(callback, format) {
    var _this = this;
    if (typeof format === "undefined") { format = "text/xml"; }
    //function(method, url, callback, type, async)
    CTS.utils.xhr(_this.method, _this.endpoint, function(data) {
      if(typeof callback === "function") { callback(data); }
    }, format, _this.getValues());
  }

  /**
   * Prototype for services
   *
   *
   */
  CTS.service._service = function(endpoint, options) {
    this.endpoint = endpoint;
    this.method = "GET";
    this.options = {};
    this.setValue = setValue;
    this.getValues = getValues;
    this.getOptions = getOptions;
    this.send = send;
  }
  CTS.service._service.prototype.toString = function() { return "[object CTS.Service]"}

  /**
   * LLT Tokenizer HTTP REST API
   *
   * @Github : https://github.com/latin-language-toolkit/llt
   * 
   */
  CTS.service.services["llt.tokenizer"] = function(endpoint, options) {
    CTS.service._service.call(this, endpoint, options);
    this.method = "POST";
    this.options = {
      "xml" : {
        "type" : "boolean",
        "html" : "checkbox",
        "default" : false
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
    }
  }
  CTS.service.services["llt.tokenizer"].prototype = Object.create(CTS.service._service)

  /**
   *  Create a new service
   *
   *  @param
   *
   */
  CTS.service.new = function(service, endpoint, option) {
    if(typeof service === "string") {
      if(service in this.services) {
        return new this.services[service](endpoint, option);
      } else {
        throw service + " is Unknown."
      }
    } else {
      //Place holder
    }
  }
}));