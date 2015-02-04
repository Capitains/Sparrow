(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['cts'], factory);
  } else {
    factory(CTS);
  }
}(function(CTS) {

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
      CTS.utils.xhr("GET", url, function(data) {

        _this.xml = data;
        _this.document = (new DOMParser()).parseFromString(data, "text/xml");
        if(callback) { callback(data); }

      }, "text", null, error_callback);
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
   * Create a text object representing either a passage or a full text
   *
   * @param  urn       {string}             URN identifying the text
   * @param  endpoint  {?string|boolean}    CTS API Endpoint. If false, it means the URN is a URI (Support for CTS REST)
   * @param  endpoint  {?inventory}         Inventory Identifier
   *
   */
  var _Text = function(urn, endpoint, inventory) {
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
    return {
      //DOM
      document : null,
      //Strings
      xml : null,
      text : null,
      rest : rest,
      urn : urn,
      inventory : inventory,
      endpoint : endpoint,
      //Functions
      retrieve : _retrieve,
      setText : _setText,
      getText : _getText,
      getXml : _getXml,
      checkXML : _checkXML
    }
  }
  CTS.Text = _Text;
}));