/*
  Mockup for not failing with PhantomJS
 */
if(navigator.appVersion.match(/PhantomJS/)) {
  XSLTProcessor = function () {
    this.importStylesheet = function (xsl) {
      this.options = {}
      this.setParameter = function(useless, key, value) {
        this.options[key] = value;
      }
      this.transformToDocument = function(xml) {
        var keys = Object.keys(this.options),
            $this = this,
            z;
        if(keys.length > 0) {
          z = "<options>";
          keys.forEach(function(key) {
            z += "<" + key + ">" + $this.options[key] + "</" + key + ">";
          });
          z += (new XMLSerializer()).serializeToString(xml);
          z += "</options>";
        } else {
          z = (typeof window.expectedXML !== "undefined") ? window.expectedXML : (new DOMParser()).parseFromString(xml, "text/xml") 
        }
        return z;
      }
    }
  }
}