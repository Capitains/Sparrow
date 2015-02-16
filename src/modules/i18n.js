/**
 * CTS.lang
 *
 * @module   CTS.lang
 * 
 * @requires CTS.utils
 * @requires CTS
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
  "use strict";

  /**
   * Get the given work into a given language
   *
   * @name get
   * @memberOf CTS.lang
   * @function
   * 
   * @param   {string}   word  Word identifier to get
   * @param   {?string}  lang  Lang code (Default is English)
   * @returns {string}         The pretty words to print
   * 
   * @example  Using dictionary example given for {@link CTS.lang.lexicons}
   * CTS.lang.get("cat")
   * // Returns cat
   * CTS.lang.get("cat", "fr")
   * // Returns Chat
   * CTS.lang.get("object", "fr")
   * // Return Object
   */
  var _translate = function(word, lang) {
    if(typeof lang === "undefined" || !(lang in CTS.lang.lexicons)) {
      lang = "en";
    }
    if(word in CTS.lang.lexicons[lang]) {
      return CTS.lang.lexicons[lang][word];
    }
    return CTS.lang.lexicons["en"][word];

  }

  /**
   * @namespace CTS.lang
   * @name CTS.lang
   */
  CTS.lang = {
    get : _translate,
    /**
     * Dictionary of lexicons
     *
     * @example {en : {"object" : "Object", "cat" : "Cat"}, "fr" : {"cat" : "Chat"}}
     *
     * @name lexicons
     * @memberOf CTS.lang
     * @type {Object.<string, Object<string, string>>}
     */
    lexicons : {}
  }
}));