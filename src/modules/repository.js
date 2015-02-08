(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['cts'], factory);
  } else {
    factory(CTS);
  }
}(function(CTS) {
"use strict";

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
 * @param  {?function}       error_callback  Function to call when data are not loaded
 * @param  {?list}           inventory_name  Name of the inventory to load
 *
 */
var _load = function(callback, error_callback, inventories) {
  var endpoint = this.endpoint, 
      xhr = CTS.utils.xhr,
      _this = this;

  if(typeof inventories === "undefined") {
    var inventories = Object.keys(this.inventory);
  }

  //Basically if we have only the callback
  if(typeof callback !== "function") {
    var callback = null;
  }
  //Basically if we have only the callback
  if(typeof error_callback !== "function") {
    var error_callback = function(e) { return; };
  }

  xhr("GET", endpoint + "request=GetCapabilities&inv=" + inventories[0], function(data) {
    _this.inventories[inventories[0]] = new _this.TextInventory(data, _this.namespace, inventories[0]);
    if(inventories.length === 1) {
      if(callback !== null) { callback(); }
    } else {
      inventories.shift();
      _this.load(callback, error_callback, inventories);
    }
  }, "text/xml", null, error_callback);

  return this;
}

var CTStext = function(nodes, type, urn) {
  return { "type" : type}
}

var CTSwork = function(nodes, urn) {
  return {}
}

var CTStextgroup = function(nodes, urn) {
  return {}
}

var CTSinventory = function(nodes, urn) {
  return {}
}



var TextCTS3 = function(nodes, type, urn) {
  var object = {};
  object.prototype = CTStext;
  object.descriptions = {};
  object.labels = {}
  object.urn = urn + "." + nodes.getAttribute("projid").split(":")[1];

  object.citations = [].map.call(nodes.getElementsByTagName("citation"), function(e) { return e.getAttribute("label") || "Unknown"; });

    // We get the labels
  [].map.call(nodes.getElementsByTagName("description"), function(groupname) {
    object.defaultLangDesc = groupname.getAttribute("xml:lang");
    object.descriptions[object.defaultLangDesc] = groupname.textContent;
  });

    // We get the labels
  [].map.call(nodes.getElementsByTagName("label"), function(labelname) {
    object.defaultLangLabel = labelname.getAttribute("xml:lang");
    object.labels[object.defaultLangLabel] = labelname.textContent;
  });

  // We create a function to have a name
  object.getDesc  = function(lang) {
    if(lang === "undefined") {
      lang = this.defaultLangDesc;
    } else if (!(lang in this.descriptions)) {
      return this.descriptions[this.defaultLangDesc];
    }
    return this.descriptions[lang];
  }

  // We create a function to have a name
  object.getLabel = function(lang) {
    if(lang === "undefined") {
      lang = this.defaultLangLabel;
    } else if (!(lang in this.labels)) {
      return this.labels[this.defaultLangLabel];
    }
    return this.labels[lang];
  }

  return object;
}

var WorkCTS3 = function(nodes, urn) {
  var object = {};
  object.prototype = CTSwork;
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
  object.prototype = CTStextgroup;
  object.label = {};
  object.urn = "urn:cts:" + nodes.getAttribute("projid");

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
    function(node) { return object._Work(node, object.urn); }
  );

  return object;
}

var TextInventoryCTS3 = function (xml, namespace, uri) {
  var object = {},
      ti;

  object.prototype = CTSinventory;
  object.identifier = uri;
  object.namespace = namespace;
  ti = xml.getElementsByTagNameNS(object.namespace, "TextInventory");

  object._TextGroup = TextGroupCTS3;

  if(ti.length == 1) {
    object.textgroups = [].map.call(ti[0].getElementsByTagNameNS(object.namespace, "textgroup"), object._TextGroup);
  } else {
    object.textgroups = [];
  }

  object.getRaw = function(lang, theoretical) {
    if(typeof theoretical === "undefined") {
      theoretical = false;
    }
    var r = {};
    object.textgroups.forEach(function(tg) {
      var tgLabel = tg.getName(lang);
      r[tgLabel] = {};
      tg.works.forEach(function(w) {
        var wLabel = w.getTitle(lang);
        r[tgLabel][wLabel] = {"edition" : {}, "translation" : {}};
        w.editions.forEach(function(e) {
          r[tgLabel][wLabel]["edition"][e.getLabel(lang)] = e;
        });
        w.translations.forEach(function(t) {
          r[tgLabel][wLabel]["translation"][t.getLabel(lang)] = t;
        });
        if(theoretical === true) {
          r[tgLabel][wLabel]["theoretical"] = {};
          r[tgLabel][wLabel]["theoretical"][wLabel] = w;
        }
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
    object.endpoint = CTS.utils.checkEndpoint(endpoint);
    object.inventories = {}; // Dictionaries of inventory object
    object.inventory = {}; // Dictionaries of inventory's label
    object.setEndpoint = _setEndpoint;
    object.addInventory = _addInventory;
    object.setInventory = _setInventory;
    object.delInventory = _delInventory;
    object.load = _load;

    if (object.version === 3) {
      object.TextInventory = TextInventoryCTS3;
    } else {
      throw "CTS Version 5 is not implemented yet";
      object.TextInventory = null; // NotImplementedYet
    }
    

    return object;
}

  CTS.repository = repository;
  CTS.repositoryPrototypes = {
    Text : CTStext,
    Work : CTSwork,
    Textgroup : CTStextgroup,
    Inventory : CTSinventory
  }
}));