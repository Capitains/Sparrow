(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['cts'], factory);
  } else {
    factory(CTS);
  }
}(function(CTS) {

  /**
   * Send an synchronous request to load a stylesheet
   *
   * @param   a_url the url of the styleshset
   *
   * @return  an XSLTProcessor with the stylesheet imported
   *
   * @throw an error upon failure to load the stylesheet
   */
  var _load = function() {
      var a_url = this.endpoint,
          req = new XMLHttpRequest();
      if (req.overrideMimeType) {
          req.overrideMimeType('text/xml');
      }
      req.open("GET", a_url, false);
      req.send(null);
      if (req.status != 200)
      {
          var msg = "Can't get transform at " + a_url;
          throw(msg);
      }
      var transformDoc = req.responseXML;
      var transformProc= new XSLTProcessor();
      transformProc.importStylesheet(transformDoc);

      this.processor = transformProc;

      return transformProc;
  }

  /**
   * Set the value of a field
   *
   * @param  key       {string}  Field whom value has to change  
   * @param  value     {string}  New value for given field
   *
   */
  var _setValue = function (key, value) {
    this.options[key]["value"] = value;
  }

  /**
   * Return values of current object
   *
   * @return  {object}  A dictionary of key-value pair where key are field name
   *
   */
  var _getValues = function() {
    var data = {},
        _this = this,
        $default;
    Object.keys(_this.options).forEach(function(key) {
      if (typeof _this.options[key]["default"] === "function") {
        $default = _this.options[key]["default"]();
      } else {
        $default = _this.options[key]["default"];
      }
      data[key] = _this.options[key]["value"] || $default;
    });
    return data;
  }

  /**
   *  Get the option of the current instance
   *
   * @return  {object}  Dictionary of pair key-object where key are field name and object contain datatype, html and default value 
   *
   */
  var _getOptions = function() {
    return this.options;
  }

  var _transform = function(xml) {
    var transformed,
        values,
        processor;
    if(!this.processor) {
      this.load();
    }
    processor = this.processor;
    if(typeof xml === "string") {
      xml = (new DOMParser()).parseFromString(xml,"text/xml");
    }
    values = this.getValues();
    Object.keys(values).forEach(function(key) {
      processor.setParameter(null, key, values[key]);
    });
    transformed = processor.transformToDocument(xml);
    return transformed;
  }

  /**
   * LLT Segtok(enization) service's output into a Treebank Annotation
   *
   * @Github : https://github.com/alpheios-project/treebank-editor/blob/master/db/xslt/segtok_to_tb.xsl
   * 
   */
  var _segtok_to_tb = function(endpoint, options) {

    return {
      endpoint : endpoint,
      processor : null,
      options : {
        "e_lang" : { 
          "type" : "string",
          "html" : "input",
          "default" : "lat"
        },
        "e_format" : { 
          "type" : "string",
          "html" : "input",
          "default" : "aldt"
        },
        "e_docuri" : { 
          "type" : "string",
          "html" : "input",
          "default" : "urn:cts:latinLit:tg.work.edition:1.1"
        },
        "e_agenturi" : { 
          "type" : "string",
          "html" : "input",
          "default" : "http://services.perseids.org/llt/segtok"
        },
        "e_appuri" : { 
          "type" : "string",
          "html" : "input",
          "default" : ""
        },
        "e_datetime" : { 
          "type" : "string",
          "html" : "hidden",
          "default" : function() { return (new Date()).toDateString(); }
        },
        "e_collection" : { 
          "type" : "string",
          "html" : "input",
          "default" : "urn:cite:perseus:lattb"
        },
        "e_attachtoroot" : { 
          "type" : "boolean",
          "html" : "checkbox",
          "default" : true
        } 
      },
      setValue : _setValue,
      getValues  : _getValues,
      getOptions : _getOptions,
      transform : _transform,
      load : _load
    }
  }  

  /**
   *  Create a new XSLT transformer object
   *
   *  @param
   *
   */
  var _new = function(xslt, endpoint, option) {
    if(typeof xslt === "string") {
      if(xslt in this.stylesheets) {
        return new this.stylesheets[xslt](endpoint, option);
      } else {
        throw xslt + " is Unknown."
      }
    } else {
      //Place holder
    }
  }
  CTS.xslt = {
    stylesheets : {
      "llt.segtok_to_tb" : _segtok_to_tb
    },
    "new" : _new
  }
}));