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