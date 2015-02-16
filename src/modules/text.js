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
   * @param  urn        {string}             URN identifying the text
   * @param  endpoint   {?string|boolean}    CTS API Endpoint. If false, it means the URN is a URI (Support for CTS REST)
   * @param  inventory  {?inventory}         Inventory Identifier
   *
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