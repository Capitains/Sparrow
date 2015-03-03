/**
 * CTS.xslt
 *
 * @module   CTS.xslt
 * 
 * @requires CTS
 * 
 * @link https://github.com/PerseusDL/Capitains-Sparrow
 * @author PonteIneptique (Thibault Clérice)
 * @version 1.0.0
 * @license https://github.com/PerseusDL/Capitains-Sparrow/blob/master/LICENSE
 *
 */
(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['cts'], factory);
  } else {
    factory(CTS);
  }
}(function(CTS) {

  /**
   * @namespace CTS.xslt
   * @name CTS.xslt
   */
  CTS.xslt = {};

  /**
   * @namespace CTS.xslt.stylesheets
   * @name  CTS.xslt.stylesheets
   * @memberOf CTS.xslt
   */
  CTS.xslt.stylesheets = {};

  /**
   * Transform xml into an XSLTProcessor
   * @name      stylesheeting
   * @memberOf  CTS.xslt.XSLT
   * @function
   * 
   * @param     {string|Document}  transformDoc  The text/xml (XSL) representation of the Stylesheet
   *
   * @returns   {XSLTProcessor}     The XSLT Processor with loaded up stylesheet
   */
  var stylesheeting = function(transformDoc) {
    if(typeof transformDoc === "string") {
      transformDoc = (new DOMParser()).parseFromString(transformDoc, "text/xml")
    }
    var transformProc= new XSLTProcessor();
    transformProc.importStylesheet(transformDoc);

    this.processor = transformProc;
    return transformProc;
  }
  /**
   * Send an synchronous request to load a stylesheet
   *
   * @name      load
   * @memberOf  CTS.xslt.XSLT
   * @function
   *
   * @returns   {XSLTProcessor}  an XSLTProcessor with the stylesheet imported
   *
   * @throw an error upon failure to load the stylesheet
   */
  var load = function() {
      var a_url = this.endpoint,
          req = new XMLHttpRequest();
      if (req.overrideMimeType) {
          req.overrideMimeType('text/xml');
      }
      req.open("GET", a_url, false);
      req.send(null);
      if (req.status != 200) {
        throw("Can't get transform at " + a_url);
      }

      return this.stylesheeting(req.responseXML);
  }

  /**
   * Set the value of a field
   *
   * @name      setValue
   * @memberOf  CTS.xslt.XSLT
   * @function
   * 
   * @param   {string}  key    Field whom value has to change  
   * @param   {string}  value  New value for given field
   *
   */
  var setValue = function (key, value) {
    this.options[key]["value"] = value;
  }

  /**
   * Return values of current object
   *
   * @name      getValues
   * @memberOf  CTS.xslt.XSLT
   * @function
   *
   * @returns  {Object.<string, any>}  A dictionary of key-value pair where key are field name
   *
   */
  var getValues = function() {
    var data = {},
        $this = this,
        $default;
    Object.keys($this.options).forEach(function(key) {
      if (typeof $this.options[key]["default"] === "function") {
        $default = $this.options[key]["default"]();
      } else {
        $default = $this.options[key]["default"];
      }
      data[key] = (typeof $this.options[key]["value"] !== "undefined") ? $this.options[key]["value"] : $default;
    });
    return data;
  }

  /**
   *  Get the option of the current instance
   *
   * @name      getOptions
   * @memberOf  CTS.xslt.XSLT
   * @function
   *
   * @returns  {Object.<string, Object.<string, any>>}  Dictionary of pair key-object where key are field name and object contain datatype, html and default value 
   *
   */
  var getOptions = function() {
    return this.options;
  }

  /**
   * Transform given xml through the loaded stylesheet
   *
   * @name      transform
   * @memberOf  CTS.xslt.XSLT
   * @function
   *
   * @param    {string|Document}  xml  A document to be transformed
   *
   * @returns  {Document}  A freshly transformed document
   *
   */
  var transform = function(xml) {
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
   *  Prototype for XSLT Stylesheets
   *  
   *  @constructor
   *  @memberOf CTS.xslt
   *
   *  @param  {string}                endpoint  Url of the stylesheet
   *  @param  {Object.<string, any>}  options   Any options to reuse inside
   *
   *  @property  {XSLTProcessor}   processor  Processor object for transformation
   *  @property  {string}          endpoint   URL of the XSLT
   */
  CTS.xslt.XSLT = function(endpoint, options) {
    this.endpoint = endpoint;
    this.processor = null;
    this.setValue = setValue;
    this.getValues = getValues;
    this.getOptions = getOptions;
    this.transform = transform;
    this.stylesheeting = stylesheeting;
    this.load = load;
  }
  CTS.xslt.XSLT.prototype.toString = function() { return "[object CTS.XSLT]"}

  /**
   *  Create a new XSLT transformer object
   *
   *  @function
   *  @memberOf CTS.xslt
   *  
   *  @param  {string}                        xslt      Name of the XSLT stylesheet (Available in {@link CTS.xslt.stylesheets})
   *  @param  {string}                        endpoint  Url of the stylesheet
   *  @param  {Object.<string, any>}          options   Any options to reuse inside
   *
   *  @returns {CTS.xslt.XSLT}  A CTS.XSLT intance with given options
   *
   */
  CTS.xslt.new = function(xslt, endpoint, options) {
    if(typeof xslt === "string") {
      if(xslt in this.stylesheets) {
        return new this.stylesheets[xslt](endpoint, options);
      } else {
        throw xslt + " is Unknown."
      }
    } else {
      throw "@param xslt is not a string";
    }
  }

  /**
   * Register a XSLT stylesheets available in {@link CTS.xslt.new}
   *
   * @function
   * @memberOf CTS.xslt
   * 
   * @param  {string}                           name                        Name of the xslt stylesheet
   * @param  {Object.<string, object>}          options                     Options in Instance.options (For transformations). Keys are parameters of the XSLT stylesheet
   * @param  {Object.<string, Any>}             options[fieldname]          Informations about the transformation parameter
   * @param  {string}                           options[fieldname].type     Type of the parameter : boolean, string
   * @param  {string}                           options[fieldname].html     HTML representation (for plugins) : input (for type=text), checkbox, textarea, hidden
   * @param  {string|integer|boolean|function}  options[fieldname].default  Default value for the option
   * 
   * @returns {constructor}             Returns the constructor for the new xslt
   */
  CTS.xslt.register = function(name, options) {
    //If the XSLT is an object, then we just create the
    var tempXSLT = function(endpoint) {
      CTS.xslt.XSLT.call(this);
      this.options = options;
    };
    tempXSLT.prototype = Object.create(CTS.xslt.XSLT);

    CTS.xslt.stylesheets[name] = tempXSLT;
    return CTS.xslt.stylesheets[name];
  }
}));
