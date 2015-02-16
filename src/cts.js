/**
 * CTS
 *
 * @link https://github.com/PerseusDL/Capitains-Sparrow
 * @author PonteIneptique (Thibault Clérice)
 * @version 1.0.0
 * @license https://github.com/PerseusDL/Capitains-Sparrow/blob/master/LICENSE
 *
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.CTS = factory();
  }
}(this, function() {
	"use strict";

  /**
   * @namespace
   */
	var CTS = function() {
		return {
		}
	}
	return new CTS();
}));