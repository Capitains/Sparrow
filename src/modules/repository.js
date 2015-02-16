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
   *  @namespace
   */
  CTS.repository = {}

  /**
   *  @namespace CTS.Repository.Prototypes
   *  @name CTS.repository.Prototypes
   *  @membreOf CTS.repository
   */
  CTS.repository.Prototypes = {}

  /**
   * Prototype for CTS Text (alias share practices between Edition and Translation)
   * 
   *  @constructor
   *  @memberOf  CTS.repository.Prototypes
   *  
   *  @param {string}   type  Type of Text
   *  
   *  @property  {string}                      urn                        URN of the Text
   *  @property  {string}                      type                       Type of the Text
   *  @property  {string}                      lang                       Lang of the Text
   *  @property  {Object.<string, string>}     titles                     <langCode, title> Dictionary of titles to show for the textgroup (Author name)
   *  @property  {string}                      defaultLangLabel           Default lang to use to display title
   *  @property  {Object.<string, string>}     descriptions               <langCode, title> Dictionary of titles to show for the textgroup (Author name)
   *  @property  {string}                      defaultLangDesc            Default lang to use to display title
   *  @property  {Array.<string>}              citations                  List of label for citations scheme
   */
  CTS.repository.Prototypes.Text = function(type) {
    this.descriptions = {}
    this.titles = {}
    this.urn = "";
    this.citations = [];
    this.defaultLangDesc;
    this.defaultLangLabel;
    this.type = type;
    this.lang = "";

    /**
     * Get the description
     * 
     *  @function
     *  
     *  @param  {?string} lang Lang wished
     *  @returns {string}       Title of the object. Return default lang if lang not found
     */
    this.getDesc  = function(lang) {
      if(lang === "undefined") {
        lang = this.defaultLangDesc;
      } else if (!(lang in this.descriptions)) {
        return this.descriptions[this.defaultLangDesc];
      }
      return this.descriptions[lang];
    }

    /**
     * Get the title of the object
     * 
     *  @function
     *  
     *  @param  {?string} lang Lang wished
     *  @returns {string}       Title of the object. Return default lang if lang not found
     */
    this.getTitle = function(lang) {
      if(lang === "undefined") {
        lang = this.defaultLangLabel;
      } else if (!(lang in this.titles)) {
        return this.titles[this.defaultLangLabel];
      }
      return this.titles[lang];
    }
  }

  /**
   * Prototype for CTS Work
   * 
   *  @constructor
   *  @memberOf  CTS.repository.Prototypes
   *  
   *  @property  {string}                                               urn             URN of the Work
   *  @property  {string}                                               lang            Lang of the Work
   *  @property  {Object.<string, string>}                              titles          <langCode, title> Dictionary of titles to show for the textgroup (Author name)
   *  @property  {string}                                               defaultLang     Default lang to use to display title
   *  @property  {Array.<CTS.repository.Prototypes.Work>}               texts           Texts available in the inventory
   *  @property  {Array.<CTS.repository.Prototypes.Edition>}            editions        Editions available in the inventory
   *  @property  {Array.<CTS.repository.Prototypes.Translation>}        translations    Translations available in the inventory
   */
  CTS.repository.Prototypes.Work = function() {
    this.titles = {};
    this.urn = "";
    this.defaultLang = "";
    this.lang = "";

    this.editions = [];
    this.translations = [];
    this.texts = [];

    /**
     * Get the title of the object
     * 
     *  @function
     *  
     *  @param  {?string} lang Lang wished
     *  @returns {string}       Title of the object. Return default lang if lang not found
     */
    this.getTitle = function(lang) {
      if(lang === "undefined") {
        lang = this.defaultLang;
      } else if (!(lang in this.titles)) {
        return this.titles[this.defaultLang];
      }
      return this.titles[lang];
    }

    /**
     * Convert the work into a Theoritical Text
     * 
     *  @function
     *  
     *  @returns {CTS.repository.Prototypes.Text}  Actual Work into a theoretical text
     */
    this.toTheoretical = function() {
      var theoretical = new CTS.repository.Prototypes.Text();
      theoretical.urn = this.urn;
      theoretical.defaultLangLabel = this.defaultLang;
      theoretical.titles = this.titles;
      theoretical.lang = this.lang;
      return theoretical;
    }
  }

  /**
   * Prototype for CTS TextGroup
   * 
   *  @constructor
   *  @memberOf  CTS.repository.Prototypes
   *  
   *  @property  {string}                                       urn          URN of the TextGroup
   *  @property  {Object.<string, string>}                      titles       <langCode, title> Dictionary of titles to show for the textgroup (Author name)
   *  @property  {string}                                       defaultLang  Default lang to use to display title
   *  @property  {Array.<CTS.repository.Prototypes.Work>}       works        Textgroup available in the inventory
   */
  CTS.repository.Prototypes.TextGroup = function() {
    this.titles = {};
    this.urn = "";
    this.defaultLang = "";
    this.works = [];

    /**
     * Get the title of the object
     * 
     *  @function
     *  
     *  @param  {?string} lang Lang wished
     *  @returns {string}       Title of the object. Return default lang if lang not found
     */
    this.getTitle = function(lang) {
      if(lang === "undefined") {
        lang = this.defaultLang;
      } else if (!(lang in this.titles)) {
        return this.titles[this.defaultLang];
      }
      return this.titles[lang];
    }
  }


  /**
   * TextInventory Prototype
   * 
   *  @constructor
   *  @memberOf  CTS.repository.Prototypes
   *  
   *  @param     {string}                                            identifier  Identifier, usually an URI
   *
   *  @property  {string}                                            namespace   Namespace for nodes parsing
   *  @property  {Node}                                              xml         XML node representing the TextInventory node
   *  @property  {Array.<CTS.repository.Prototypes.TextGroup>}       textgroups  Textgroup available in the inventory
   */
  CTS.repository.Prototypes.TextInventory = function(identifier) {
    this.identifier = identifier;
    this.namespace = "";
    this.textgroups = [];

    /**
     * Get a N-Dimensional object corresponding to your TextInventory
     * Hierarchy as following : TextGroup > Work > Edition | Translation | Theoretical
     * 
     *  @function
     *  
     *  @param   {string}  lang        Lang to chose for titles (keys in the dictionary)
     *  @param   {boolean} theoretical Include theoretical works
     *  @returns {Object}              Dictionary with hierarchy such as TextGroup > Work > Edition | Translation | Theoretical
     */
    this.getRaw = function(lang, theoretical) {
      if(typeof theoretical === "undefined") {
        theoretical = false;
      }
      var r = {};
      this.textgroups.forEach(function(tg) {
        var tgLabel = tg.getTitle(lang);
        r[tgLabel] = {};
        tg.works.forEach(function(w) {
          var wLabel = w.getTitle(lang);
          r[tgLabel][wLabel] = {"edition" : {}, "translation" : {}};
          w.editions.forEach(function(e) {
            r[tgLabel][wLabel]["edition"][e.getTitle(lang)] = e;
          });
          w.translations.forEach(function(t) {
            r[tgLabel][wLabel]["translation"][t.getTitle(lang)] = t;
          });
          if(theoretical === true) {
            r[tgLabel][wLabel]["theoretical"] = {};
            r[tgLabel][wLabel]["theoretical"][wLabel] = w.toTheoretical();
          }
        });

      });
      return r;
    }
  }


  /**
   * CTS 3 Implementations
   */

  /**
   *  @namespace
   *  @name CTS.repository.Prototypes.cts3
   */
  CTS.repository.Prototypes.cts3 = {};

  /**
   * Instantiate CTS Text from CTS3 XML (CTS Text is the abstract model shared by Edition and Translation)
   *
   *  @constructor
   *  @augments CTS.repository.Prototypes.Text
   *  
   *  @param {NodeList} nodes DOM element to use for completion of the instance
   *  @param {string}   type  Type of Text
   *  @param {string}   urn   URN of the parent
   *  
   *  @property  {string}                      urn                        URN of the Text
   *  @property  {string}                      type                       Type of the Text
   *  @property  {string}                      lang                       Lang of the Text
   *  @property  {Object.<string, string>}     titles                     <langCode, title> Dictionary of titles to show for the textgroup (Author name)
   *  @property  {string}                      defaultLangLabel           Default lang to use to display title
   *  @property  {Object.<string, string>}     descriptions               <langCode, title> Dictionary of titles to show for the textgroup (Author name)
   *  @property  {string}                      defaultLangDesc            Default lang to use to display title
   *  @property  {Array.<string>}              citations                  List of label for citations scheme
   */
  CTS.repository.Prototypes.cts3.Text = function (nodes, type, urn) {
    CTS.repository.Prototypes.Text.call(this, type);

    this.urn = urn + "." + nodes.getAttribute("projid").split(":")[1];

    this.citations = [].map.call(nodes.getElementsByTagName("citation"), function(e) { return e.getAttribute("label") || "Unknown"; });

    // We get the labels
    var descriptions = nodes.getElementsByTagName("description");
    for (var i = descriptions.length - 1; i >= 0; i--) {
      this.defaultLangDesc = descriptions[i].getAttribute("xml:lang");
      this.descriptions[this.defaultLangDesc] = descriptions[i].textContent;
    };

    // We get the labels
    var labels = nodes.getElementsByTagName("label");
    for (var i = labels.length - 1; i >= 0; i--) {
      this.defaultLangLabel = labels[i].getAttribute("xml:lang");
      this.titles[this.defaultLangLabel] = labels[i].textContent;
    };
  }
  CTS.repository.Prototypes.cts3.Text.prototype = Object.create(CTS.repository.Prototypes.Text.prototype)

  /**
   * Instantiate CTS Edition from CTS3 XML
   * 
   *  @constructor
   *  @augments CTS.repository.Prototypes.cts3.Text
   *  
   *  @param {NodeList} nodes DOM element to use for completion of the instance
   *  @param {string}   urn   URN of the parent
   *  @param {lang}     lang  Lang of the text
   *  
   *  @property  {string}                      urn                        URN of the Edition
   *  @property  {string}                      lang                       Lang of the Edition
   *  @property  {Object.<string, string>}     titles                     <langCode, title> Dictionary of titles to show for the textgroup (Author name)
   *  @property  {string}                      defaultLangLabel           Default lang to use to display title
   *  @property  {Object.<string, string>}     descriptions               <langCode, title> Dictionary of titles to show for the textgroup (Author name)
   *  @property  {string}                      defaultLangDesc            Default lang to use to display title
   *  @property  {Array.<string>}              citations                  List of label for citations scheme
   */
  CTS.repository.Prototypes.cts3.Edition = function(nodes, urn, lang) {
    CTS.repository.Prototypes.cts3.Text.call(this, nodes, "edition", urn);
    //Edition have the lang from their parent
    this.lang = lang;
  }
  CTS.repository.Prototypes.cts3.Edition.prototype = Object.create(CTS.repository.Prototypes.cts3.Text.prototype)

  /**
   * Instantiate CTS Translation from CTS3 XML
   * 
   *  @constructor
   *  @augments CTS.repository.Prototypes.cts3.Text
   *  
   *  @param {NodeList} nodes DOM element to use for completion of the instance
   *  @param {string}   urn   URN of the parent
   *  
   *  @property  {string}                      urn                        URN of the Translation
   *  @property  {string}                      lang                       Lang of the Translation
   *  @property  {Object.<string, string>}     titles                     <langCode, title> Dictionary of titles to show for the textgroup (Author name)
   *  @property  {string}                      defaultLangLabel           Default lang to use to display title
   *  @property  {Object.<string, string>}     descriptions               <langCode, title> Dictionary of titles to show for the textgroup (Author name)
   *  @property  {string}                      defaultLangDesc            Default lang to use to display title
   *  @property  {Array.<string>}              citations                  List of label for citations scheme
   */
  CTS.repository.Prototypes.cts3.Translation = function(nodes, urn) {
    CTS.repository.Prototypes.cts3.Text.call(this, nodes, "translation", urn);
    //Translation get their lang from their body
    this.lang = nodes.getAttribute("xml:lang");
  }
  CTS.repository.Prototypes.cts3.Translation.prototype = Object.create(CTS.repository.Prototypes.cts3.Text.prototype)


  /**
   * Instantiate CTS Work from CTS3 XML
   * 
   *  @constructor
   *  @augments CTS.repository.Prototypes.Work
   *  
   *  @param {NodeList} nodes DOM element to use for completion of the instance
   *  @param {string}   urn   URN of the parent
   *  
   *  @property  {string}                                               urn             URN of the Work
   *  @property  {string}                                               lang            Lang of the Work
   *  @property  {Object.<string, string>}                              titles          <langCode, title> Dictionary of titles to show for the textgroup (Author name)
   *  @property  {string}                                               defaultLang     Default lang to use to display title
   *  @property  {Array.<CTS.repository.Prototypes.cts3.Text>}          texts           Texts available in the inventory
   *  @property  {Array.<CTS.repository.Prototypes.cts3.Edition>}       editions        Editions available in the inventory
   *  @property  {Array.<CTS.repository.Prototypes.cts3.Translation>}   translations    Translations available in the inventory
   */
  CTS.repository.Prototypes.cts3.Work = function(nodes, urn) {
    CTS.repository.Prototypes.Work.call(this);
    this.urn = urn + "." + nodes.getAttribute("projid").split(":")[1];
    this.lang = nodes.getAttribute("xml:lang");

    // We get the labels
    var groupnames = nodes.getElementsByTagName("title");
    for (var i = groupnames.length - 1; i >= 0; i--) {
      this.defaultLang = groupnames[i].getAttribute("xml:lang");
      this.titles[this.defaultLang] = groupnames[i].textContent;
    };

    var editions = nodes.getElementsByTagName("edition");
    for (var i = editions.length - 1; i >= 0; i--) {
      this.editions.push(new CTS.repository.Prototypes.cts3.Edition(editions[i], this.urn, this.lang));
    };

    var translations = nodes.getElementsByTagName("translation");
    for (var i = translations.length - 1; i >= 0; i--) {
      this.translations.push(new CTS.repository.Prototypes.cts3.Translation(translations[i], this.urn));
    };

    this.texts = this.translations.concat(this.editions);
  }
  CTS.repository.Prototypes.cts3.Work.prototype = Object.create(CTS.repository.Prototypes.Work.prototype)

  /**
   * Instantiate CTS TextGroup from CTS3 XML
   * 
   *  @constructor
   *  @augments CTS.repository.Prototypes.cts3.TextGroup
   *  
   *  @param {NodeList} nodes DOM element to use for completion of the instance
   *
   *  @property  {string}                                       urn          URN of the TextGroup
   *  @property  {Object.<string, string>}                      titles       <langCode, title> Dictionary of titles to show for the textgroup (Author name)
   *  @property  {string}                                       defaultLang  Default lang to use to display title
   *  @property  {Array.<CTS.repository.Prototypes.cts3.Work>}  works        Textgroup available in the inventory
   */
  CTS.repository.Prototypes.cts3.TextGroup = function(nodes) {
    CTS.repository.Prototypes.TextGroup.call(this);
    this.urn = "urn:cts:" + nodes.getAttribute("projid");

    // We get the labels
    var labels = nodes.getElementsByTagName("groupname");
    for (var i = labels.length - 1; i >= 0; i--) {
      this.defaultLang = labels[i].getAttribute("xml:lang");
      this.titles[this.defaultLang] = labels[i].textContent;
    };

    var works = nodes.getElementsByTagName("work");
    for (var i = works.length - 1; i >= 0; i--) {
      this.works.push(new CTS.repository.Prototypes.cts3.Work(works[i], this.urn))
    };
  }
  CTS.repository.Prototypes.cts3.TextGroup.prototype = Object.create(CTS.repository.Prototypes.TextGroup.prototype)

  /**
   * Instantiate CTS TextInventory from CTS3 XML
   * 
   *  @constructor
   *  @augments CTS.repository.Prototypes.cts3.TextInventory
   *  
   *  @param {document} xml          Parsed XML representing the inventory
   *  @param {string}   namespace    Namespace to use
   *  @param {string}   identifier   Identifier, usually an URI
   *
   *  @property  {string}                                            namespace   Namespace for nodes parsing
   *  @property  {Node}                                              xml         XML node representing the TextInventory node
   *  @property  {Array.<CTS.repository.Prototypes.cts3.TextGroup>}  textgroups  Textgroup available in the inventory
   */
  CTS.repository.Prototypes.cts3.TextInventory = function(xml, namespace, identifier) {
    CTS.repository.Prototypes.TextInventory.call(this, identifier);
    this.xml = xml;
    this.namespace = namespace;
    this.xml = this.xml.getElementsByTagNameNS(this.namespace, "TextInventory");
   
    if(this.xml.length == 1) {
      var textgroups = this.xml[0].getElementsByTagNameNS(this.namespace, "textgroup");
      for (var i = textgroups.length - 1; i >= 0; i--) {
        this.textgroups.push(new CTS.repository.Prototypes.cts3.TextGroup(textgroups[i]))
      };
    }
  }
  CTS.repository.Prototypes.cts3.TextInventory.prototype = Object.create(CTS.repository.Prototypes.TextInventory.prototype)

  /**
   * Repository Object
   *
   * For clarity, each function is defined as private variable before
   */

  /**
   * Set the endpoint URL of the object
   * 
   *  @memberOf  CTS.repository.repository
   *  @name setEndpoint
   *  @method
   *  
   *  @param    {list|string}  url  A url for the repository
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
   *  @memberOf  CTS.repository.repository
   *  @name setInventory
   *  @method
   *  
   *  @param  {dict}  dict  A dictionary where keys are inventory's name and value a label
   */

  var _setInventory = function(dict) {
    this.inventory = dict;
  }

  /**
   * Add an inventory to the Repository Object
   * 
   *  @memberOf  CTS.repository.repository
   *  @name addInventory
   *  @method
   * 
   *  @param  {string}   name   Database name of the inventory
   *  @param  {?string}  label  Pretty name for UI (optional)
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
   *  @memberOf  CTS.repository.repository
   *  @name delInventory
   *  @method
   *  
   *  @param  {string} name Database name of the inventory
   */
  var _delInventory = function(name) {
    if(typeof name === "string" && name in self.inventory) {
      delete this.inventory[name];
    } else {
      throw name + " is not in known inventories."
    }
  }

  /**
   * Get the repository from source url
   *
   *  @memberOf  CTS.repository.repository
   *  @name load
   *  @method
   *  
   *  @param  {?function}       callback        Function to call when data are loaded
   *  @param  {?function}       error_callback  Function to call when data are not loaded
   *  @param  {?list}           inventory_name  Name of the inventory to load
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

    this.endpoint.getCapabilities(inventories[0], {
      success : function(data) {
        _this.inventories[inventories[0]] = new _this.TextInventory(data, _this.namespace, inventories[0]);
        if(inventories.length === 1) {
          if(callback !== null) { callback(); }
        } else {
          inventories.shift();
          _this.load(callback, error_callback, inventories);
        }
      },
      error   : error_callback,
      type    : "text/xml"
    });

    return this;
  }

  /**
   * CTS Repository object
   *
   *  @constructor
   *  
   *  @param  {string}  endpoint  Endpoint of the repository
   *  @param  {integer} version   Version used by CTS API
   *  @param  {string}  namespace Namespace for xml nodes
   *
   *  @property  {integer}                version      Version used by CTS API
   *  @property  {namespace}              namespace    Namespace used for XML parsing
   *  @property  {dict}                   inventory    Dictionaries of inventory's label
   *  @property  {dict}                   inventories  Dictionaries of inventory object
   *  @property  {CTS.endpoint.Endpoint}  endpoint     Endpoint instance where the repository should make request
   * 
   */
  CTS.repository.repository = function (endpoint, version, namespace) {
      // We check the validity of the CTS version
      if(typeof version === "undefined" || (version !== 3 && version !== 5)) {
        version = 3;
      }
      if(typeof namespace === "undefined") {
        if(version === 3) {
          this.namespace = "http://chs.harvard.edu/xmlns/cts3/ti";
        } else {
          this.namespace = "http://chs.harvard.edu/xmlns/cts";
        }
      } else {
        this.namespace = namespace;
      }

      this.version = version;
      this.endpoint = CTS.utils.checkEndpoint(endpoint);
      this.inventories = {}; // Dictionaries of inventory object
      this.inventory = {}; // Dictionaries of inventory's label
      this.setEndpoint = _setEndpoint;
      this.addInventory = _addInventory;
      this.setInventory = _setInventory;
      this.delInventory = _delInventory;
      this.load = _load;

      this.TextInventory = CTS.repository.Prototypes["cts"+this.version].TextInventory;
  }

}));