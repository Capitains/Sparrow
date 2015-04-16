/**
 * CTS.service
 *
 * @module   CTS.service
 * 
 * @requires CTS.utils
 * @requires CTS
 * 
 * @link https://github.com/Capitains/Sparrow
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