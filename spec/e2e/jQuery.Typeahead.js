describe('jQuery CTS Typeahead', function() {
  beforeEach(function() {
    jasmine.getFixtures().fixturesPath = 'base/spec/javascripts/fixtures';
    repo1 = jasmine.getFixtures().read('xml/repo.xml');
    repo2 = jasmine.getFixtures().read('xml/repo2.xml');
    jasmine.Ajax.install();
  });
  afterEach(function() {
    jasmine.Ajax.uninstall();
  });
  describe('Init and retrieval', function () {
    beforeEach(function() {
        input = $j("<input />", { "class" : "target", "type" : "text"});
        textarea = $j("<textarea />", { "class" : "TEItext"});
        fixture = $j("<div />");
        fixture.append(input);
        fixture.append(textarea);
        $j("body").append(fixture);
    });
    afterEach(function() {
       //fixture.remove();
    });

    it("shoud init after loading", function() {
        input.ctsTypeahead({
          "endpoint" : "base/spec/javascripts/fixtures/xml/repo.xml?",
          "version" : 3,
          "inventories" : {
            "annotsrc" : "Nice label for annotsrc"
          },
          "retrieve" : ".TEItext"
        });
        jasmine.Ajax.requests.mostRecent().respondWith({
          "status" : 200,
          "contentType" : "text/xml",
          "responseXML" : (new DOMParser()).parseFromString(repo1, "text/xml"),
          "responseText" : repo1
        });
        expect($j(".typeahead.tt-input").length).toEqual(1);
        fixture.remove();
    });

    describe("shoud load 2 repo", function() {
      beforeEach(function() {
        input.ctsTypeahead({
          "endpoint" : "base/spec/javascripts/fixtures/xml/repo.xml?",
          "version" : 3,
          "inventories" : {
            "annotsrc" : "Nice label for annotsrc",
            "pilots" : "?"
          },
          "retrieve" : ".TEItext"
        });
        jasmine.Ajax.requests.mostRecent().respondWith({
          "status" : 200,
          "contentType" : "text/xml",
          "responseXML" : (new DOMParser()).parseFromString(repo1, "text/xml"),
          "responseText" : repo1
        });
        jasmine.Ajax.requests.mostRecent().respondWith({
          "status" : 200,
          "contentType" : "text/xml",
          "responseXML" : (new DOMParser()).parseFromString(repo2, "text/xml"),
          "responseText" : repo1
        });
        instance = $j(".target").data("_cts_typeahead")
        datum = $j(".target").data("ttTypeahead")
      });
      afterEach(function() {
        console.log(datum)
        //instance = null;
      });

      it("should have data from both repository", function() {
        var keys = Object.keys(instance.repository.inventories);
        expect(keys.length).toEqual(2);
      });
    });


  });

});