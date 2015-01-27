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
    var _this = this;

    if(_this.text === null) {
      _this.loadText(function() {
        return _this.text;
      });
    } else {
      return _this.text;
    }
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
   * @param  endpoint  {?string}    CTS API Endpoint
   *
   */
  var _loadText = function(callback, endpoint) {
    if(typeof callback === "function")
    } else if (typeof callback === "string") {

    } else {
      if(typeof endpoint !== "string") {
        if(this.endpoint === null) {
          throw "No endpoint given";
        }
        endpoint = this.endpoint;
      }
    }
    //And here we should load the stuff through cts.utils.ajax
  }

  /**
   * Create a text object representing either a passage or a full text
   *
   * @param  urn       {string}     URN identifying the text
   * @param  endpoint  {?string}    CTS API Endpoint
   *
   */
  var _Text = function(urn, endpoint) {
    if(typeof endpoint !== "string") {
      endpoint = null;
    }
    return {
      urn : urn,
      endpoint : endpoint,
      text : null,
      loadText : _loadText,
      setText : _setText,
      getText : _getText
    }
  }
  CTS.Text = _Text;
}));