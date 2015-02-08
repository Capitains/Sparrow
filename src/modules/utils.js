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
   * @param  data      {?}          Data to send
   * @param  callback  {?function}  Function to call when request gave an error.
   *
   */
  var _xhr = function(method, url, callback, type, data, error_callback) {
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

      xhr.onerror = function() {
        if(typeof error_callback !== "undefined") {
          error_callback(xhr.status, xhr.statusText);
        }
      }

      xhr.onreadystatechange = function() {
        if(xhr.status === 500 || xhr.status === 401 || xhr.status === 403 || xhr.status === 404 || xhr.status === 400) {
          if(typeof error_callback !== "undefined") {
            error_callback(xhr.status, xhr.statusText);
          }
        } else {
          if (xhr.readyState === 4) {
            if(typeof callback === "function") {
              if(type === "text/xml") {
                callback(xhr.responseXML);
              } else if (type === "text" || type === "plain/text") {
                callback(xhr.responseText);
              }
            }
          }
        }
      };

      if((typeof data !== "undefined" || data !== null) && method === "POST") {
        xhr.overrideMimeType("multipart/form-data");
        xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded;");
        xhr.send(CTS.utils.dataEncode(data));
      } else {
        xhr.send();
      }

    } catch(err) {
      if(typeof error_callback !== "undefined") {
        error_callback(err);
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