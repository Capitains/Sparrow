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
   * @param  method    {string}     HTTP Method
   * @param  url       {string}     HTTP URI to call
   * @param  callback  {?function}  Function to call when request is done.
   * @param  type      {string}     Type of data wished (default: text/xml)
   * @param  async     {boolean}    Async
   *
   */
  var _xhr = function(method, url, callback, type, async) {
    var xhr;
    if(typeof type === "undefined") {
      type = "text/xml";
    }
    if(typeof async === "undefined") {
      async = true;
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
      xhr.open(method, url, async);
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if(typeof callback === "function") {
            if(type === "text/xml") {
              callback(xhr.responseXML);
            } else if (type == "text") {
              callback(xhr.responseText);
            }
          }
        }
      };
      xhr.send();
    } catch(err) {
      console.error(err);
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

  CTS.utils = {
    xhr : _xhr,
    checkEndpoint : _checkEndpoint
  }
}));