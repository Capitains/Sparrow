var CTS = (function(CTS) {
	"use strict";

	function CTS() {
		return {}
	}
	return new CTS();
}(CTS));;var CTS = (function(CTS) {
"use strict";

/**
 * Just an XmlHttpRequest polyfill for different IE versions. Simple reuse of sigma.parsers.json
 *
 * @return {*} The XHR like object.
 */
var _xhr = function(method, url, callback, async) {
  var xhr;
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
          callback(xhr.responseXML);
        }
      }
    };
    xhr.send();
  } catch(err) {
    console.error(err);
  }
}

/**
 * Set the URL of the object
 *
 *  @param    {list|string}  A url for the repository
 *
 */
var _setUrl = function(url) {
  if(typeof url === "string") {
    this.url = [url];
  } else if (typeof url === "array") {
    this.url = url;
  }
}


/**
 * Get the repository from source url
 *
 *
 */
var _load = function(url, callback) {
  var url, 
      callback,
      xhr = this.xhr,
      _this = this;

  //Basically if we have only the callback
  if(typeof url === "function") {
    var callback = url;
    var url = this.url;
  } else if(typeof url === "undefined" && typeof callback === "undefined") {
    var url = this.url;
  }
  if(typeof url === "string") {
    var url = [url];
  }

  this.xhr("GET", url[0], function(data) {

    _this.data[url[0]] = data;
    if(url.length === 1) {
      callback();
    } else {
      url.shift();
      this.load(url, callback);
    }
  });

  return this;
}

// Creating namespace for the retriever.
function repository() {
    this.url = [];
    this.data = {};
    this.setUrl = _setUrl;
    this.load = _load;
    this.xhr = _xhr;

    return this;
}

  CTS.repository = new repository();
  return CTS;
}(CTS));