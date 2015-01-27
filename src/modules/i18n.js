(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['cts'], factory);
  } else {
    factory(CTS);
  }
}(function(CTS) {
  "use strict";

  var _translate = function(word, lang) {
    if(typeof lang === "undefined" || !(lang in CTS.lang.lexicons)) {
      lang = "en";
    }
    if(word in CTS.lang.lexicons[lang]) {
      return CTS.lang.lexicons[lang][word];
    }
    return CTS.lang.lexicons["en"][word];

  }

  CTS.lang = {
    get : _translate,
    lexicons : {}
  }
}));