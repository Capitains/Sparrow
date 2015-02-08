describe('CTS.I18n Helper', function(){
  describe('Getting translation', function(){

    beforeEach(function() {
      CTS.lang.lexicons.fr = { "foo" : "bar" };
      CTS.lang.lexicons.en = { "foo" : "pub" };
    })

    it("should translate something ", function () {
      var translate = CTS.lang.get("foo", "fr");
      expect(translate).toEqual("bar");
    });

    it("should default to English when language is not set", function () {
      var translate = CTS.lang.get("foo");
      expect(translate).toEqual("pub");
    });

    it("should default to English when language does not exist", function () {
      var translate = CTS.lang.get("foo", "de");
      expect(translate).toEqual("pub");
    });

  });
});
