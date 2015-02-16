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

	var CTS = function() {
		return {
		}
	}
	return new CTS();
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
   * Just an XmlHttpRequest polyfill for different IE versions. Simple reuse of sigma.parsers.json
   *
   *
   * @param  method                  {string}     HTTP Method
   * @param  url                     {string}     HTTP URI to call
   * @param  options.callback        {?function}  Function to call when request is done.
   * @param  options.type            {string}     Type of data wished (default: text/xml)
   * @param  options.data            {?}          Data to send
   * @param  options.error_callback  {?function}  Function to call when request gave an error.
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
        if(typeof options.error_callback !== "undefined") {
          options.error_callback(xhr.status, xhr.statusText);
        }
      }

      xhr.onreadystatechange = function() {
        if(xhr.status === 500 || xhr.status === 401 || xhr.status === 403 || xhr.status === 404 || xhr.status === 400) {
          if(typeof options.error_callback !== "undefined") {
            options.error_callback(xhr.status, xhr.statusText);
          }
        } else {
          if (xhr.readyState === 4) {
            if(typeof options.callback === "function") {
              if(options.type === "text/xml") {
                options.callback(xhr.responseXML);
              } else if (options.type === "text" || options.type === "plain/text") {
                options.callback(xhr.responseText);
              }
            }
          }
        }
      };

      if((typeof options.data !== "undefined" || options.data !== null) && options.method === "POST") {
        xhr.overrideMimeType("multipart/form-data");
        xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded;");
        xhr.send(CTS.utils.dataEncode(options.data));
      } else {
        xhr.send();
      }

    } catch(err) {
      if(typeof options.error_callback !== "undefined") {
        options.error_callback(err);
      }
    }
  }

  /**
   * Return a correct endpoint url
   *
   * @param  endpoint  {string}  The CTS API endpoint
   *
   */
  var _checkEndpoint = function(endpoint) {
    if(typeof endpoint !== "string") {
      return null;
    }
    if(endpoint.slice(-1) !== "?") {
      return endpoint + "?";
    } else {
      return endpoint;
    }
  }

  /**
   * Encode data for XHR
   *
   * @param  data  {dict}  A dictionary where keys are string
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

  CTS.utils = {
    xhr : _xhr,
    dataEncode : _dataEncode,
    checkEndpoint : _checkEndpoint,
    parseInt : _parseInt,
    validPassage : _ValidPassage,
    uriParam : _uriParam
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
    CTS.utils.xhr(_this.method, _this.endpoint, {
      callback : function(data) {
        if(typeof callback === "function") { callback(data); }
      }, 
      type : format, 
      data : _this.getValues()
    });
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
(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['cts'], factory);
  } else {
    factory(CTS);
  }
}(function(CTS) {
  CTS.xslt = {};
  CTS.xslt.stylesheets = {};

  /**
   * Transform xml into an XSLTProcessor
   *
   * @param   transformDoc  The text/xml representation of the Stylesheet
   *
   * @return  XSLTProcessor Object
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
   * @param   a_url the url of the styleshset
   *
   * @return  an XSLTProcessor with the stylesheet imported
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
        $this = this,
        $default;
    Object.keys($this.options).forEach(function(key) {
      if (typeof $this.options[key]["default"] === "function") {
        $default = $this.options[key]["default"]();
      } else {
        $default = $this.options[key]["default"];
      }
      data[key] = $this.options[key]["value"] || $default;
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
   *  @param
   *
   */
  CTS.xslt.new = function(xslt, endpoint, option) {
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
}));

(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['cts'], factory);
  } else {
    factory(CTS);
  }
}(function(CTS) {

  CTS.text = {};

  /**
   * Get the text, loading it if necessary
   *
   */
  var _getText = function() {
    return this.text;
  }

  /**
   * Set the text for the Text instance
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
   * @param  callback        {?function}    Function to call when text is retrieved
   * @param  error_callback  {?function}    Function to call when an error occured
   * @param  endpoint        {?string}      CTS API Endpoint
   *
   */
  var _retrieve = function(callback, error_callback, endpoint) {
    var _this = this,
        url;
    // If the callback is the endpoint
    if (typeof callback === "string") {
      endpoint = CTS.utils.checkEndpoint(callback);
      callback = null;
    } else if (typeof error_callback === "string") {
      endpoint = CTS.utils.checkEndpoint(error_callback);
      error_callback = null;
    } else if(typeof endpoint !== "string") {
      if(_this.endpoint === null && _this.rest !== true) {
        throw "No endpoint given";
      }
      endpoint = _this.endpoint;
    } 
    if (typeof callback !== "function") {
      callback = null;
    }

    if(_this.rest === true) {
      url = _this.urn;
    } else {
      url = endpoint + "request=GetPassage&inv=" + _this.inventory + "&urn=" + _this.urn;
    }

    try {
      CTS.utils.xhr("GET", url, {
        callback : function(data) {
          _this.xml = data;
          _this.document = (new DOMParser()).parseFromString(data, "text/xml");
          if(callback) { callback(data); }
        },
        type : "text", 
        error_callback : error_callback
      });
    } catch (e) {
      if(typeof error_callback === "function") {
        error_callback(e);
      }
    }

    //And here we should load the stuff through cts.utils.ajax
  }

  /**
   * Check if the body of the XML is not empty
   *
   * @return  {boolean} Indicator of success
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
   *  @param  elementName  {?string}  The name of the element to retrieve. Should be null to access format and still get whole document
   *  @param  format       {?string}  Type of data to retrieve. Default : xml. Available : xml, string
   *
   *  @return      {Document|string}  Asked dom
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
   * @param  urn        {string}             URN identifying the text
   * @param  endpoint   {?string|boolean}    CTS API Endpoint. If false, it means the URN is a URI (Support for CTS REST)
   * @param  inventory  {?inventory}         Inventory Identifier
   *
   */
  CTS.text.Passage = function(urn, endpoint, inventory) {
    var rest = false;
    if(endpoint === false) {
      //This means we have a uri instead of a urn
      rest = true;
    }
    if(typeof endpoint !== "string") {
      endpoint = null;
    }  
    if(typeof inventory !== "string") {
      inventory = null;
    }

    //DOM
    this.document = null;
    //Strings
    this.xml = null;
    this.text = null;
    this.rest = rest;
    this.urn = urn;
    this.inventory = inventory;
    this.endpoint = endpoint;
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
   * @param  urn        {string}             URN identifying the text
   * @param  endpoint   {?string|boolean}    CTS API Endpoint. If false, it means the URN is a URI (Support for CTS REST)
   * @param  inventory  {?inventory}         Inventory Identifier
   *
   */
  CTS.text.Text = function(urn, endpoint, inventory) {
    var rest = false;
    if(endpoint === false) {
      //This means we have a uri instead of a urn
      rest = true;
    }
    if(typeof endpoint !== "string") {
      endpoint = null;
    }  
    if(typeof inventory !== "string") {
      inventory = null;
    }

    this.rest = rest;
    this.urn = urn;
    this.inventory = inventory;
    this.endpoint = endpoint;
    //Functions
    this.reffs = {}
    this.getPassage = function(ref1, ref2) {
      if(typeof ref2 === "undefined") {
        if(ref1.split("-").length == 2) {
          ref1, ref2 = ref1.split("-");
        }
      }
      return [ref1, ref2];
    }
    this.getValidReff = function() { throw "Not Implemented Yet"; }
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
"use strict";

  CTS.repository = {}

  CTS.repository.prototypes = {}

  /**
   * Prototype for CTS Text (alias share practices between Edition and Translation)
   * @param {string} type [description]
   */
  CTS.repository.prototypes.Text = function(type) {
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
     * @param  {?string} lang Lang wished
     * @return {string}       Title of the object. Return default lang if lang not found
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
     * @param  {?string} lang Lang wished
     * @return {string}       Title of the object. Return default lang if lang not found
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
   */
  CTS.repository.prototypes.Work = function() {
    this.titles = {};
    this.urn = "";
    this.defaultLang = "";
    this.lang = "";

    this.editions = [];
    this.translations = [];
    this.texts = [];

    /**
     * Get the title of the object
     * @param  {?string} lang Lang wished
     * @return {string}       Title of the object. Return default lang if lang not found
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
     * @type {CTS}
     */
    this.toTheoretical = function() {
      var theoretical = new CTS.repository.prototypes.Text();
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
   */
  CTS.repository.prototypes.TextGroup = function() {
    this.titles = {};
    this.urn = "";
    this.defaultLang = "";
    this.works = [];

    /**
     * Get the title of the object
     * @param  {?string} lang Lang wished
     * @return {string}       Title of the object. Return default lang if lang not found
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
   * @param {string} identifier Identifier, usually an URI
   */
  CTS.repository.prototypes.TextInventory = function(identifier) {
    this.identifier = identifier;
    this.namespace = "";
    this.textgroups = [];

    /**
     * Get a N-Dimensional object corresponding to your TextInventory
     * Hierarchy as following : TextGroup > Work > Edition | Translation | Theoretical
     * 
     * @param  {string}  lang        Lang to chose for titles (keys in the dictionary)
     * @param  {boolean} theoretical Include theoretical works
     * @return {Object}              Dictionary with hierarchy such as TextGroup > Work > Edition | Translation | Theoretical
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

  //Namespace
  CTS.repository.prototypes.cts3 = {};

  /**
   * Instantiate CTS Text from CTS3 XML (CTS Text is the abstract model shared by Edition and Translation)
   * 
   * @param {NodeList} nodes DOM element to use for completion of the instance
   * @param {string}   type  Type of Text
   * @param {string}   urn   URN of the parent
   */
  CTS.repository.prototypes.cts3.Text = function (nodes, type, urn) {
    CTS.repository.prototypes.Text.call(this, type);

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
  CTS.repository.prototypes.cts3.Text.prototype = Object.create(CTS.repository.prototypes.Text.prototype)

  /**
   * Instantiate CTS Edition from CTS3 XML
   * 
   * @param {NodeList} nodes DOM element to use for completion of the instance
   * @param {string}   urn   URN of the parent
   * @param {lang}     lang  Lang of the text
   */
  CTS.repository.prototypes.cts3.Edition = function(nodes, urn, lang) {
    CTS.repository.prototypes.cts3.Text.call(this, nodes, "edition", urn);
    //Edition have the lang from their parent
    this.lang = lang;
  }
  CTS.repository.prototypes.cts3.Edition.prototype = Object.create(CTS.repository.prototypes.cts3.Text.prototype)

  /**
   * Instantiate CTS Translation from CTS3 XML
   * 
   * @param {NodeList} nodes DOM element to use for completion of the instance
   * @param {string}   urn   URN of the parent
   */
  CTS.repository.prototypes.cts3.Translation = function(nodes, urn) {
    CTS.repository.prototypes.cts3.Text.call(this, nodes, "translation", urn);
    //Translation get their lang from their body
    this.lang = nodes.getAttribute("xml:lang");
  }
  CTS.repository.prototypes.cts3.Translation.prototype = Object.create(CTS.repository.prototypes.cts3.Text.prototype)


  /**
   * Instantiate CTS Work from CTS3 XML
   * 
   * @param {NodeList} nodes DOM element to use for completion of the instance
   * @param {string}   urn   URN of the parent
   */
  CTS.repository.prototypes.cts3.Work = function(nodes, urn) {
    CTS.repository.prototypes.Work.call(this);
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
      this.editions.push(new CTS.repository.prototypes.cts3.Edition(editions[i], this.urn, this.lang));
    };

    var translations = nodes.getElementsByTagName("translation");
    for (var i = translations.length - 1; i >= 0; i--) {
      this.translations.push(new CTS.repository.prototypes.cts3.Translation(translations[i], this.urn));
    };

    this.texts = this.translations.concat(this.editions);
  }
  CTS.repository.prototypes.cts3.Work.prototype = Object.create(CTS.repository.prototypes.Work.prototype)

  /**
   * Instantiate CTS TextGroup from CTS3 XML
   * 
   * @param {NodeList} nodes DOM element to use for completion of the instance
   */
  CTS.repository.prototypes.cts3.TextGroup = function(nodes) {
    CTS.repository.prototypes.TextGroup.call(this);
    this.urn = "urn:cts:" + nodes.getAttribute("projid");

    // We get the labels
    var labels = nodes.getElementsByTagName("groupname");
    for (var i = labels.length - 1; i >= 0; i--) {
      this.defaultLang = labels[i].getAttribute("xml:lang");
      this.titles[this.defaultLang] = labels[i].textContent;
    };

    var works = nodes.getElementsByTagName("work");
    for (var i = works.length - 1; i >= 0; i--) {
      this.works.push(new CTS.repository.prototypes.cts3.Work(works[i], this.urn))
    };
  }
  CTS.repository.prototypes.cts3.TextGroup.prototype = Object.create(CTS.repository.prototypes.TextGroup.prototype)

  /**
   * Instantiate CTS TextInventory from CTS3 XML
   * 
   * @param {document} xml          Parsed XML representing the inventory
   * @param {string}   namespace    Namespace to use
   * @param {string}   identifier   Identifier, usually an URI
   */
  CTS.repository.prototypes.cts3.TextInventory = function(xml, namespace, identifier) {
    CTS.repository.prototypes.TextInventory.call(this, identifier);
    this.xml = xml;
    this.namespace = namespace;
    this.xml = this.xml.getElementsByTagNameNS(this.namespace, "TextInventory");
   
    if(this.xml.length == 1) {
      var textgroups = this.xml[0].getElementsByTagNameNS(this.namespace, "textgroup");
      for (var i = textgroups.length - 1; i >= 0; i--) {
        this.textgroups.push(new CTS.repository.prototypes.cts3.TextGroup(textgroups[i]))
      };
    }
  }
  CTS.repository.prototypes.cts3.TextInventory.prototype = Object.create(CTS.repository.prototypes.TextInventory.prototype)

  /**
   * Repository Object
   *
   * For clarity, each function is defined as private variable before
   */

  /**
   * Set the endpoint URL of the object
   *
   *  @param    {list|string}  url  A url for the repository
   *
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
   *  @param  {dict}  dict  A dictionary where keys are inventory's name and value a label
   *
   */

  var _setInventory = function(dict) {
    this.inventory = dict;
  }

  /**
   * Add an inventory to the Repository Object
   * 
   * @param {string}  name  Database name of the inventory
   * @param {?string} label Pretty name for UI (optional)
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
   * @param  {string} name Database name of the inventory
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
   * @param  {?function}       callback        Function to call when data are loaded
   * @param  {?function}       error_callback  Function to call when data are not loaded
   * @param  {?list}           inventory_name  Name of the inventory to load
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

    xhr("GET", endpoint + "request=GetCapabilities&inv=" + inventories[0], 
      {
        callback : function(data) {
          _this.inventories[inventories[0]] = new _this.TextInventory(data, _this.namespace, inventories[0]);
          if(inventories.length === 1) {
            if(callback !== null) { callback(); }
          } else {
            inventories.shift();
            _this.load(callback, error_callback, inventories);
          }
        },
        type : "text/xml", 
        error_callback : error_callback
      });

    return this;
  }

  /**
   * CTS Repository object
   * 
   * @param  {string}  endpoint  Endpoint of the repository
   * @param  {integer} version   Version used by CTS API
   * @param  {string}  namespace Namespace for xml nodes
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

      this.TextInventory = CTS.repository.prototypes["cts"+this.version].TextInventory;
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
  "use strict";

  var _translate = function(word, lang) {
    if(typeof lang === "undefined" || !(lang in CTS.lang.lexicons)) {
      lang = "en";
    }
    if(word in CTS.lang.lexicons[lang]) {
      return CTS.lang.lexicons[lang][word];
    }
    return CTS.lang.lexicons["en"][word];

  }

  CTS.lang = {
    get : _translate,
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