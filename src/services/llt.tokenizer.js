(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['cts'], factory);
  } else {
    factory(CTS);
  }
}(function(CTS) {

  /**
   * LLT Tokenizer HTTP REST API
   *
   * @Github : https://github.com/latin-language-toolkit/llt
   * 
   */
  CTS.service.services["llt.tokenizer"] = function(endpoint, options) {
    CTS.service._service.call(this, endpoint, options);
    this.method = "POST";
    this.options = {
      "xml" : {
        "type" : "boolean",
        "html" : "checkbox",
        "default" : false
      },
      "inline" : {
        "type" : "boolean",
        "html" : "hidden",
        "default" : true
      },
      "splitting" : {
        "type" : "boolean",
        "html" : "checkbox",
        "default" : true
      },
      "merging" : {
        "type" : "boolean",
        "html" : "checkbox",
        "default" : false
      },
      "shifting" : {
        "type" : "boolean",
        "html" : "checkbox",
        "default" : false
      },
      "text" : {
        "type" : "text", // Text unlinke string is a big thing
        "html" : "textarea"
      },
      "remove_node" : {
        "type" : "list",
        "html" : "input",
        "default" : ["teiHeader","head","speaker","note","ref"]
      },
      "go_to_root" : {
        "type" : "string",
        "html" : "input",
        "default" : "TEI"
      },
      "ns" : {
        "type" : "string",
        "html" : "input",
        "default" : "http://www.tei-c.org/ns/1.0"
      },
      "semicolon_delimiter" : {
        "type" : "boolean",
        "html" : "checkbox",
        "default" : true
      }
    }
  }
  CTS.service.services["llt.tokenizer"].prototype = Object.create(CTS.service._service)

}));
