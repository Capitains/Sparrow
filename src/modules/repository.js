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

    _this.data.push(new _this.TextInventory(data, _this.namespace, url[0]));
    if(url.length === 1) {
      callback();
    } else {
      url.shift();
      this.load(url, callback);
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
function repository(version, namespace) {
  var object = {};
    if(typeof namespace === "undefined") {
      if(version === 3) {
        object.namespace = "http://chs.harvard.edu/xmlns/cts3/ti";
      } else {
        object.namespace = "http://chs.harvard.edu/xmlns/cts";
      }
    }
    object.version = version;
    object.url = [];
    object.data = [];
    object.setUrl = _setUrl;
    object.load = _load;
    object.xhr = _xhr;
    object.apiURL = "";

    if (object.version === 3) {
      object.TextInventory = TextInventoryCTS3;
    } else {
      object.TextInventory = null; // NotImplementedYet
    }
    

    return object;
}

  CTS.repository = repository;
  return CTS;
}(CTS));