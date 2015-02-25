/**
 * CTS
 *
 * @link https://github.com/PerseusDL/Capitains-Sparrow
 * @author PonteIneptique (Thibault Clérice)
 * @version 1.0.0
 * @license https://github.com/PerseusDL/Capitains-Sparrow/blob/master/LICENSE
 *
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.CTS = factory();
  }
}(this, function() {
	"use strict";

  /**
   * @namespace CTS
   * @name  CTS
   */
	var CTS = function() {
		return {
		}
	}
	return new CTS();
}));
/**
 * CTS.utils
 *
 * @module   CTS.utils
 * 
 * @requires CTS
 * @requires CTS.endpoint
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
   * Just an XmlHttpRequest helper
   *
   * @function
   * @memberOf CTS.utils
   * @name xhr
   *
   * @param  {string}     method             HTTP Method
   * @param  {string}     url                HTTP URI to call
   * @param  {?function}  options.success    Function to call when request is done.
   * @param  {string}     options.type       Type of data wished (default: text/xml)
   * @param  {any}        options.data       Data to send
   * @param  {?function}  options.error      Function to call when request gave an error.
   *
   */
  var _xhr = function(method, url, options) {
    var xhr,
        _this = this;

    if(typeof options === undefined) {
      options = {}
    }
    if(typeof options.type === "undefined") {
      options.type = "text/xml";
    }
    if(typeof options.async === "undefined") {
      options.async = true;
    }

    if (window && window.XMLHttpRequest) {
      xhr = new XMLHttpRequest();
    } else if(window && window.ActiveXObject) {
      var names,
          i;
    
      if (window.ActiveXObject) {
        names = [
          'Msxml2.XMLHTTP.6.0',
          'Msxml2.XMLHTTP.3.0',
          'Msxml2.XMLHTTP',
          'Microsoft.XMLHTTP'
        ];
    
        for (i in names)
          try {
            return new ActiveXObject(names[i]);
          } catch (e) {}
      }
    } else {
      return null;
    }
    try {
      xhr.open(method, url, options.async);

      xhr.onerror = function() {
        if(typeof options.error === "function") {
          options.error(xhr.status, xhr.statusText);
        }
      }

      xhr.onreadystatechange = function() {
        if(xhr.status === 500 || xhr.status === 401 || xhr.status === 403 || xhr.status === 404 || xhr.status === 400) {
          if(typeof options.error === "function") {
            options.error(xhr.status, xhr.statusText);
          }
        } else {
          if (xhr.readyState === 4) {
            if(typeof options.success === "function") {
              if(options.type === "text/xml") {
                options.success(xhr.responseXML);
              } else if (options.type === "text" || options.type === "plain/text") {
                options.success(xhr.responseText);
              }
            }
          }
        }
      };
      if((typeof options.data !== "undefined" || options.data !== null) && method === "POST") {
        xhr.overrideMimeType("multipart/form-data");
        xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded;");
        xhr.send(CTS.utils.dataEncode(options.data));
      } else {
        xhr.send();
      }

    } catch(err) {
      if(typeof options.error === "function") {
        options.error(err);
      }
    }
  }

  /**
   * Return a correct endpoint url
   *
   * @function
   * @memberOf CTS.utils
   * @name checkEndpoint
   * 
   * @param  {string|CTS.endpoint.Endpoint}  endpoint  The CTS API endpoint
   * 
   * @returns {?CTS.endpoint.Endpoint}  An endpoint
   *
   */
  var _checkEndpoint = function(endpoint) {
    if(typeof endpoint === "string") {
      return new CTS.endpoint.default(endpoint);
    } else if( endpoint instanceof Object) {
      return endpoint;
    } else {
      return null;
    }
  }

  /**
   * Encode data for XHR
   *
   * @function
   * @memberOf CTS.utils
   * @name dataEncode
   *
   * @param  {Object.<string, any>}  data  A dictionary where keys are string
   * 
   * @returns  {string}  The url encoded parameters
   *
   */
  var _dataEncode = function(data) {
    var urlEncodedData = "",
        urlEncodedDataPairs = [];
    // We turn the data object into an array of URL encoded key value pairs.
    Object.keys(data).forEach(function(key) {
      if(Array.isArray(data[key])) {
        data[key].forEach(function(val) {
          urlEncodedDataPairs.push(encodeURIComponent(key) + "[]=" + encodeURIComponent(val));
        });
      } else {
        urlEncodedDataPairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
      }
    });

    // We combine the pairs into a single string and replace all encoded spaces to 
    // the plus character to match the behaviour of the web browser form submit.
    urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');
    return urlEncodedData;
  }


  /**
   * Parse an urn identifier into an int for comparison
   *
   * @function
   * @memberOf CTS.utils
   * @name parseInt
   * @deprecated  Not use anymore as technically, passage don't have to be in ascending order
   *
   * @param  {string|integer|Array.<string|integer>}  str  Data to be parsed
   * 
   * @returns  {integer}  Integer representing the urn identifier
   *
   */
  var _parseInt = function(str) {
    if(typeof str === "string") { var isString = str.toLowerCase().match("[a-z]{1}"); } else { isString === null; }
    if (!isNaN(str)) {
      return parseInt(str);
    } else if (isString !== null && isString[0].length === str.length) {
      var alpha = {a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8,i:9,j:10,k:11,l:12,m:13,n:14,o:15,p:16,q:17,r:18,s:19,t:20,u:21,v:22,w:23,x:24,y:25,z:26};
      return alpha[str];
    } else {
      var array = str.toLowerCase().match("([0-9]*)([a-z]*)([0-9]*)([a-z]*)([0-9]*)");
      if(array === null) { return 0; }
      var array = array.map(
        function(substr) { 
          if(substr.length > 0 && substr != str) { return substr; };
        }
      );
      var ret = [];
      for(var i = 0; i< array.length; i++){
          if (array[i]){
            ret.push(array[i]);
        }
      }
      return ret;
    }
    return 0;
  }

  /**
   * Check if passage identifier are valid
   *
   * @function
   * @memberOf CTS.utils
   * @name validPassage
   * @deprecated  Not use anymore as technically, passage don't have to be in ascending order
   *
   * @param  {Array.<string|integer|Array>}  $start  Start element 
   * @param  {Array.<string|integer|Array>}  $end    End element
   * 
   * @returns  {boolean}  Boolean indicating if the passage is valid
   *
   */
  var _ValidPassage = function ($start, $end) {
    var bigger = false,
        s,
        e;
    for (var i = 0; i <= $end.length - 1; i++) {
      var s = CTS.utils.parseInt($start[i]),
          e = CTS.utils.parseInt($end[i]);
      if(Array.isArray(s) && Array.isArray(e)) {
        bigger = CTS.utils.validPassage(s, e);
        if(bigger === true) {
          break;
        }
      } else {
        if(s < e) {
          bigger = true;
          break;
        } else if( e < s ) {
          break;
        }
      }
    };
    return bigger;
  }


  /**
   * Get the window location parameters (GET parameters)
   *
   * @function
   * @memberOf CTS.utils
   * @name uriParam
   * 
   * @returns  {Object.<string, any>}  Boolean indicating if the passage is valid
   *
   */
  var _uriParam = function() {
      var result = {},
          params = window.location.search.split(/\?|\&/);
      params.forEach( function(it) {
          if (it) {
              var param = it.split("=");
              result[param[0]] = param[1];
          }
      });

      return result;
  }

  /**
   * @namespace CTS.utils
   * @name CTS.utils
   */
  CTS.utils = {
    xhr : _xhr,
    dataEncode : _dataEncode,
    checkEndpoint : _checkEndpoint,
    parseInt : _parseInt,
    validPassage : _ValidPassage,
    uriParam : _uriParam
  }
}));
/**
 * CTS.service
 *
 * @module   CTS.service
 * 
 * @requires CTS.utils
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
   * @namespace CTS.service
   * @name CTS.service
   */
  CTS.service = {
  /**
   * @namespace CTS.service.services
   * @name CTS.service.services
   */
    services : {}
  }

  /**
   * Set the value of a field
   * 
   * @function
   * @memberOf CTS.service._service
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
   * @function
   * @memberOf CTS.service._service
   *
   * @returns  {Object.<string, string>}  A dictionary of key-value pair where key are field name
   *
   */
  var getValues = function() {
    var data = {},
        _this = this;
    Object.keys(_this.options).forEach(function(key) {
      data[key] = (typeof _this.options[key]["value"] !== "undefined") ? _this.options[key]["value"] : _this.options[key]["default"];
    });
    return data;
  }

  /**
   *  Get the option of the current instance
   *
   * @function
   * @memberOf CTS.service._service
   *
   * @return  {Object.<string, Object.<string, any>>}  Dictionary of pair key-object where key are field name and object contain datatype, html and default value 
   *
   */
  var getOptions = function() {
    return this.options;
  }

  /**
   * Send the request
   * 
   * @function
   * @memberOf CTS.service._service
   * 
   * @param  {Function} callback Callback in case of success
   * @param  {string}   format   Format expected by data
   * @default  text/xml
   */
  var send = function(callback, format) {
    if (typeof format === "undefined") { format = "text/xml"; }
    //function(method, url, callback, type, async)
    CTS.utils.xhr(this.method, this.endpoint, {
      success : function(data) {
        if(typeof callback === "function") { callback(data); }
      }, 
      type : format, 
      "data" : this.getValues()
    });
  }

  /**
   * Prototype for services
   *
   * @constructor
   * @memberOf CTS.service
   *
   * @param  {string}                endpoint  Url of the service endpoint
   * @param  {Object.<string, any>}  options   Any options to reuse inside
   *
   * @property  {string}                   endpoint  URL of the service
   * @property  {string}                   method    HTTP Method to use for the HTTP request
   * @property  {Object.<string, Object>}  options  Options for the service
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
   *  Create a new service
   *
   *  @function
   *  @memberOf CTS.service
   *  
   *  @param  {string}                service   Name of the service stylesheet (Available in {@link CTS.service.services})
   *  @param  {string}                endpoint  Url of the service endpoint
   *  @param  {Object.<string, any>}  options   Any options to reuse inside
   *
   *  @returns {CTS.service._service}  A CTS.XSLT intance with given options
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

/**
 * CTS.endpoint
 *
 * @module   CTS.endpoint
 * 
 * @requires CTS.utils
 * @requires CTS
 * 
 * @link https://github.com/PerseusDL/Capitains-Sparrow
 * @author PonteIneptique (Thibault Clérice)
 * @version 1.0.0
 * @license https://github.com/PerseusDL/Capitains-Sparrow/blob/master/LICENSE
 *
 */

/* global define */(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['cts'], factory);
  } else {
    factory(CTS);
  }
}(function(CTS) {

  /** 
   * @namespace CTS.endpoint
   * @name CTS.endpoint
   */
  CTS.endpoint = {}

  /**
   * Prototype of CTS.endpoint
   * 
   * @constructor
   * @memberOf  CTS.endpoint
   * 
   * @param  {string}   api_endpoint  URL of the API endpoint
   * @param  {?string}  inventory     Default inventory
   *
   * @property  {string}   url         Url of the Endpoint
   * @property  {?string}  inventory   Default inventory to fallback on
   */
  CTS.endpoint.Endpoint = function(api_endpoint, inventory) {
    this.url = api_endpoint;
    this.inventory = (typeof inventory !== "undefined") ? inventory : null;

    /**
     * Create the GetCapabilities URL
     * 
     * @param  {?string}  inventory  Name of the inventory
     * 
     * @returns {string}             URL of the request
     */
    this.getCapabilitiesURL = function(inventory) { throw "Unsupported request"; }
    this.getDescriptionURL  = function() { throw "Unsupported request"; }
    this.getPrevNextUrnURL  = function(urn)  { throw "Unsupported request"; }

    /**
     * Create the GetValidReff URL
     * 
     * @param  {string}    urn                Urn of the text's passage
     * @param  {?string}   options.level      Level of reference to retrieve
     * @param  {?string}   options.inventory  Name of the inventory
     * 
     * @returns {string}                       URL of the request
     */
    this.getValidReffURL = function(urn, options) { throw "Unsupported request"; }

    /**
     * Create the GetPassage URL
     * 
     * @param  {urn}      urn        Urn of the Text's passage
     * @param  {?string}  inventory  Name of the inventory
     * 
     * @returns {string}            URL of the request
     */
    this.getPassageURL = function(urn, inventory)  { throw "Unsupported request"; }
    this.getPassagePlusURL  = function(urn) { throw "Unsupported request"; }

    /**
     * Do a GetCapabilities request
     * 
     * @param {?string}    inventory         Inventory name
     * @param {?function}  options.success   Success callback
     * @param {?function}  options.error     Error callback
     */
    this.getCapabilities = function(inventory, options) { throw "Unsupported request"; }
    this.getDescription  = function() { throw "Unsupported request"; }
    this.getPrevNextUrn  = function(urn)  { throw "Unsupported request"; }

    /**
     * Do a GetValidReff request
     * 
     * @param {string}     urn                Urn of the text's passage
     * @param {?string}    options.level      Level of reference to retrieve
     * @param {?string}    options.inventory  Inventory name
     * @param {?function}  options.success    Success callback
     * @param {?function}  options.error      Error callback
     */
    this.getValidReff    = function(urn, options) { throw "Unsupported request"; }

    /**
     * Do a GetPassage request
     * 
     * @param {string}     urn               Urn of the text's passage
     * @param {?string}    options.inventory Inventory name
     * @param {?function}  options.success   Success callback
     * @param {?function}  options.error     Error callback
     */
    this.getPassage      = function(urn, options) { throw "Unsupported request"; }
    this.getPassagePlus  = function(urn) { throw "Unsupported request"; }

    /**
     * Make an XHR Request using CTS.utils.xhr
     * 
     * @param  {string}    url              URL to call
     * @param  {Function}  options.success  Success Callback function
     * @param  {Function}  options.error    Error Callback function
     */
    this.getRequest = function(url, options) {
      CTS.utils.xhr("GET", url, {
        success : options.success,
        error   : options.error,
        type    : options.type
      });
    };

    /**
     * Make an XHR POST Request using CTS.utils.xhr
     * 
     * @param  {string}    url              URL to call
     * @param  {Function}  options.success  Success Callback function
     * @param  {Function}  options.error    Error Callback function
     * @param  {Function}  options.data     Error Callback function
     * @param  {Function}  options.type     Data type
     */
    this.postRequest = function(url, options) {
      CTS.utils.xhr("POST", url, {
        success : options.success,
        error   : options.error,
        data    : options.data,
        type    : options.type
      });
    };
  }
  CTS.endpoint.Endpoint.prototype = Object.create(CTS.endpoint.Endpoint);

  /**
   * CTS API using simple xQuery rest system.
   * 
   * @constructor
   * @augments    CTS.endpoint.Endpoint
   * @memberOf  CTS.endpoint
   * 
   * @param  {string}   api_endpoint  URL of the API endpoint
   * @param  {?string}  inventory     Default inventory
   *
   */
  CTS.endpoint.XQ = function(api_endpoint, inventory) {
    CTS.endpoint.Endpoint.call(this);

    if(api_endpoint.slice(-1) !== "?") { api_endpoint = api_endpoint + "?"; }
    this.url = api_endpoint;

    this.inventory = (typeof inventory !== "undefined") ? inventory : null;

    /**
     * Small helper to create urls
     * 
     * @param    {Object.<string, any>}  params  Object representing parameters name
     * 
     * @returns  {string}                        The URL
     */
    this.getUrl = function(params) {
      var urlParams = [];
      Object.keys(params).forEach(function(key) {
        urlParams.push(key + "=" + params[key]);
      });
      return this.url + urlParams.join("&");
    }

    /**
     * Create the GetCapabilities URL
     * 
     * @param   {?string} inventory  Name of the inventory
     * 
     * @returns {string}             URL of the request
     */
    this.getCapabilitiesURL = function(inventory) {
      var params = {
        request : "GetCapabilities"
      }
      if((typeof inventory !== "undefined" && inventory !== null) || this.inventory !== null) {
        params.inv = (typeof inventory !== "undefined" && inventory !== null) ? inventory : this.inventory;
      }
      return this.getUrl(params);
    }

    /**
     * Do a GetCapabilities request
     * 
     * @param {?string}    inventory         Inventory name
     * @param {?function}  options.success   Success callback
     * @param {?function}  options.error     Error callback
     */
    this.getCapabilities = function(inventory, options) {
      if(typeof inventory !== "string") {
        options = inventory;
        inventory = null;
      }
      this.getRequest(this.getCapabilitiesURL(inventory), options);
    }

    /**
     * Create the GetPassage URL
     * 
     * @param  {urn}     urn       Urn of the Text's passage
     * @param  {?string} inventory Name of the inventory
     * 
     * @returns {string}            URL of the request
     */
    this.getPassageURL = function(urn, inventory) {
      var params = {
        request : "GetPassage",
        urn : urn
      }
      if((typeof inventory !== "undefined" && inventory !== null) || this.inventory !== null) {
        params.inv = (typeof inventory !== "undefined" && inventory !== null) ? inventory : this.inventory;
      }
      return this.getUrl(params);
    }

    /**
     * Do a GetPassage request
     * @param {string}     urn               Urn of the text's passage
     * @param {?string}    options.inventory Inventory name
     * @param {?function}  options.success   Success callback
     * @param {?function}  options.error     Error callback
     */
    this.getPassage = function(urn, options) {
      if(typeof options === "undefined") {
        options = {};
      }
      this.getRequest(this.getPassageURL(urn, options.inventory), options);
    }

    /**
     * Create the GetValidReff URL
     * @param  {string}    urn                Urn of the text's passage
     * @param  {?string}   options.level      Level of reference to retrieve
     * @param  {?string}   options.inventory  Name of the inventory
     * 
     * @returns {string}                       URL of the request
     */
    this.getValidReffURL = function(urn, options) {
      var params = {
        request : "GetValidReff",
        urn : urn
      }
      if(typeof options === "undefined") {
        options = {};
      }
      if(typeof options.level !== "undefined") {
        params.level = options.level;
      }
      if((typeof options.inventory !== "undefined" && options.inventory !== null) || this.inventory !== null) {
        params.inv = (typeof options.inventory !== "undefined" && options.inventory !== null) ? options.inventory : this.inventory;
      }
      return this.getUrl(params);
    }

    /**
     * Do a GetValidReff request
     * 
     * @param {string}     urn               Urn of the text's passage
     * @param {?string}    options.level     Level of reference to retrieve
     * @param {?string}    options.inventory Inventory name
     * @param {?function}  options.success   Success callback
     * @param {?function}  options.error     Error callback
     */
    this.getValidReff = function(urn, options) {
      if(typeof options === "undefined") {
        options = {};
      }
      this.getRequest(this.getValidReffURL(urn, options), options);
    }
  }
  CTS.endpoint.XQ.prototype = Object.create(CTS.endpoint.Endpoint);

  /**
   * Default Endpoint type to use for plugins
   * Default to {@link CTS.endpoint.XQ}
   * 
   * @type     {CTS.endpoint.Endpoint}
   * @memberOf  CTS.endpoint
   */
  CTS.endpoint.default = CTS.endpoint.XQ;
}));
/**
 * CTS.text
 *
 * @module   CTS.text
 * 
 * @requires CTS
 * @requires CTS.utils
 * @requires CTS.endpoint
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
   * Text related functions
   * @namespace CTS.text
   * @name CTS.text
   */
  CTS.text = {};

  /**
   * Get the text, removing nodes if necessary. if the instance has the text.property set, returns it.
   *
   *  @function
   *  @memberOf CTS.text.Passage
   *  @name getText
   *
   *  @param    {Array.<string>}   removedNodes   List of nodes' tagname to remove
   *
   *  @returns  {string}  Instance text
   */
  var _getText = function(removedNodes) {
    var xml = this.document,
        text;
    if(this.text !== null) { return this.text; }
    if(typeof removedNodes === "undefined") {
      removedNodes = ["note", "bibl", "head"];
    }

    removedNodes.forEach(function(nodeName) { 
      var elements = xml.getElementsByTagName(nodeName);
      while (elements[0]) elements[0].parentNode.removeChild(elements[0]);
    });

    text = xml.getElementsByTagName("text")[0].textContent;
    return text;
  }

  /**
   * Set the text for the Text instance
   *
   * @function
   * @memberOf CTS.text.Passage
   * @name setText
   *
   * @param  text  {string}    Text embodied by object.urn
   *
   */
  var _setText = function(text) {
    this.text = text;
  }

  /**
   * Load the text from the endpoint
   *
   * @function
   * @memberOf CTS.text.Passage
   * @name retrieve
   *
   * @param  options.success   {?function}    Function to call when text is retrieved
   * @param  options.error     {?function}    Function to call when an error occured
   * @param  options.endpoint  {?string}      CTS API Endpoint
   *
   */
  var _retrieve = function(options) {
    var _this = this,
        url;

    if(typeof options === "undefined") { options = {}; }
    if(typeof options.endpoint === "undefined") {
      endpoint = this.endpoint;
    } else {
      endpoint = CTS.utils.checkEndpoint(options.endpoint);
    }

    endpoint.getPassage(this.urn, {
      inventory : this.inventory,
      success : function(data) {
        _this.xml = data;
        _this.document = (new DOMParser()).parseFromString(data, "text/xml");
        if(typeof options.success === "function") { options.success(data); }
      
      },
      type : "plain/text",
      error : options.error
    });

    //And here we should load the stuff through cts.utils.ajax
  }

  /**
   * Check if the body of the XML is not empty
   *
   * @function
   * @memberOf CTS.text.Passage
   * @name getXML
   *
   * @returns  {boolean}  Boolean indecating if we got xml or not.
   *
   */
  var _checkXML = function() {
    var _this = this,
        xml;

    try {
      xml = _this.getXml("body");
      if(xml[0].childNodes.length === 0) {
        return false;
      } else {
        return true;
      }
    } catch (e) {
      return false;
    }

  }

  /**
   *  Gets the xml using the URN
   *
   * @function
   * @memberOf CTS.text.Passage
   * @name getXml
   *
   *  @param  elementName  {?string}  The name of the element to retrieve. Should be null to access format and still get whole document
   *  @param  format       {?string}  Type of data to retrieve. Default : xml. Available : xml, string
   *
   *  @returns      {Document|string}  Asked dom
   *
   */
  var _getXml = function(elementName, format) {
    var _this = this,
        reconstruct = false,
        xml;

    if(typeof format !== "string" || (format !== "xml" && format !== "string")) {
      format = "xml";
    }

    //If elementName is not a string
    if(typeof elementName !== "string") {
      xml = _this.document;
    //If we have a selector, we go around by transforming the DOM into a document
    } else {
      xml = _this.document.getElementsByTagName(elementName);
      reconstruct = true;
    }

    if(format === "string") {
      var oSerializer = new XMLSerializer();
      if(reconstruct === true) {
        return [].map.call(xml, function(node) { return oSerializer.serializeToString(node); }).join("\n");
      } else {
        return oSerializer.serializeToString(xml); 
      }
    } else {
      return xml;
    }
  }

  /**
   * Create a Passage object representing part of a full text
   *
   * @constructor
   * @memberOf CTS.text
   *
   * @param  urn        {string}                           URN identifying the text
   * @param  endpoint   {?string|CTS.endpoint.Endpoint}    CTS API Endpoint. 
   * @param  inventory  {?inventory}                       Inventory Identifier
   *
   * @property  {Document}               document   The XML document representing the passage
   * @property  {string}                 xml        String representation of the XML representing the passage
   * @property  {string}                 text       Text of the passage
   * @property  {string}                 urn        URN identifying the passage
   * @property  {?inventory}             inventory  Inventory containing the text
   * @property  {CTS.endpoint.Endpoint}  endpoint  Endpoint to get the text
   *
   */
  CTS.text.Passage = function(urn, endpoint, inventory) {
    if(typeof inventory !== "string") {
      inventory = null;
    }

    //DOM
    this.document = null;
    //Strings
    this.xml = null;
    this.text = null;
    this.urn = urn;
    this.inventory = inventory;
    this.endpoint = CTS.utils.checkEndpoint(endpoint);
    //Functions
    this.retrieve = _retrieve;
    this.setText = _setText;
    this.getText = _getText;
    this.getXml = _getXml;
    this.checkXML = _checkXML;
  }

  /**
   * Create a text object representing either a passage or a full text
   *
   * @constructor
   * @memberOf CTS.text
   * 
   * @param  urn        {string}                           URN identifying the text
   * @param  endpoint   {?string|CTS.endpoint.Endpoint}    CTS API Endpoint. 
   * @param  inventory  {?inventory}                       Inventory Identifier
   *
   * @property  {string}                 urn        URN identifying the passage
   * @property  {?inventory}             inventory  Inventory containing the text
   * @property  {CTS.endpoint.Endpoint}  endpoint  Endpoint to get the text
   */
  CTS.text.Text = function(urn, endpoint, inventory) {
    if(typeof inventory !== "string") {
      inventory = null;
    }

    this.urn = urn;
    this.inventory = inventory;
    this.endpoint = CTS.utils.checkEndpoint(endpoint);
    //Functions
    this.reffs = {}
    this.passages = {}

    this.makePassageUrn = function(ref1, ref2) {
      if(typeof ref2 === "undefined") { var ref2 = []; }
      var r1 = []
      var r2 = []
      for (var i = 0; i < ref1.length; i++) {
        if(typeof ref1[i] === "undefined") {
          break;
        } else {
          r1.push(ref1[i]);
        }
      };

      for (var i = 0; i < ref2.length; i++) {
        if(i >= r1.length) {
          break;
        }
        if(typeof ref2[i] === "undefined") {
          break;
        } else {
          r2.push(ref2[i]);
        }
      };

      var ref = this.urn + ":" + r1.join(".")
      if(r2.length == r1.length) {
        ref = ref + "-" + r2.join(".");
      }
      return ref;
    }

    this.getPassage = function(ref1, ref2) {
      var ref = this.makePassageUrn(ref1, ref2);
      this.passages[ref] = new CTS.text.Passage(ref, this.endpoint, this.inventory);

      return this.passages[ref];
    }
    this.getFirstPassagePlus = function() {
      endpoint = CTS.utils.checkEndpoint(options.endpoint);
      endpoint.getFirstPassagePlus(this.urn, {
        inventory : this.inventory,
        success : function(data) {
          var xml = (new DOMParser()).parseFromString(data, "text/xml");
          var ref = xml.getElementsByTagName("current")[0].innerHtml;
          _this.passages[ref] = new CTS.text.Passage(_this.urn, _this.endpoint, _this.inventory)
          if(typeof options.success === "function") { options.success(data); }
        
        },
        type : "plain/text",
        error : options.error
      });
    }
    this.getValidReff = function() { throw "Not Implemented Yet"; }
  }  
}));
/**
 * CTS.repository
 *
 * @module   CTS.repository
 * 
 * @requires CTS.utils
 * @requires CTS.endpoint
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
"use strict";

  /**
   *  @namespace CTS.repository
   *  @name CTS.repository
   *  
   */
  CTS.repository = {}

  /**
   *  @namespace CTS.Repository.Prototypes
   *  @name CTS.repository.Prototypes
   */
  CTS.repository.Prototypes = {}

  /**
   * Prototype for CTS Text (alias share practices between Edition and Translation)
   * 
   *  @constructor
   *  @memberOf  CTS.repository.Prototypes
   *  
   *  @param {string}   type  Type of Text
   *  
   *  @property  {string}                      urn                        URN of the Text
   *  @property  {string}                      type                       Type of the Text
   *  @property  {string}                      lang                       Lang of the Text
   *  @property  {Object.<string, string>}     titles                     <langCode, title> Dictionary of titles to show for the textgroup (Author name)
   *  @property  {string}                      defaultLangLabel           Default lang to use to display title
   *  @property  {Object.<string, string>}     descriptions               <langCode, title> Dictionary of titles to show for the textgroup (Author name)
   *  @property  {string}                      defaultLangDesc            Default lang to use to display title
   *  @property  {Array.<string>}              citations                  List of label for citations scheme
   */
  CTS.repository.Prototypes.Text = function(type) {
    this.descriptions = {}
    this.titles = {}
    this.urn = "";
    this.citations = [];
    this.defaultLangDesc;
    this.defaultLangLabel;
    this.type = type;
    this.lang = "";

    /**
     * Get the description
     * 
     *  @function
     *  
     *  @param  {?string} lang Lang wished
     *  @returns {string}       Title of the object. Return default lang if lang not found
     */
    this.getDesc  = function(lang) {
      if(lang === "undefined") {
        lang = this.defaultLangDesc;
      } else if (!(lang in this.descriptions)) {
        return this.descriptions[this.defaultLangDesc];
      }
      return this.descriptions[lang];
    }

    /**
     * Get the title of the object
     * 
     *  @function
     *  
     *  @param  {?string} lang Lang wished
     *  @returns {string}       Title of the object. Return default lang if lang not found
     */
    this.getTitle = function(lang) {
      if(lang === "undefined") {
        lang = this.defaultLangLabel;
      } else if (!(lang in this.titles)) {
        return this.titles[this.defaultLangLabel];
      }
      return this.titles[lang];
    }
  }

  /**
   * Prototype for CTS Work
   * 
   *  @constructor
   *  @memberOf  CTS.repository.Prototypes
   *  
   *  @property  {string}                                               urn             URN of the Work
   *  @property  {string}                                               lang            Lang of the Work
   *  @property  {Object.<string, string>}                              titles          <langCode, title> Dictionary of titles to show for the textgroup (Author name)
   *  @property  {string}                                               defaultLang     Default lang to use to display title
   *  @property  {Array.<CTS.repository.Prototypes.Work>}               texts           Texts available in the inventory
   *  @property  {Array.<CTS.repository.Prototypes.Edition>}            editions        Editions available in the inventory
   *  @property  {Array.<CTS.repository.Prototypes.Translation>}        translations    Translations available in the inventory
   */
  CTS.repository.Prototypes.Work = function() {
    this.titles = {};
    this.urn = "";
    this.defaultLang = "";
    this.lang = "";

    this.editions = [];
    this.translations = [];
    this.texts = [];

    /**
     * Get the title of the object
     * 
     *  @function
     *  
     *  @param  {?string} lang Lang wished
     *  @returns {string}       Title of the object. Return default lang if lang not found
     */
    this.getTitle = function(lang) {
      if(lang === "undefined") {
        lang = this.defaultLang;
      } else if (!(lang in this.titles)) {
        return this.titles[this.defaultLang];
      }
      return this.titles[lang];
    }

    /**
     * Convert the work into a Theoritical Text
     * 
     *  @function
     *  
     *  @returns {CTS.repository.Prototypes.Text}  Actual Work into a theoretical text
     */
    this.toTheoretical = function() {
      var theoretical = new CTS.repository.Prototypes.Text();
      theoretical.urn = this.urn;
      theoretical.defaultLangLabel = this.defaultLang;
      theoretical.titles = this.titles;
      theoretical.lang = this.lang;
      return theoretical;
    }
  }

  /**
   * Prototype for CTS TextGroup
   * 
   *  @constructor
   *  @memberOf  CTS.repository.Prototypes
   *  
   *  @property  {string}                                       urn          URN of the TextGroup
   *  @property  {Object.<string, string>}                      titles       <langCode, title> Dictionary of titles to show for the textgroup (Author name)
   *  @property  {string}                                       defaultLang  Default lang to use to display title
   *  @property  {Array.<CTS.repository.Prototypes.Work>}       works        Textgroup available in the inventory
   */
  CTS.repository.Prototypes.TextGroup = function() {
    this.titles = {};
    this.urn = "";
    this.defaultLang = "";
    this.works = [];

    /**
     * Get the title of the object
     * 
     *  @function
     *  
     *  @param  {?string} lang Lang wished
     *  @returns {string}       Title of the object. Return default lang if lang not found
     */
    this.getTitle = function(lang) {
      if(lang === "undefined") {
        lang = this.defaultLang;
      } else if (!(lang in this.titles)) {
        return this.titles[this.defaultLang];
      }
      return this.titles[lang];
    }
  }


  /**
   * TextInventory Prototype
   * 
   *  @constructor
   *  @memberOf  CTS.repository.Prototypes
   *  
   *  @param     {string}                                            identifier  Identifier, usually an URI
   *
   *  @property  {string}                                            namespace   Namespace for nodes parsing
   *  @property  {Node}                                              xml         XML node representing the TextInventory node
   *  @property  {Array.<CTS.repository.Prototypes.TextGroup>}       textgroups  Textgroup available in the inventory
   */
  CTS.repository.Prototypes.TextInventory = function(identifier) {
    this.identifier = identifier;
    this.namespace = "";
    this.textgroups = [];

    /**
     * Get a N-Dimensional object corresponding to your TextInventory
     * Hierarchy as following : TextGroup > Work > Edition | Translation | Theoretical
     * 
     *  @function
     *  
     *  @param   {string}  lang        Lang to chose for titles (keys in the dictionary)
     *  @param   {boolean} theoretical Include theoretical works
     *  @returns {Object}              Dictionary with hierarchy such as TextGroup > Work > Edition | Translation | Theoretical
     */
    this.getRaw = function(lang, theoretical) {
      if(typeof theoretical === "undefined") {
        theoretical = false;
      }
      var r = {};
      this.textgroups.forEach(function(tg) {
        var tgLabel = tg.getTitle(lang);
        r[tgLabel] = {};
        tg.works.forEach(function(w) {
          var wLabel = w.getTitle(lang);
          r[tgLabel][wLabel] = {"edition" : {}, "translation" : {}};
          w.editions.forEach(function(e) {
            r[tgLabel][wLabel]["edition"][e.getTitle(lang)] = e;
          });
          w.translations.forEach(function(t) {
            r[tgLabel][wLabel]["translation"][t.getTitle(lang)] = t;
          });
          if(theoretical === true) {
            r[tgLabel][wLabel]["theoretical"] = {};
            r[tgLabel][wLabel]["theoretical"][wLabel] = w.toTheoretical();
          }
        });

      });
      return r;
    }
  }


  /**
   * CTS 3 Implementations
   */

  /**
   *  @namespace
   *  @name CTS.repository.Prototypes.cts3
   */
  CTS.repository.Prototypes.cts3 = {};

  /**
   * Instantiate CTS Text from CTS3 XML (CTS Text is the abstract model shared by Edition and Translation)
   *
   *  @constructor
   *  @augments CTS.repository.Prototypes.Text
   *  
   *  @param {NodeList} nodes DOM element to use for completion of the instance
   *  @param {string}   type  Type of Text
   *  @param {string}   urn   URN of the parent
   *  
   *  @property  {string}                      urn                        URN of the Text
   *  @property  {string}                      type                       Type of the Text
   *  @property  {string}                      lang                       Lang of the Text
   *  @property  {Object.<string, string>}     titles                     <langCode, title> Dictionary of titles to show for the textgroup (Author name)
   *  @property  {string}                      defaultLangLabel           Default lang to use to display title
   *  @property  {Object.<string, string>}     descriptions               <langCode, title> Dictionary of titles to show for the textgroup (Author name)
   *  @property  {string}                      defaultLangDesc            Default lang to use to display title
   *  @property  {Array.<string>}              citations                  List of label for citations scheme
   */
  CTS.repository.Prototypes.cts3.Text = function (nodes, type, urn) {
    CTS.repository.Prototypes.Text.call(this, type);

    this.urn = urn + "." + nodes.getAttribute("projid").split(":")[1];

    this.citations = [].map.call(nodes.getElementsByTagName("citation"), function(e) { return e.getAttribute("label") || "Unknown"; });

    // We get the labels
    var descriptions = nodes.getElementsByTagName("description");
    for (var i = descriptions.length - 1; i >= 0; i--) {
      this.defaultLangDesc = descriptions[i].getAttribute("xml:lang");
      this.descriptions[this.defaultLangDesc] = descriptions[i].textContent;
    };

    // We get the labels
    var labels = nodes.getElementsByTagName("label");
    for (var i = labels.length - 1; i >= 0; i--) {
      this.defaultLangLabel = labels[i].getAttribute("xml:lang");
      this.titles[this.defaultLangLabel] = labels[i].textContent;
    };
  }
  CTS.repository.Prototypes.cts3.Text.prototype = Object.create(CTS.repository.Prototypes.Text.prototype)

  /**
   * Instantiate CTS Edition from CTS3 XML
   * 
   *  @constructor
   *  @augments CTS.repository.Prototypes.cts3.Text
   *  
   *  @param {NodeList} nodes DOM element to use for completion of the instance
   *  @param {string}   urn   URN of the parent
   *  @param {lang}     lang  Lang of the text
   *  
   *  @property  {string}                      urn                        URN of the Edition
   *  @property  {string}                      lang                       Lang of the Edition
   *  @property  {Object.<string, string>}     titles                     <langCode, title> Dictionary of titles to show for the textgroup (Author name)
   *  @property  {string}                      defaultLangLabel           Default lang to use to display title
   *  @property  {Object.<string, string>}     descriptions               <langCode, title> Dictionary of titles to show for the textgroup (Author name)
   *  @property  {string}                      defaultLangDesc            Default lang to use to display title
   *  @property  {Array.<string>}              citations                  List of label for citations scheme
   */
  CTS.repository.Prototypes.cts3.Edition = function(nodes, urn, lang) {
    CTS.repository.Prototypes.cts3.Text.call(this, nodes, "edition", urn);
    //Edition have the lang from their parent
    this.lang = lang;
  }
  CTS.repository.Prototypes.cts3.Edition.prototype = Object.create(CTS.repository.Prototypes.cts3.Text.prototype)

  /**
   * Instantiate CTS Translation from CTS3 XML
   * 
   *  @constructor
   *  @augments CTS.repository.Prototypes.cts3.Text
   *  
   *  @param {NodeList} nodes DOM element to use for completion of the instance
   *  @param {string}   urn   URN of the parent
   *  
   *  @property  {string}                      urn                        URN of the Translation
   *  @property  {string}                      lang                       Lang of the Translation
   *  @property  {Object.<string, string>}     titles                     <langCode, title> Dictionary of titles to show for the textgroup (Author name)
   *  @property  {string}                      defaultLangLabel           Default lang to use to display title
   *  @property  {Object.<string, string>}     descriptions               <langCode, title> Dictionary of titles to show for the textgroup (Author name)
   *  @property  {string}                      defaultLangDesc            Default lang to use to display title
   *  @property  {Array.<string>}              citations                  List of label for citations scheme
   */
  CTS.repository.Prototypes.cts3.Translation = function(nodes, urn) {
    CTS.repository.Prototypes.cts3.Text.call(this, nodes, "translation", urn);
    //Translation get their lang from their body
    this.lang = nodes.getAttribute("xml:lang");
  }
  CTS.repository.Prototypes.cts3.Translation.prototype = Object.create(CTS.repository.Prototypes.cts3.Text.prototype)


  /**
   * Instantiate CTS Work from CTS3 XML
   * 
   *  @constructor
   *  @augments CTS.repository.Prototypes.Work
   *  
   *  @param {NodeList} nodes DOM element to use for completion of the instance
   *  @param {string}   urn   URN of the parent
   *  
   *  @property  {string}                                               urn             URN of the Work
   *  @property  {string}                                               lang            Lang of the Work
   *  @property  {Object.<string, string>}                              titles          <langCode, title> Dictionary of titles to show for the textgroup (Author name)
   *  @property  {string}                                               defaultLang     Default lang to use to display title
   *  @property  {Array.<CTS.repository.Prototypes.cts3.Text>}          texts           Texts available in the inventory
   *  @property  {Array.<CTS.repository.Prototypes.cts3.Edition>}       editions        Editions available in the inventory
   *  @property  {Array.<CTS.repository.Prototypes.cts3.Translation>}   translations    Translations available in the inventory
   */
  CTS.repository.Prototypes.cts3.Work = function(nodes, urn) {
    CTS.repository.Prototypes.Work.call(this);
    this.urn = urn + "." + nodes.getAttribute("projid").split(":")[1];
    this.lang = nodes.getAttribute("xml:lang");

    // We get the labels
    var groupnames = nodes.getElementsByTagName("title");
    for (var i = groupnames.length - 1; i >= 0; i--) {
      this.defaultLang = groupnames[i].getAttribute("xml:lang");
      this.titles[this.defaultLang] = groupnames[i].textContent;
    };

    var editions = nodes.getElementsByTagName("edition");
    for (var i = editions.length - 1; i >= 0; i--) {
      this.editions.push(new CTS.repository.Prototypes.cts3.Edition(editions[i], this.urn, this.lang));
    };

    var translations = nodes.getElementsByTagName("translation");
    for (var i = translations.length - 1; i >= 0; i--) {
      this.translations.push(new CTS.repository.Prototypes.cts3.Translation(translations[i], this.urn));
    };

    this.texts = this.translations.concat(this.editions);
  }
  CTS.repository.Prototypes.cts3.Work.prototype = Object.create(CTS.repository.Prototypes.Work.prototype)

  /**
   * Instantiate CTS TextGroup from CTS3 XML
   * 
   *  @constructor
   *  @augments CTS.repository.Prototypes.cts3.TextGroup
   *  
   *  @param {NodeList} nodes DOM element to use for completion of the instance
   *
   *  @property  {string}                                       urn          URN of the TextGroup
   *  @property  {Object.<string, string>}                      titles       <langCode, title> Dictionary of titles to show for the textgroup (Author name)
   *  @property  {string}                                       defaultLang  Default lang to use to display title
   *  @property  {Array.<CTS.repository.Prototypes.cts3.Work>}  works        Textgroup available in the inventory
   */
  CTS.repository.Prototypes.cts3.TextGroup = function(nodes) {
    CTS.repository.Prototypes.TextGroup.call(this);
    this.urn = "urn:cts:" + nodes.getAttribute("projid");

    // We get the labels
    var labels = nodes.getElementsByTagName("groupname");
    for (var i = labels.length - 1; i >= 0; i--) {
      this.defaultLang = labels[i].getAttribute("xml:lang");
      this.titles[this.defaultLang] = labels[i].textContent;
    };

    var works = nodes.getElementsByTagName("work");
    for (var i = works.length - 1; i >= 0; i--) {
      this.works.push(new CTS.repository.Prototypes.cts3.Work(works[i], this.urn))
    };
  }
  CTS.repository.Prototypes.cts3.TextGroup.prototype = Object.create(CTS.repository.Prototypes.TextGroup.prototype)

  /**
   * Instantiate CTS TextInventory from CTS3 XML
   * 
   *  @constructor
   *  @augments CTS.repository.Prototypes.cts3.TextInventory
   *  
   *  @param {document} xml          Parsed XML representing the inventory
   *  @param {string}   namespace    Namespace to use
   *  @param {string}   identifier   Identifier, usually an URI
   *
   *  @property  {string}                                            namespace   Namespace for nodes parsing
   *  @property  {Node}                                              xml         XML node representing the TextInventory node
   *  @property  {Array.<CTS.repository.Prototypes.cts3.TextGroup>}  textgroups  Textgroup available in the inventory
   */
  CTS.repository.Prototypes.cts3.TextInventory = function(xml, namespace, identifier) {
    CTS.repository.Prototypes.TextInventory.call(this, identifier);
    this.xml = xml;
    this.namespace = namespace;
    this.xml = this.xml.getElementsByTagNameNS(this.namespace, "TextInventory");
   
    if(this.xml.length == 1) {
      var textgroups = this.xml[0].getElementsByTagNameNS(this.namespace, "textgroup");
      for (var i = textgroups.length - 1; i >= 0; i--) {
        this.textgroups.push(new CTS.repository.Prototypes.cts3.TextGroup(textgroups[i]))
      };
    }
  }
  CTS.repository.Prototypes.cts3.TextInventory.prototype = Object.create(CTS.repository.Prototypes.TextInventory.prototype)

  /**
   * Repository Object
   *
   * For clarity, each function is defined as private variable before
   */

  /**
   * Set the endpoint URL of the object
   * 
   *  @memberOf  CTS.repository.repository
   *  @name setEndpoint
   *  @method
   *  
   *  @param    {Array.<string>}  url  A url for the repository
   */
  var _setEndpoint = function(url) {
    if(typeof url === "string") {
      this.endpoint = [url];
    } else if (typeof url === "array") {
      this.endpoint = url;
    }
  }

  /**
   * Set the inventories
   *
   *  @memberOf  CTS.repository.repository
   *  @name setInventory
   *  @method
   *  
   *  @param  {dict}  dict  A dictionary where keys are inventory's name and value a label
   */

  var _setInventory = function(dict) {
    this.inventory = dict;
  }

  /**
   * Add an inventory to the Repository Object
   * 
   *  @memberOf  CTS.repository.repository
   *  @name addInventory
   *  @method
   * 
   *  @param  {string}   name   Database name of the inventory
   *  @param  {?string}  label  Pretty name for UI (optional)
   */
  var _addInventory = function(name, label) {
    if(typeof name === "string") {
      if(typeof label === "undefined") {
        this.inventory[name] = name;
      } else {
        this.inventory[name] = label;
      }
    } else {
      throw "Name is not a string";
    }
  }

  /**
   * Remove an inventory
   * 
   *  @memberOf  CTS.repository.repository
   *  @name delInventory
   *  @method
   *  
   *  @param  {string} name Database name of the inventory
   */
  var _delInventory = function(name) {
    if(typeof name === "string" && name in self.inventory) {
      delete this.inventory[name];
    } else {
      throw name + " is not in known inventories."
    }
  }

  /**
   * Get the repository from source url
   *
   *  @memberOf  CTS.repository.repository
   *  @name load
   *  @method
   *  
   *  @param  {?function}                callback        Function to call when data are loaded
   *  @param  {?function}                error_callback  Function to call when data are not loaded
   *  @param  {?Array.<string>}           inventory_name  Name of the inventory to load
   *
   */
  var _load = function(callback, error_callback, inventories) {
    var endpoint = this.endpoint, 
        xhr = CTS.utils.xhr,
        _this = this;

    if(typeof inventories === "undefined") {
      var inventories = Object.keys(this.inventory);
    }

    //Basically if we have only the callback
    if(typeof callback !== "function") {
      var callback = null;
    }
    //Basically if we have only the callback
    if(typeof error_callback !== "function") {
      var error_callback = function(e) { return; };
    }

    this.endpoint.getCapabilities(inventories[0], {
      success : function(data) {
        _this.inventories[inventories[0]] = new _this.TextInventory(data, _this.namespace, inventories[0]);
        if(inventories.length === 1) {
          if(callback !== null) { callback(); }
        } else {
          inventories.shift();
          _this.load(callback, error_callback, inventories);
        }
      },
      error   : error_callback,
      type    : "text/xml"
    });

    return this;
  }

  /**
   * CTS Repository object
   *
   *  @constructor
   *  
   *  @param  {string}  endpoint  Endpoint of the repository
   *  @param  {integer} version   Version used by CTS API
   *  @param  {string}  namespace Namespace for xml nodes
   *
   *  @property  {integer}                version      Version used by CTS API
   *  @property  {namespace}              namespace    Namespace used for XML parsing
   *  @property  {dict}                   inventory    Dictionaries of inventory's label
   *  @property  {dict}                   inventories  Dictionaries of inventory object
   *  @property  {CTS.endpoint.Endpoint}  endpoint     Endpoint instance where the repository should make request
   * 
   */
  CTS.repository.repository = function (endpoint, version, namespace) {
      // We check the validity of the CTS version
      if(typeof version === "undefined" || (version !== 3 && version !== 5)) {
        version = 3;
      }
      if(typeof namespace === "undefined") {
        if(version === 3) {
          this.namespace = "http://chs.harvard.edu/xmlns/cts3/ti";
        } else {
          this.namespace = "http://chs.harvard.edu/xmlns/cts";
        }
      } else {
        this.namespace = namespace;
      }

      this.version = version;
      this.endpoint = CTS.utils.checkEndpoint(endpoint);
      this.inventories = {}; // Dictionaries of inventory object
      this.inventory = {}; // Dictionaries of inventory's label
      this.setEndpoint = _setEndpoint;
      this.addInventory = _addInventory;
      this.setInventory = _setInventory;
      this.delInventory = _delInventory;
      this.load = _load;

      this.TextInventory = CTS.repository.Prototypes["cts"+this.version].TextInventory;
  }

}));
/**
 * CTS.lang
 *
 * @module   CTS.lang
 * 
 * @requires CTS.utils
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
  "use strict";

  /**
   * Get the given work into a given language
   *
   * @name get
   * @memberOf CTS.lang
   * @function
   * 
   * @param   {string}   word  Word identifier to get
   * @param   {?string}  lang  Lang code (Default is English)
   * @returns {string}         The pretty words to print
   * 
   * @example  Using dictionary example given for {@link CTS.lang.lexicons}
   * CTS.lang.get("cat")
   * // Returns cat
   * CTS.lang.get("cat", "fr")
   * // Returns Chat
   * CTS.lang.get("object", "fr")
   * // Return Object
   */
  var _translate = function(word, lang) {
    if(typeof lang === "undefined" || !(lang in CTS.lang.lexicons)) {
      lang = "en";
    }
    if(word in CTS.lang.lexicons[lang]) {
      return CTS.lang.lexicons[lang][word];
    }
    return CTS.lang.lexicons["en"][word];

  }

  /**
   * @namespace CTS.lang
   * @name CTS.lang
   */
  CTS.lang = {
    get : _translate,
    /**
     * Dictionary of lexicons
     *
     * @example {en : {"object" : "Object", "cat" : "Cat"}, "fr" : {"cat" : "Chat"}}
     *
     * @name lexicons
     * @memberOf CTS.lang
     * @type {Object.<string, Object<string, string>>}
     */
    lexicons : {}
  }
}));
(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['cts'], factory);
  } else {
    factory(CTS);
  }
}(function(CTS) {

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

}));
(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['cts'], factory);
  } else {
    factory(CTS);
  }
}(function(CTS) {

  /**
   * Helper to use same object type to make request to an unknown type of API using only one url
   * 
   * @param  {string}   api_endpoint  URL of the API endpoint
   * @param  {?string}  inventory     Default inventory
   *
   */
  CTS.endpoint.simpleUrl = function(api_endpoint, inventory) {
    CTS.endpoint.Endpoint.call(this);

    this.url = api_endpoint;
    this.inventory = (typeof inventory !== "undefined") ? inventory : null;

    /**
     * Small helper to create urls
     * @param {object}  params  Object representing parameters name
     */
    this.getUrl = function(params) {
      return this.url;
    }

    /**
     * Create the GetCapabilities URL
     * @param  {?string} inventory Name of the inventory
     * 
     * @returns {string}            URL of the request
     */
    this.getCapabilitiesURL = function(inventory) {
      return this.getUrl();
    }

    /**
     * Do a GetCapabilities request
     * @param {?string}    inventory         Inventory name
     * @param {?function}  options.success   Success callback
     * @param {?function}  options.error     Error callback
     */
    this.getCapabilities = function(inventory, options) {
      this.getRequest(this.url, options);
    }

    /**
     * Create the GetPassage URL
     * @param  {urn}     urn       Urn of the Text's passage
     * @param  {?string} inventory Name of the inventory
     * 
     * @returns {string}            URL of the request
     */
    this.getPassageURL = function(urn, inventory) {
      return this.getUrl();
    }

    /**
     * Do a GetPassage request
     * @param {string}     urn               Urn of the text's passage
     * @param {?string}    options.inventory Inventory name
     * @param {?function}  options.success   Success callback
     * @param {?function}  options.error     Error callback
     */
    this.getPassage = function(urn, options) {
      this.getRequest(this.url, options);
    }

    /**
     * Create the GetValidReff URL
     * @param  {string}    urn                Urn of the text's passage
     * @param  {?string}   options.level      Level of reference to retrieve
     * @param  {?string}   options.inventory  Name of the inventory
     * 
     * @returns {string}                       URL of the request
     */
    this.getValidReffURL = function(urn, options) {
      return this.getUrl();
    }

    /**
     * Do a GetValidReff request
     * 
     * @param {string}     urn               Urn of the text's passage
     * @param {?string}    options.level     Level of reference to retrieve
     * @param {?string}    options.inventory Inventory name
     * @param {?function}  options.success   Success callback
     * @param {?function}  options.error     Error callback
     */
    this.getValidReff = function(urn, options) {
      this.getRequest(this.url, options);
    }
  }
  CTS.endpoint.simpleUrl.prototype = Object.create(CTS.endpoint.Endpoint);

}));
(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['cts'], factory);
  } else {
    factory(CTS);
  }
}(function(CTS) {
  /**
   * LLT Segtok(enization) service's output into a Treebank Annotation
   *
   * @Github : https://github.com/alpheios-project/treebank-editor/blob/master/db/xslt/segtok_to_tb.xsl
   * 
   */
  CTS.xslt.stylesheets["llt.segtok_to_tb"] = function(endpoint, options) {
    CTS.xslt.XSLT.call(this, endpoint, options);
    this.options = {
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
        "default" : ""
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
        "default" : false
      } 
    }
  }
  CTS.xslt.stylesheets["llt.segtok_to_tb"].prototype = Object.create(CTS.xslt.XSLT)

}));

(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['cts'], factory);
  } else {
    factory(CTS);
  }
}(function(CTS) {
  "use strict";

  var $words = {
/*
    Repository translations
*/
    "translation" : "Translation",
    "edition" : "Edition",
    "theoretical" : "Theoretical Work",
    "select" : "Select",
/*
    Passage selector
*/
    "start_passage" : "Beginning of passage", //For passage
    "stop_passage" : "End of passage", //For passage
    "retrieve_passage" : "Retrieve passage",
    "loading" : "Loading...",
/*
    LLT.TOKENIZER translations
*/
    "llt.tokenizer" : "Tokenizer parameters",
    "llt.tokenizer.xml" : "XML Formatted input",
    "llt.tokenizer.inline" : "?",
    "llt.tokenizer.splitting" : "Split Enclytics",
    "llt.tokenizer.merging" : "Merge split words",
    "llt.tokenizer.shifting" : "Shift Enclytics",
    "llt.tokenizer.text" : "Text to tokenize",
    "llt.tokenizer.remove_node" : "Nodes to remove from XML",
    "llt.tokenizer.go_to_root" : "Name of the root node",
    "llt.tokenizer.ns" : "Namespace of the XML",
/*
    LLT.Segtok_to_tb XSLT translations
*/
    "llt.segtok_to_tb" : "Treebank Parameters",
    "llt.segtok_to_tb.e_lang" : "Language",
    "llt.segtok_to_tb.e_format" : "Treebank grammar",
    "llt.segtok_to_tb.e_docuri" : "Document URI",
    "llt.segtok_to_tb.e_agenturi" : "Agent URI",
    "llt.segtok_to_tb.e_appuri" : "Application URI",
    "llt.segtok_to_tb.e_datetime" : "Date",
    "llt.segtok_to_tb.e_collection" : "Collection",
    "llt.segtok_to_tb.e_attachtoroot" : "Attach to the root", 
  }

  CTS.lang.lexicons["en"] = $words;
}));