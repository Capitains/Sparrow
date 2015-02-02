(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['cts'], factory);
  } else {
    factory(CTS);
  }
}(function(CTS) {
  "use strict";

  var $words = {
/*
    Repository translations
*/
    "translation" : "Translation",
    "edition" : "Edition",
    "theoretical" : "Theoretical Work",
    "select" : "Select",
/*
    Passage selector
*/
    "start_passage" : "Beginning of passage", //For passage
    "stop_passage" : "End of passage", //For passage
    "retrieve_passage" : "Retrieve passage",
    "loading" : "Loading...",
/*
    LLT.TOKENIZER translations
*/
    "llt.tokenizer" : "Tokenizer parameters",
    "llt.tokenizer.xml" : "XML Formatted input",
    "llt.tokenizer.inline" : "?",
    "llt.tokenizer.splitting" : "Split Enclytics",
    "llt.tokenizer.merging" : "Merge split words",
    "llt.tokenizer.shifting" : "Shift Enclytics",
    "llt.tokenizer.text" : "Text to tokenize",
    "llt.tokenizer.remove_node" : "Nodes to remove from XML",
    "llt.tokenizer.go_to_root" : "Name of the root node",
    "llt.tokenizer.ns" : "Namespace of the XML",
/*
    LLT.Segtok_to_tb XSLT translations
*/
    "llt.segtok_to_tb.e_lang" : "Language",
    "llt.segtok_to_tb.e_format" : "Treebank grammar",
    "llt.segtok_to_tb.e_docuri" : "Document URI",
    "llt.segtok_to_tb.e_agenturi" : "Agent URI",
    "llt.segtok_to_tb.e_appuri" : "Application URI",
    "llt.segtok_to_tb.e_datetime" : "Date",
    "llt.segtok_to_tb.e_collection" : "Collection",
    "llt.segtok_to_tb.e_attachtoroot" : "Attach to the root", 
  }

  CTS.lang.lexicons["en"] = $words;
}));