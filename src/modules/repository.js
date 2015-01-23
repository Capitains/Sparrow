var CTS = (function(CTS) {
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

    _this.data[url[0]] = new _this.Repository(data, _this.namespace);
    if(url.length === 1) {
      callback();
    } else {
      url.shift();
      this.load(url, callback);
    }
  });

  return this;
}

var TextGroupCTS3 = function(nodes) {
  var o = {};
  o.label = {};

  // We get the labels
  [].map.call(nodes.getElementsByTagName("groupname"), function(groupname) {
    o.defaultLang = groupname.getAttribute("xml:lang");
    o.label[o.defaultLang] = groupname.textContent;
  });

  // We create a function to have a name
  o.getName = function(lang) {
    if(lang === "undefined") {
      lang = this.defaultLang;
    } else if (!(lang in this.label)) {
      return this.label[this.defaultLang];
    }
    return this.label[lang];
  }
  return o;
}

var InventoryCTS3 = function (xml, namespace) {
  var o = {},
      ti;
  o.namespace = namespace;
  o.TextGroup = TextGroupCTS3;
  ti = xml.getElementsByTagNameNS(o.namespace, "TextInventory");

  if(ti.length == 1) {
    o.TextInventory = ti[0];
    o.TextGroups = [].map.call(o.TextInventory.getElementsByTagNameNS(o.namespace, "textgroup"), TextGroupCTS3);//
    //.map(TextGroupCTS3)
  } else {
    o.TextInventory = null;
    o.TextInventory = [];
  }


  return o;
}

// Creating namespace for the retriever.
function repository(version, namespace) {
    var o;
    o = {}
    if(typeof namespace === "undefined") {
      if(version === 3) {
        o.namespace = "http://chs.harvard.edu/xmlns/cts3/ti";
      } else {
        o.namespace = "http://chs.harvard.edu/xmlns/cts";
      }
    }
    o.version = version;
    o.url = [];
    o.data = {};
    o.setUrl = _setUrl;
    o.load = _load;
    o.xhr = _xhr;

    if (o.version === 3) {
      o.Repository = InventoryCTS3;
    } else {
      o.Repository = null; // NotImplementedYet
    }
    

    return o;
}

  CTS.repository = repository;
  return CTS;
}(CTS));