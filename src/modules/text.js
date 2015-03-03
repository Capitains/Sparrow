/**
 * CTS.text
 *
 * @module   CTS.text
 * 
 * @requires CTS
 * @requires CTS.utils
 * @requires CTS.endpoint
 * 
 * @link https://github.com/PerseusDL/Capitains-Sparrow
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
   * Text related functions
   * @namespace CTS.text
   * @name CTS.text
   */
  CTS.text = {};

  /**
   * Get the text, removing nodes if necessary. if the instance has the text.property set, returns it.
   *
   *  @function
   *  @memberOf CTS.text.Passage
   *  @name getText
   *
   *  @param    {Array.<string>}   removedNodes   List of nodes' tagname to remove
   *
   *  @returns  {string}  Instance text
   */
  var _getText = function(removedNodes) {
    var xml = this.document,
        text;
    if(this.text !== null) { return this.text; }
    if(typeof removedNodes === "undefined") {
      removedNodes = ["note", "bibl", "head"];
    }

    removedNodes.forEach(function(nodeName) { 
      var elements = xml.getElementsByTagName(nodeName);
      while (elements[0]) elements[0].parentNode.removeChild(elements[0]);
    });

    text = (xml.getElementsByTagName("text")[0] || xml.getElementsByTagName("body")[0]).textContent;
    return text;
  }

  /**
   * Set the text for the Text instance
   *
   * @function
   * @memberOf CTS.text.Passage
   * @name setText
   *
   * @param  text  {string}    Text embodied by object.urn
   *
   */
  var _setText = function(text) {
    this.text = text;
  }

  /**
   * Load the text from the endpoint
   *
   * @function
   * @memberOf CTS.text.Passage
   * @name retrieve
   *
   * @param  options.success   {?function}    Function to call when text is retrieved
   * @param  options.error     {?function}    Function to call when an error occured
   * @param  options.endpoint  {?string}      CTS API Endpoint
   *
   */
  var _retrieve = function(options) {
    var _this = this,
        url;

    if(typeof options === "undefined") { options = {}; }
    if(typeof options.endpoint === "undefined") {
      endpoint = this.endpoint;
    } else {
      endpoint = CTS.utils.checkEndpoint(options.endpoint);
    }

    endpoint.getPassage(this.urn, {
      inventory : this.inventory,
      success : function(data) {
        _this.xml = data;
        _this.document = (new DOMParser()).parseFromString(data, "text/xml");
        if(typeof options.success === "function") { options.success(data); }
      
      },
      type : "plain/text",
      error : options.error
    });

    //And here we should load the stuff through cts.utils.ajax
  }

  /**
   * Check if the body of the XML is not empty
   *
   * @function
   * @memberOf CTS.text.Passage
   * @name getXML
   *
   * @returns  {boolean}  Boolean indecating if we got xml or not.
   *
   */
  var _checkXML = function() {
    var _this = this,
        xml;

    try {
      xml = _this.getXml("body");
      if(xml[0].childNodes.length === 0) {
        return false;
      } else {
        return true;
      }
    } catch (e) {
      return false;
    }

  }

  /**
   *  Gets the xml using the URN
   *
   * @function
   * @memberOf CTS.text.Passage
   * @name getXml
   *
   *  @param  elementName  {?string}  The name of the element to retrieve. Should be null to access format and still get whole document
   *  @param  format       {?string}  Type of data to retrieve. Default : xml. Available : xml, string
   *
   *  @returns      {Document|string}  Asked dom
   *
   */
  var _getXml = function(elementName, format) {
    var _this = this,
        reconstruct = false,
        xml;

    if(typeof format !== "string" || (format !== "xml" && format !== "string")) {
      format = "xml";
    }

    //If elementName is not a string
    if(typeof elementName !== "string") {
      xml = _this.document;
    //If we have a selector, we go around by transforming the DOM into a document
    } else {
      xml = _this.document.getElementsByTagName(elementName);
      reconstruct = true;
    }

    if(format === "string") {
      var oSerializer = new XMLSerializer();
      if(reconstruct === true) {
        return [].map.call(xml, function(node) { return oSerializer.serializeToString(node); }).join("\n");
      } else {
        return oSerializer.serializeToString(xml); 
      }
    } else {
      return xml;
    }
  }

  /**
   * Create a Passage object representing part of a full text
   *
   * @constructor
   * @memberOf CTS.text
   *
   * @param  urn        {string}                           URN identifying the text
   * @param  endpoint   {?string|CTS.endpoint.Endpoint}    CTS API Endpoint. 
   * @param  inventory  {?inventory}                       Inventory Identifier
   *
   * @property  {Document}               document   The XML document representing the passage
   * @property  {string}                 xml        String representation of the XML representing the passage
   * @property  {string}                 text       Text of the passage
   * @property  {string}                 urn        URN identifying the passage
   * @property  {?inventory}             inventory  Inventory containing the text
   * @property  {CTS.endpoint.Endpoint}  endpoint  Endpoint to get the text
   *
   */
  CTS.text.Passage = function(urn, endpoint, inventory) {
    if(typeof inventory !== "string") {
      inventory = null;
    }

    //DOM
    this.document = null;
    //Strings
    this.xml = null;
    this.text = null;
    this.urn = urn;
    this.inventory = inventory;
    this.endpoint = CTS.utils.checkEndpoint(endpoint);
    //Functions
    this.retrieve = _retrieve;
    this.setText = _setText;
    this.getText = _getText;
    this.getXml = _getXml;
    this.checkXML = _checkXML;
  }

  /**
   * Create a text object representing either a passage or a full text
   *
   * @constructor
   * @memberOf CTS.text
   * 
   * @param  urn        {string}                           URN identifying the text
   * @param  endpoint   {?string|CTS.endpoint.Endpoint}    CTS API Endpoint. 
   * @param  inventory  {?inventory}                       Inventory Identifier
   *
   * @property  {string}                                           urn               URN identifying the passage
   * @property  {Object.<string, CTS.text.Passage}                 reffs             Passage and reffs
   * @property  {Object.<string, Object.<string, string>>}         validReffs        List of levels of mapping
   * @property  {Object.<string, string>}                          validReffs[0]     Pair of Text (Identifier of the passage, urn)
   * @property  {?inventory}                                       inventory         Inventory containing the text
   * @property  {CTS.endpoint.Endpoint}                            endpoint          Endpoint to get the text
   */
  CTS.text.Text = function(urn, endpoint, inventory) {
    if(typeof inventory !== "string") {
      inventory = null;
    }

    this.urn = urn.split(":").slice(0,4).join(":");
    this.inventory = inventory;
    this.endpoint = CTS.utils.checkEndpoint(endpoint);
    //Functions
    this.reffs = {}
    this.validReffs = {}
    this.passages = {}

    /**
     * Create a Passage urn given two lists of identifiers for start and end of the passage
     * @param  {Array.Any} start  Array representation of the passage's start
     * @param  {Array.Any} end    Array representation of the passage's end
     * @returns {string}           CTS Urn of the passage
     */
    this.makePassageUrn = function(start, end) {
      if(typeof end === "undefined") { var end = []; }
      var s = []
      var e = []
      for (var i = 0; i < start.length; i++) {
        if(typeof start[i] === "undefined") {
          break;
        } else {
          if(start[i].length > 0 || start[i] > 0) {
            s.push(start[i]);
          }
        }
      };

      for (var i = 0; i < end.length; i++) {
        if(i >= s.length) {
          break;
        }
        if(typeof end[i] === "undefined") {
          break;
        } else {
          if(end[i].length > 0 ||end[i] > 0) {
            e.push(end[i]);
          }
        }
      };

      var ref = this.urn;
      if(s.length > 0) {
        ref = ref + ":" + s.join(".");

        if(e.length == s.length) {
          ref = ref + "-" + e.join(".");
        }
      }
      return ref;
    }

    /**
     * Get the passage from a test
     * @param  {Array.Any} start  Array representation of the passage's start
     * @param  {Array.Any} end    Array representation of the passage's end
     * @returns {CTS.text.Passage}      Passage object 
     */
    this.getPassage = function(ref1, ref2) {
      var ref = this.makePassageUrn(ref1, ref2);
      if(this.passages[ref]) {
        return this.passages[ref];
      }
      this.passages[ref] = new CTS.text.Passage(ref, this.endpoint, this.inventory);

      return this.passages[ref];
    }

    /**
     * Make a request for the first passage on the API
     * @param  {Object.<String, function>} options          Options object
     * @param  {function}                  options.success  Success callback (Pass the urn and the Passage as arguments)
     * @param  {function}                  options.error    Error Callback
     */ 
    this.getFirstPassagePlus = function(options) {
      var self = this;
      options.endpoint = this.endpoint;
      endpoint = CTS.utils.checkEndpoint(options.endpoint);
      endpoint.getFirstPassagePlus(this.urn, {
        inventory : this.inventory,
        success : function(data) {
          var xml = (new DOMParser()).parseFromString(data, "text/xml");
          var ref = xml.getElementsByTagName("current")[0].textContent;
          self.passages[ref] = new CTS.text.Passage(ref, self.endpoint, self.inventory)
          self.passages[ref].document = xml;

          if(typeof options.success === "function") { options.success(ref, self.passages[ref]); }
        
        },
        type : "plain/text",
        error : options.error
      });
    }
    /**
     * Make a getValidReff request
     * @param  {Object.<String, function>} options          Options object
     * @param  {function}                  options.level    Level depth
     * @param  {function}                  options.success  Success callback (Pass the urn and the Passage as arguments)
     * @param  {function}                  options.error    Error Callback
     */ 
    this.getValidReff = function(options) {
      var self = this;
      if(typeof options.level === "undefined") { options.level = 1; }

      //Need to copy the callback system
      if(typeof self.validReffs[options.level] !== "undefined") {
        if(typeof options.success === "function") {
          options.success(self.validReffs[options.level]);
        }
        return;
      } else {
        self.endpoint.getValidReff(self.urn, {
          inventory : self.inventory,
          success : function(data) {
            var urns = data.getElementsByTagName("reff")[0].getElementsByTagName("urn");
            urns = [].map.call(urns, function(node) { return node.childNodes[0].nodeValue; });
            var object = {}
            urns.forEach(function(val) {
              var s = val.split(":");
              object[s[s.length - 1]] = val;
            });
            self.validReffs[options.level] = object;
            if(typeof options.success === "function") {
              options.success(object);
            }
          },
          type : "text/xml",
          error : options.error
        })
      }
    }
  }  
}));