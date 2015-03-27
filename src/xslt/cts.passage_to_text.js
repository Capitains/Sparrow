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
  CTS.xslt.stylesheets["cts.passage_to_text"] = function(endpoint, options) {
    CTS.xslt.XSLT.call(this, endpoint, options);
    this.options = { }
  }
  CTS.xslt.stylesheets["cts.passage_to_text"].prototype = Object.create(CTS.xslt.XSLT)

}));
