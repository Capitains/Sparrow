describe('Endpoint Abstraction', function(){
  describe('xQuery abstraction', function(){

    beforeEach(function() {
      jasmine.Ajax.install();
      API = new CTS.endpoint.XQ("http://localhost?");
      response = function(code) {
        if(typeof code === "undefined") { code = 200; }
        jasmine.Ajax.requests.mostRecent().respondWith({
          status : code,
          contentType: 'plain/text',
          responseTest : "Hello"
        })
      }
    });

    afterEach(function() {
      delete API;
      delete response;
      jasmine.Ajax.uninstall();
    })

    it("should have an url", function() {
      expect(API.url).toEqual("http://localhost?");
      //Correct it if needed
      API = new CTS.endpoint.XQ("http://localhost")
      expect(API.url).toEqual("http://localhost?");
    });

    it("should make url correctly", function() {
      expect(API.getUrl({request : "GetCapabilities", inv : "annotsrc" })).toEqual("http://localhost?request=GetCapabilities&inv=annotsrc");
    });

    it("should handle getCapabilitiesURL making", function() {
      //With given
      expect(API.getCapabilitiesURL("annotsrc")).toEqual("http://localhost?request=GetCapabilities&inv=annotsrc");

      //With none
      expect(API.getCapabilitiesURL()).toEqual("http://localhost?request=GetCapabilities");

      //With default
      API = new CTS.endpoint.XQ("http://localhost?", "annotsrc")
      expect(API.getCapabilitiesURL()).toEqual("http://localhost?request=GetCapabilities&inv=annotsrc");
    });

    it("should do GetCapabilities", function() {
      successFN = jasmine.createSpy("success");
      API.getCapabilities("annotsrc", {success : successFN});
      expect(jasmine.Ajax.requests.mostRecent().url).toEqual("http://localhost?request=GetCapabilities&inv=annotsrc")
      response();
      expect(successFN).toHaveBeenCalled();

      //Without inventory
      successFN = jasmine.createSpy("success");
      API.getCapabilities({success : successFN});
      expect(jasmine.Ajax.requests.mostRecent().url).toEqual("http://localhost?request=GetCapabilities")
      response();
      expect(successFN).toHaveBeenCalled();
    });

    it("should handle getPassageURL making", function() {
      //With given
      expect(API.getPassageURL("urn:la", "annotsrc")).toEqual("http://localhost?request=GetPassage&urn=urn:la&inv=annotsrc");

      //With none
      expect(API.getPassageURL("urn:la")).toEqual("http://localhost?request=GetPassage&urn=urn:la");

      //With default
      API = new CTS.endpoint.XQ("http://localhost?", "annotsrc")
      expect(API.getPassageURL("urn:la")).toEqual("http://localhost?request=GetPassage&urn=urn:la&inv=annotsrc");
    });

    it("should do GetCapabilities", function() {
      successFN = jasmine.createSpy("success");
      errorFN = jasmine.createSpy("error");
      API.getPassage("urn:la", {
        inventory :"annotsrc",
        success : successFN
      });
      expect(jasmine.Ajax.requests.mostRecent().url).toEqual("http://localhost?request=GetPassage&urn=urn:la&inv=annotsrc")
      response(200);

      expect(successFN).toHaveBeenCalled();

      successFN = jasmine.createSpy("success");
      API.getPassage("urn:la", {
        inventory : "annotsrc",
        success   : successFN,
        error     : errorFN
      });
      response(400);
      expect(errorFN).toHaveBeenCalled();
    });

    it("should handle getValidReff url making", function(){
      //With inventory and level given
      expect(API.getValidReffURL("urn:la", 
        {
          inventory : "annotsrc", 
          level : 1
        })
      ).toEqual("http://localhost?request=GetValidReff&urn=urn:la&level=1&inv=annotsrc");
      //With inventory given
      expect(API.getValidReffURL("urn:la", {inventory : "annotsrc"})).toEqual("http://localhost?request=GetValidReff&urn=urn:la&inv=annotsrc");

      //With inventory none
      expect(API.getValidReffURL("urn:la")).toEqual("http://localhost?request=GetValidReff&urn=urn:la");

      //With default
      API = new CTS.endpoint.XQ("http://localhost?", "annotsrc")
      expect(API.getValidReffURL("urn:la")).toEqual("http://localhost?request=GetValidReff&urn=urn:la&inv=annotsrc");
    });

    it("should do GetValidReff", function() {
      successFN = jasmine.createSpy("success");
      errorFN = jasmine.createSpy("error");

      API.getValidReff("urn:la", {
          inventory : "annotsrc", 
          level : 1,
          success : successFN
      });
      expect(jasmine.Ajax.requests.mostRecent().url).toEqual("http://localhost?request=GetValidReff&urn=urn:la&level=1&inv=annotsrc");

      response(200);
      expect(successFN).toHaveBeenCalled();

      successFN = jasmine.createSpy("success");

      API.getValidReff("urn:la", {
        inventory : "annotsrc",
        success   : successFN,
        error     : errorFN
      });

      response(400);
      expect(errorFN).toHaveBeenCalled();
    });

  });
  
});
