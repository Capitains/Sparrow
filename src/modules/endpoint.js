(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['cts'], factory);
  } else {
    factory(CTS);
  }
}(function(CTS) {

  CTS.endpoint = {}

  /**
   * Prototype of CTS.endpoint
   */
  CTS.endpoint.Endpoint = function() {
    /**
     * [GetCapabilitiesURL description]
     * @param {[type]}
     */
    this.getCapabilitiesURL = function(inventory) { throw "Unsupported request"; }
    this.getDescriptionURL  = function() { throw "Unsupported request"; }
    this.getPrevNextUrnURL  = function(urn)  { throw "Unsupported request"; }
    this.getValidReffURL    = function(urn, level) { throw "Unsupported request"; }
    this.getPassageURL      = function(urn) { throw "Unsupported request"; }
    this.getPassagePlusURL  = function(urn) { throw "Unsupported request"; }

    /**
     * Do a GetCapabilities request
     * @param {?string}    inventory Inventory name
     * @param {?function}  success   Success callback
     * @param {?function}  error     Error callback
     */
    this.getCapabilities = function(urn, options) { throw "Unsupported request"; }
    this.getDescription  = function() { throw "Unsupported request"; }
    this.getPrevNextUrn  = function(urn)  { throw "Unsupported request"; }

    /**
     * Do a GetValidReff request
     * 
     * @param {string}     urn               Urn of the text's passage
     * @param {?string}    options.level     Level of reference to retrieve
     * @param {?string}    options.inventory Inventory name
     * @param {?function}  options.success   Success callback
     * @param {?function}  options.error     Error callback
     */
    this.getValidReff    = function(urn, level) { throw "Unsupported request"; }

    /**
     * Do a GetPassage request
     * @param {string}     urn               Urn of the text's passage
     * @param {?string}    options.inventory Inventory name
     * @param {?function}  options.success   Success callback
     * @param {?function}  options.error     Error callback
     */
    this.getPassage      = function(urn) { throw "Unsupported request"; }
    this.getPassagePlus  = function(urn) { throw "Unsupported request"; }

    /**
     * Make an XHR Request using CTS.utils.xhr
     * @param  {string}    url              URL to call
     * @param  {Function}  options.success  Success Callback function
     * @param  {Function}  options.error    Error Callback function
     */
    this.getRequest = function(url, options) {
      CTS.utils.xhr("GET", url, {
        success : options.success,
        error   : options.error
      });
    };

    /**
     * Make an XHR POST Request using CTS.utils.xhr
     * @param  {string}    url              URL to call
     * @param  {Function}  options.success  Success Callback function
     * @param  {Function}  options.error    Error Callback function
     * @param  {Function}  options.data     Error Callback function
     */
    this.postRequest = function(url, options) {
      CTS.utils.xhr("POST", url, {
        success : options.success,
        error   : options.error,
        data    : options.data
      });
    };
  }

  /**
   * CTS API using simple xQuery rest system.
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
     * @param {object}  params  Object representing parameters name
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
     * @param  {?string} inventory Name of the inventory
     * 
     * @return {string}            URL of the request
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
     * @param {?string}    inventory Inventory name
     * @param {?function}  success   Success callback
     * @param {?function}  error     Error callback
     */
    this.getCapabilities = function(inventory, success, error) {
      if(typeof inventory === "function") {
        error = success;
        success = inventory;
        inventory = null;
      }
      this.getRequest(this.getCapabilitiesURL(inventory), {
        "success" : success,
        "error" : error
      });
    }

    /**
     * Create the GetPassage URL
     * @param  {urn}     urn       Urn of the Text's passage
     * @param  {?string} inventory Name of the inventory
     * 
     * @return {string}            URL of the request
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
      this.getRequest(this.getPassageURL(urn, options.inventory), {
        "success" : options.success,
        "error" : options.error
      });
    }

    /**
     * Create the GetValidReff URL
     * @param  {string}    urn                Urn of the text's passage
     * @param  {?string}   options.level      Level of reference to retrieve
     * @param  {?string}   options.inventory  Name of the inventory
     * 
     * @return {string}                       URL of the request
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
      this.getRequest(this.getValidReffURL(urn, options), {
        "success" : options.success,
        "error" : options.error
      });
    }
  }
  CTS.endpoint.XQ.prototype = Object.create(CTS.endpoint.Endpoint)

  CTS.endpoint.default = CTS.endpoint.XQ;
}));