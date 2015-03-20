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
   * @Github : https://github.com/alpheios-project/treebank-editor/blob/master/db/xslt/segtok_to_align.xsl
   * 
   */
  CTS.xslt.stylesheets["llt.segtok_to_align"] = function(endpoint, options) {
    CTS.xslt.XSLT.call(this, endpoint, options);
    this.options = {
      "e_lang" : { 
        "type" : "string",
        "html" : "hidden",
        "default" : "lat"
      },
      "e_dir" : { 
        "type" : "string",
        "html" : "hidden",
        "default" : "ltr"
      },
      "e_lnum" : { 
        "type" : "string",
        "html" : "hidden",
        "default" : "l1"
      },
      "e_docuri" : { 
        "type" : "string",
        "html" : "hidden",
        "default" : ""
      },
      "e_agenturi" : { 
        "type" : "string",
        "html" : "hidden",
        "default" : "http://services.perseids.org/llt/segtok"
      },
      "e_appuri" : { 
        "type" : "string",
        "html" : "hidden",
        "default" : ""
      },
      "e_datetime" : { 
        "type" : "string",
        "html" : "hidden",
        "default" : function() { return (new Date()).toDateString(); }
      },
      "e_includepunc" : { 
        "type" : "boolean",
        "html" : "checkbox",
        "default" : true
      },
      "e_mergesentences" : { 
        "type" : "boolean",
        "html" : "checkbox",
        "default" : true
      },
      "e_collection" : {
        "type" : "string",
        "html" : "hidden",
        "default" : "urn:cite:perseus:align"
      }
    }
  }
  CTS.xslt.stylesheets["llt.segtok_to_align"].prototype = Object.create(CTS.xslt.XSLT)

}));
