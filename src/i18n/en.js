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
    "translation" : "Translation",
    "edition" : "Edition",
    "select" : "Select"
  }

  CTS.lang.lexicons["en"] = $words;
}));