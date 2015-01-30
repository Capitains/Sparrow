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
  var _xhr = function(method, url, callback, type, data, async) {
    var xhr,
        _this = this;
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
      if(typeof data !== "undefined" && method === "POST") {
        xhr.overrideMimeType("multipart/form-data");
        xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded;");
        xhr.send(CTS.utils.dataEncode(data));
      } else {
        xhr.send();
      }
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

  CTS.utils = {
    xhr : _xhr,
    dataEncode : _dataEncode,
    checkEndpoint : _checkEndpoint
  }
}));