/**

  CTS.xslt = {
    stylesheets : {
      "llt.segtok_to_tb" : _segtok_to_tb
    },
    "new" : _new
  }
*/
describe('CTS.XSLT Helper', function(){
  describe('Helper making', function(){
    beforeEach(function() {
      CTS.xslt.stylesheets.fakeXSLT = function(endpoint, options) {
        CTS.xslt.XSLT.call(this, endpoint, options);
        this.options = {
          "foo" : {
            "type" : "string",
            "html" : "input",
            "default" : "bar"
          }
        }
      }
      example = CTS.xslt.new("fakeXSLT", "../fixtures/xslt/simple.xslt", {foo:"bar"});
    });
    it("should be possible to add stylesheets", function() {
      expect(CTS.xslt.new("fakeXSLT", "endpoint", {foo:"bar"})).toEqual(new CTS.xslt.stylesheets.fakeXSLT("endpoint", {foo:"bar"}));
    });

    it("should be possible to get values", function () {
      expect(example.getValues()).toEqual({foo:"bar"})
    });

    it("should be possible to set values", function () {
      example.setValue("foo", "barbar")
      expect(example.getValues()).toEqual({foo:"barbar"})
    });

    it("should be possible to get options", function () {
      expect(example.getOptions()).toEqual({
          "foo" : {
            "type" : "string",
            "html" : "input",
            "default" : "bar"
          }
        });
    });

  });
  
  /**
   *
   *  Not available right now in Jasmine because XSLTProcessor is undefined.
   *
   *
   *

  describe('Checking transformation', function(){
    beforeEach(function() {

      foo = jasmine.getFixtures().read('xml/foo.xml');
      xslt = jasmine.getFixtures().read('xslt/simple.xslt');


      CTS.xslt.stylesheets.fakeXSLT = function(endpoint, options) {
        CTS.xslt.XSLT.call(this, endpoint, options);
        this.options = {
          "foo" : {
            "type" : "string",
            "html" : "input",
            "default" : "bar"
          }
        }
      }

      example = CTS.xslt.new("fakeXSLT", "http://xslt/simple.xslt", {foo:"bar"});
    });
    afterEach(function() {
        jasmine.Ajax.uninstall();
    });
    it("should load XSLT", function () {
      expect(example.processor).toBe(null);
      example.stylesheeting(xslt);
      expect(example.processor).not.toBe(null);
    });
  });
  */
  
});
