/**
 * CTS.utils
 *
 * @module   CTS.utils
 * 
 * @requires CTS
 * @requires CTS.endpoint
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
   * Just an XmlHttpRequest helper
   *
   * @function
   * @memberOf CTS.utils
   * @name xhr
   *
   * @param  {string}     method             HTTP Method
   * @param  {string}     url                HTTP URI to call
   * @param  {?function}  options.success    Function to call when request is done.
   * @param  {string}     options.type       Type of data wished (default: text/xml)
   * @param  {any}        options.data       Data to send
   * @param  {?function}  options.error      Function to call when request gave an error.
   *
   */
  var _xhr = function(method, url, options) {
    var xhr,
        _this = this;

    if(typeof options === undefined) {
      options = {}
    }
    if(typeof options.type === "undefined") {
      options.type = "text/xml";
    }
    if(typeof options.async === "undefined") {
      options.async = true;
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
      xhr.open(method, url, options.async);

      xhr.onerror = function() {
        if(typeof options.error === "function") {
          options.error(xhr.status, xhr.statusText);
        }
      }

      xhr.onreadystatechange = function() {
        if(xhr.status === 500 || xhr.status === 401 || xhr.status === 403 || xhr.status === 404 || xhr.status === 400) {
          if(typeof options.error === "function") {
            options.error(xhr.status, xhr.statusText);
          }
        } else {
          if (xhr.readyState === 4) {
            if(typeof options.success === "function") {
              if(options.type === "text/xml") {
                if(xhr.responseXML !== null && xhr.responseXML.innerHtml) {
                  try {
                    var xml = (new DOMParser()).parseFromString(xhr.responseText, "text/xml");
                  } catch (e) {
                    options.error(e)
                  }
                } else {
                  options.success(xhr.responseXML);
                }
              } else if (options.type === "text" || options.type === "plain/text" || options.type === "text/plain") {
                options.success(xhr.responseText);
              }
            }
          }
        }
      };
      if((typeof options.data !== "undefined" || options.data !== null) && method === "POST") {
        xhr.overrideMimeType("multipart/form-data");
        xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded;");
        xhr.send(CTS.utils.dataEncode(options.data));
      } else {
        xhr.send();
      }

    } catch(err) {
      if(typeof options.error === "function") {
        options.error(err);
      }
    }
  }

  /**
   * Return a correct endpoint url
   *
   * @function
   * @memberOf CTS.utils
   * @name checkEndpoint
   * 
   * @param  {string|CTS.endpoint.Endpoint}  endpoint  The CTS API endpoint
   * 
   * @returns {?CTS.endpoint.Endpoint}  An endpoint
   *
   */
  var _checkEndpoint = function(endpoint) {
    if(typeof endpoint === "string") {
      return new CTS.endpoint.default(endpoint);
    } else if( endpoint instanceof Object) {
      return endpoint;
    } else {
      return null;
    }
  }

  /**
   * Encode data for XHR
   *
   * @function
   * @memberOf CTS.utils
   * @name dataEncode
   *
   * @param  {Object.<string, any>}  data  A dictionary where keys are string
   * 
   * @returns  {string}  The url encoded parameters
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


  /**
   * Parse an urn identifier into an int for comparison
   *
   * @function
   * @memberOf CTS.utils
   * @name parseInt
   * @deprecated  Not use anymore as technically, passage don't have to be in ascending order
   *
   * @param  {string|integer|Array.<string|integer>}  str  Data to be parsed
   * 
   * @returns  {integer}  Integer representing the urn identifier
   *
   */
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

  /**
   * Check if passage identifier are valid
   *
   * @function
   * @memberOf CTS.utils
   * @name validPassage
   * @deprecated  Not use anymore as technically, passage don't have to be in ascending order
   *
   * @param  {Array.<string|integer|Array>}  $start  Start element 
   * @param  {Array.<string|integer|Array>}  $end    End element
   * 
   * @returns  {boolean}  Boolean indicating if the passage is valid
   *
   */
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


  /**
   * Get the window location parameters (GET parameters)
   *
   * @function
   * @memberOf CTS.utils
   * @name uriParam
   * 
   * @returns  {Object.<string, any>}  Boolean indicating if the passage is valid
   *
   */
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

  /**
   * @namespace CTS.utils
   * @name CTS.utils
   */
  CTS.utils = {
    xhr : _xhr,
    dataEncode : _dataEncode,
    checkEndpoint : _checkEndpoint,
    parseInt : _parseInt,
    validPassage : _ValidPassage,
    uriParam : _uriParam
  }
}));