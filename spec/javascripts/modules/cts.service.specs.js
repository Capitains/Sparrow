describe('CTS.Service Helper', function(){
  describe('Helper making', function(){
    beforeEach(function() {

      //CTS Service mockup
      CTS.service.services.fakeService = function(endpoint, options) {
        CTS.service._service.call(this, endpoint, options);
        this.method = "POST";
        this.options = {
          "foo" : {
            "type" : "string",
            "html" : "input",
            "default" : "bar"
          }
        }
      }

      //Example mockup
      example = CTS.service.new("fakeService", "http://localhost/fakeService", {foo:"bar"});

      //Ajax Mockup
      jasmine.Ajax.install();
      successFN = jasmine.createSpy("success");
    });
    afterEach(function(){
      example = null;

      //Ajax Mockup
      jasmine.Ajax.uninstall();
    })
    it("should be possible to add stylesheets", function() {
      expect(CTS.service.new("fakeService", "http://localhost/fakeService", {foo:"bar"})).toEqual(new CTS.service.services.fakeService("http://localhost/fakeService", {foo:"bar"}));
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

    it("should send data to good endpoint", function() {
      example.setValue("foo", "barbar");
      expect(successFN).not.toHaveBeenCalled();
      example.send(successFN);
      expect(jasmine.Ajax.requests.mostRecent().url).toBe("http://localhost/fakeService");
    });

    it("should call the callback", function() {
      example.setValue("foo", "barbar");
      expect(successFN).not.toHaveBeenCalled();
      example.send(successFN);
      jasmine.Ajax.requests.mostRecent().respondWith({
        status : 200,
        contentType: 'plain/text',
        responseTest : "Hello"
      })
      expect(successFN).toHaveBeenCalled();
    });

    it("should have data sent", function() {
      example.setValue("foo", "barbar");
      expect(successFN).not.toHaveBeenCalled();
      example.send(successFN);
      expect(jasmine.Ajax.requests.mostRecent().params).toEqual("foo=barbar");
    });

  });
});