(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.CTS = factory();
  }
}(this, function() {
	"use strict";

	var CTS = function() {
		return {
		}
	}
	return new CTS();
}));;(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['cts'], factory);
  } else {
    factory(CTS);
  }
}(function(CTS) {
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
 * Set the endpoint URL of the object
 *
 *  @param    {list|string}  A url for the repository
 *
 */
var _setEndpoint = function(url) {
  if(typeof url === "string") {
    this.endpoint = [url];
  } else if (typeof url === "array") {
    this.endpoint = url;
  }
}

/**
 * Set the inventories
 *
 *  @param  {dict}  A dictionary where keys are inventory's name and value a label
 *
 */

var _setInventory = function(dict) {
  this.inventory = dict;
}

/**
 * Add an inventory
 *
 *
 */
var _addInventory = function(name, label) {
  if(typeof name === "string") {
    if(typeof label === "undefined") {
      this.inventory[name] = name;
    } else {
      this.inventory[name] = label;
    }
  } else {
    throw "Name is not a string";
  }
}

/**
 * Remove an inventory
 *
 */
var _delInventory = function(name) {
  if(typeof name === "string" && name in self.inventory) {
    delete self.inventory[name];
  } else {
    throw name + " is not in known inventories."
  }
}

/**
 * Get the repository from source url
 *
 * @param  {?function}       callback        Function to call when data are loaded
 * @param  {?list}           inventory_name  Name of the inventory to load
 *
 */
var _load = function(callback, inventories) {
  var endpoint = this.endpoint, 
      callback,
      xhr = this.xhr,
      _this = this;

  if(typeof inventories === "undefined") {
    var inventories = Object.keys(this.inventory);
  }

  //Basically if we have only the callback
  if(typeof callback === "function") {
    var callback = callback;
  } else {
    var callback = null;
  }

  this.xhr("GET", endpoint + "request=GetCapabilities&inv=" + inventories[0], function(data) {
    _this.inventories[inventories[0]] = new _this.TextInventory(data, _this.namespace, inventories[0]);
    if(inventories.length === 1) {
      if(callback !== null) { callback(); }
    } else {
      inventories.shift();
      _this.load(callback, inventories);
    }
  });

  return this;
}

var TextCTS3 = function(nodes, type, urn) {
  var object = {};
  object.type = type;
  object.descriptions = {};
  object.urn = urn + "." + nodes.getAttribute("projid").split(":")[1];

  object.citations = [].map.call(nodes.getElementsByTagName("citation"), function(e) { return e.getAttribute("label") || "Unknown"; });

    // We get the labels
  [].map.call(nodes.getElementsByTagName("description"), function(groupname) {
    object.defaultLang = groupname.getAttribute("xml:lang");
    object.descriptions[object.defaultLang] = groupname.textContent;
  });

  // We create a function to have a name
  object.getDesc = function(lang) {
    if(lang === "undefined") {
      lang = this.defaultLang;
    } else if (!(lang in this.descriptions)) {
      return this.descriptions[this.defaultLang];
    }
    return this.descriptions[lang];
  }

  return object;
}

var WorkCTS3 = function(nodes, urn) {
  var object = {};
  object.label = {};
  object.urn = urn + "." + nodes.getAttribute("projid").split(":")[1];

  // We get the labels
  [].map.call(nodes.getElementsByTagName("title"), function(groupname) {
    object.defaultLang = groupname.getAttribute("xml:lang");
    object.label[object.defaultLang] = groupname.textContent;
  });

  // We create a function to have a name
  object.getTitle = function(lang) {
    if(lang === "undefined") {
      lang = this.defaultLang;
    } else if (!(lang in this.label)) {
      return this.label[this.defaultLang];
    }
    return this.label[lang];
  }

  object._Translation = function(dom) { return TextCTS3(dom, "translation", object.urn)};
  object._Edition = function(dom) { return TextCTS3(dom, "edition", object.urn)};

  object.editions = [].map.call(nodes.getElementsByTagName("edition"), object._Edition);
  object.translations = [].map.call(nodes.getElementsByTagName("translation"), object._Translation);

  object.texts = object.translations.concat(object.editions);

  return object;
}

var TextGroupCTS3 = function(nodes) {
  var object = {};
  object.label = {};
  object.urn = nodes.getAttribute("projid");

  // We get the labels
  [].map.call(nodes.getElementsByTagName("groupname"), function(groupname) {
    object.defaultLang = groupname.getAttribute("xml:lang");
    object.label[object.defaultLang] = groupname.textContent;
  });

  // We create a function to have a name
  object.getName = function(lang) {
    if(lang === "undefined") {
      lang = this.defaultLang;
    } else if (!(lang in this.label)) {
      return this.label[this.defaultLang];
    }
    return this.label[lang];
  }

  object._Work = WorkCTS3;

  object.works = [].map.call(
    nodes.getElementsByTagName("work"),
    function(node) { return object._Work(node, object.urn); }
  );

  return object;
}

var TextInventoryCTS3 = function (xml, namespace, uri) {
  var object = {},
      ti;

  object.identifier = uri;
  object.namespace = namespace;
  ti = xml.getElementsByTagNameNS(object.namespace, "TextInventory");

  object._TextGroup = TextGroupCTS3;

  if(ti.length == 1) {
    object.textgroups = [].map.call(ti[0].getElementsByTagNameNS(object.namespace, "textgroup"), object._TextGroup);
  } else {
    object.textgroups = [];
  }

  object.getRaw = function(lang) {
    var r = {};
    object.textgroups.forEach(function(tg) {
      var tgLabel = tg.getName(lang);
      r[tgLabel] = {};
      tg.works.forEach(function(w) {
        var wLabel = w.getTitle(lang);
        r[tgLabel][wLabel] = {"editions" : {}, "translations" : {}};
        w.editions.forEach(function(e) {
          r[tgLabel][wLabel]["editions"][e.getDesc(lang)] = e;
        });
        w.translations.forEach(function(t) {
          r[tgLabel][wLabel]["translations"][t.getDesc(lang)] = t;
        });
      });

    });
    return r;
  }


  return object;
}

// Creating namespace for the retriever.
function repository(endpoint, version, namespace) {
  var object = {};
    // We check the validity of the CTS version
    if(typeof version === "undefined" || (version !== 3 && version !== 5)) {
      version = 3;
    }
    if(typeof namespace === "undefined") {
      if(version === 3) {
        object.namespace = "http://chs.harvard.edu/xmlns/cts3/ti";
      } else {
        object.namespace = "http://chs.harvard.edu/xmlns/cts";
      }
    }
    object.version = version;
    object.endpoint = endpoint;
    object.inventories = {}; // Dictionaries of inventory object
    object.inventory = {}; // Dictionaries of inventory's label
    object.setEndpoint = _setEndpoint;
    object.addInventory = _addInventory;
    object.setInventory = _setInventory;
    object.delInventory = _delInventory;
    object.load = _load;
    object.xhr = _xhr;

    if (object.version === 3) {
      object.TextInventory = TextInventoryCTS3;
    } else {
      object.TextInventory = null; // NotImplementedYet
    }
    

    return object;
}

  CTS.repository = repository;
}));;(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['cts'], factory);
  } else {
    factory(CTS);
  }
}(function(CTS) {
  "use strict";

  var _translate = function(word, lang) {
    if(typeof lang === "undefined" || !(lang in CTS.lang.lexicons)) {
      lang = "en";
    }
    if(word in CTS.lang.lexicons[lang]) {
      return CTS.lang.lexicons[lang][word];
    }
    return CTS.lang.lexicons["en"][word];

  }

  CTS.lang = {
    get : _translate,
    lexicons : {}
  }
}));