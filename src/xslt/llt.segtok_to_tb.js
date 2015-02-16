(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['cts'], factory);
  } else {
    factory(CTS);
  }
}(function(CTS) {
  /**
   * LLT Segtok(enization) service's output into a Treebank Annotation
   *
   * @Github : https://github.com/alpheios-project/treebank-editor/blob/master/db/xslt/segtok_to_tb.xsl
   * 
   */
  CTS.xslt.stylesheets["llt.segtok_to_tb"] = function(endpoint, options) {
    CTS.xslt.XSLT.call(this, endpoint, options);
    this.options = {
      "e_lang" : { 
        "type" : "string",
        "html" : "input",
        "default" : "lat"
      },
      "e_format" : { 
        "type" : "string",
        "html" : "input",
        "default" : "aldt"
      },
      "e_docuri" : { 
        "type" : "string",
        "html" : "input",
        "default" : ""
      },
      "e_agenturi" : { 
        "type" : "string",
        "html" : "input",
        "default" : "http://services.perseids.org/llt/segtok"
      },
      "e_appuri" : { 
        "type" : "string",
        "html" : "input",
        "default" : ""
      },
      "e_datetime" : { 
        "type" : "string",
        "html" : "hidden",
        "default" : function() { return (new Date()).toDateString(); }
      },
      "e_collection" : { 
        "type" : "string",
        "html" : "input",
        "default" : "urn:cite:perseus:lattb"
      },
      "e_attachtoroot" : { 
        "type" : "boolean",
        "html" : "checkbox",
        "default" : false
      } 
    }
  }
  CTS.xslt.stylesheets["llt.segtok_to_tb"].prototype = Object.create(CTS.xslt.XSLT)

}));
