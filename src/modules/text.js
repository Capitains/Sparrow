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
   * @param  callback  {?function}    CTS API Endpoint
   * @param  endpoint  {?string}    CTS API Endpoint
   *
   */
  var _retrieve = function(callback, endpoint) {
    var _this = this,
        url;
    // If the callback is the endpoint
    if (typeof callback === "string") {
      endpoint = CTS.utils.checkEndpoint(callback);
      callback = null;
    } else if(typeof endpoint !== "string") {
      if(_this.endpoint === null) {
        throw "No endpoint given";
      }
      endpoint = _this.endpoint;
    } 
    if (typeof callback !== "function") {
      callback = null;
    }

    url = endpoint + "request=GetPassage&inv=" + _this.inventory + "&urn=" + _this.urn;

    CTS.utils.xhr("GET", url, function(data) {

      var parser = new DOMParser(),
          dom = parser.parseFromString(data, "text/xml");

      _this.xml = data;
      _this.document = dom;

      if(callback) { callback(); }

    }, "text");

    //And here we should load the stuff through cts.utils.ajax
  }

  /**
   *  Gets the xml using the URN
   *
   *  @param  elementName  {?string}  The name of the element to retrieve. Should be null to access format and still get whole document
   *  @param  format       {?string}  Type of data to retrieve. Default : HTMLCollection. Available : HTMLCollection, String
   *
   *  @return      {Document|string}  Asked dom
   *
   */
  var _getXml = function(elementName, format) {
    var _this = this,
        xml;

    if(typeof elementName !== "string") {
      xml = _this.xml;
    //If we have a selector, we go around by transforming the DOM into a document
    } else {
      xml = _this.document.getElementsByTagName(elementName);
    }

    if(typeof format !== "string" || format !== "string") {
      return xml;
    } else {
      var oSerializer = new XMLSerializer();
      return [].map.call(xml, function(node) { return oSerializer.serializeToString(node); }).join("\n");
    }
  }

  /**
   * Create a text object representing either a passage or a full text
   *
   * @param  urn       {string}     URN identifying the text
   * @param  endpoint  {?string}    CTS API Endpoint
   * @param  endpoint  {?inventory} Inventory Identifier
   *
   */
  var _Text = function(urn, endpoint, inventory) {
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
      urn : urn,
      inventory : inventory,
      endpoint : endpoint,
      //Functions
      retrieve : _retrieve,
      setText : _setText,
      getText : _getText,
      getXml : _getXml
    }
  }
  CTS.Text = _Text;
}));