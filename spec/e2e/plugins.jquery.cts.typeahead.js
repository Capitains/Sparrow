describe('jQuery CTS Typeahead', function() {
  beforeEach(function() {
    jasmine.getFixtures().fixturesPath = 'base/spec/javascripts/fixtures';
    repo1 = jasmine.getFixtures().read('xml/repo.xml');
    repo2 = jasmine.getFixtures().read('xml/repo2.xml');
    text = jasmine.getFixtures().read('xml/text.xml');
    text_parsed = (new XMLSerializer()).serializeToString((new DOMParser()).parseFromString(text, "text/xml"));
  });

  afterEach(function() {
    $j("body > div").remove();
  });
  
  describe('Init', function () {

    /**
     * 
     *  Fixtures
     *  
     */

    beforeEach(function() {
      jasmine.Ajax.install();
      input = $j("<input />", { "class" : "target", "type" : "text"});
      textarea = $j("<textarea />", { "class" : "TEItext"});
      fixture = $j("<div />");
      fixture.append(input);
      fixture.append(textarea);
      $j("body").append(fixture);
    });

    afterEach(function() {
      fixture.remove();
      jasmine.Ajax.uninstall();
    });

    /**
     * 
     *  Tests
     *  
     */

    it("should init after loading", function() {
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
    });




  });

  describe("X>1 Repositories", function() {

    /**
     * 
     *  Fixtures
     *  
     */

    beforeEach(function() {
      jasmine.Ajax.install();
      //Creating DOM ELEMENTS
      input = $j("<input />", { "class" : "target", "type" : "text"});
      textarea = $j("<textarea />", { "class" : "TEItext"});
      fixture = $j("<div />", {"class" : "fixture"});
      fixture.append(input);
      fixture.append(textarea);
      $j("body").append(fixture);

      //Applying Plugin
      input.ctsTypeahead({
        "endpoint" : "base/spec/javascripts/fixtures/xml/repo.xml?",
        "version" : 3,
        "inventories" : {
          "annotsrc" : "Nice label for annotsrc",
          "pilots" : "?"
        },
        "retrieve" : ".TEItext"
      });

      //Getting AJAX
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
        "responseText" : repo2
      });

      //Creating variables shortcut
      instance = $j(".target").data("_cts_typeahead");
      th = instance.typeahead.data("ttTypeahead");

    });
    afterEach(function() {
      jasmine.Ajax.uninstall();
      fixture.remove();
      instance = null;
      th = null;
    });

    /**
     * 
     *  Tests
     *  
     */

    it("should have data from both repository", function() {
      var keys = Object.keys(instance.repository.inventories);
      expect(keys.length).toEqual(2);
    });
    
    it("should show data from 1st repository", function() {
      th.input.$input.val("Aeneid");
      th.input.setQuery("Aeneid");
      th.input.trigger("upKeyed");
      expect($j(".tt-dataset-texts > .tt-suggestions > .tt-suggestion").length).toEqual(1);
    });

    it("should show data from 2nd repository", function(){
      th.input.$input.val("carta");
      th.input.setQuery("carta");
      th.input.trigger("upKeyed");
      expect($j(".tt-dataset-texts > .tt-suggestions > .tt-suggestion").length).toEqual(1);
    });
  });

  describe("Selection process", function() {
    /**
     * 
     *  Fixtures
     *  
     */

    beforeEach(function() {
      jasmine.Ajax.install();
      //Creating DOM ELEMENTS
      input = $j("<input />", { "class" : "target", "type" : "text"});
      textarea = $j("<textarea />", { "class" : "TEItext"});
      fixture = $j("<div />", {"class" : "fixture"});
      fixture.append(input);
      fixture.append(textarea);
      $j("body").append(fixture);

      //Applying Plugin
      input.ctsTypeahead({
        "endpoint" : "http://fakeRepo.com/CTS.xq?",
        "version" : 3,
        "inventories" : {
          "annotsrc" : "Nice label for annotsrc",
          "pilots" : "?"
        },
        "retrieve" : ".TEItext"
      });

      //Getting AJAX
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
        "responseText" : repo2
      });

      //Creating variables shortcut
      instance = $j(".target").data("_cts_typeahead");
      th = instance.typeahead.data("ttTypeahead");

    });
    afterEach(function() {
      jasmine.Ajax.uninstall();
      fixture.remove();
      instance = null;
      th = null;
    });

    /**
     * 
     *  Tests
     *  
     */
    
    it("should set input urn on click", function() {
      //Asking for Carta in typeahead
      th.input.$input.val("carta");
      th.input.setQuery("carta");
      th.input.trigger("upKeyed");
      //Clicking on one suggestion
      $j(".tt-dataset-texts > .tt-suggestions > .tt-suggestion").trigger("click");
      //Testing
      expect(input.data("urn")).toEqual("urn:cts:pdlmc:cdf.flc.perseus-lat1");
    });
    
    it("should set input inventory on click", function() {
      //Asking for Carta in typeahead
      th.input.$input.val("carta");
      th.input.setQuery("carta");
      th.input.trigger("upKeyed");
      //Clicking on one suggestion
      $j(".tt-dataset-texts > .tt-suggestions > .tt-suggestion").trigger("click");
      //Testing
      expect(input.data("inventory")).toEqual("pilots");
    });

    it("should trigger cts-passage:urn-updated", function() {
      var spy = jasmine.createSpy("success");
      input.on("cts-passage:urn-updated", spy);
      //Asking for Carta in typeahead
      th.input.$input.val("carta");
      th.input.setQuery("carta");
      th.input.trigger("upKeyed");
      //Clicking on one suggestion
      $j(".tt-dataset-texts > .tt-suggestions > .tt-suggestion").trigger("click");
      //Testing
      expect(spy).toHaveBeenCalled()
      var spy = null;
    });

    it("should trigger cts-passage:urn-work", function() {
      var spy = jasmine.createSpy("success");
      input.on("cts-passage:urn-work", spy);
      //Asking for Carta in typeahead
      th.input.$input.val("carta");
      th.input.setQuery("carta");
      th.input.trigger("upKeyed");
      //Clicking on one suggestion
      $j(".tt-dataset-texts > .tt-suggestions > .tt-suggestion").trigger("click");
      //Testing
      expect(spy).toHaveBeenCalled()
      var spy = null;
    });

    it("should have shown passage selection", function() {
      //Asking for Carta in typeahead
      th.input.$input.val("carta");
      th.input.setQuery("carta");
      th.input.trigger("upKeyed");
      //Clicking on one suggestion
      $j(".tt-dataset-texts > .tt-suggestions > .tt-suggestion").trigger("click");
      //Testing
      expect($j(".cts-selector-passage-container").length).toEqual(2);
      expect($j(".cts-selector-passage-number").length).toEqual(2);
    });

    it("should have sent a retrieving trigger on target", function() {
      //Spy
      var spy = jasmine.createSpy("success");
      textarea.on("cts-passage:retrieving", spy)
      //Asking for Carta in typeahead
      th.input.$input.val("carta");
      th.input.setQuery("carta");
      th.input.trigger("upKeyed");
      //Clicking on one suggestion
      $j(".tt-dataset-texts > .tt-suggestions > .tt-suggestion").trigger("click");
      //Giving some false passage identifier
      $j(".cts-selector-passage-number").first().val(1);
      $j(".cts-selector-passage-number").last().val(2);
      //Asking for retrieval
      $j(".cts-selector-retriever").trigger("click");
      expect(spy).toHaveBeenCalled();
      var spy = null;
    });

    it("should have called the right url", function() {
      //Asking for Carta in typeahead
      th.input.$input.val("carta");
      th.input.setQuery("carta");
      th.input.trigger("upKeyed");
      //Clicking on one suggestion
      $j(".tt-dataset-texts > .tt-suggestions > .tt-suggestion").trigger("click");
      //Giving some false passage identifier
      $j(".cts-selector-passage-number").first().val(1);
      $j(".cts-selector-passage-number").last().val(2);
      $j(".cts-selector-passage-number").last().trigger("change");
      //Asking for retrieval
      $j(".cts-selector-retriever").trigger("click");
      //Testing
      expect(jasmine.Ajax.requests.mostRecent().url).toEqual("http://fakeRepo.com/CTS.xq?request=GetPassage&inv=pilots&urn=urn:cts:pdlmc:cdf.flc.perseus-lat1:1-2")
    });

    it("should change value of input", function() {
      //Asking for Carta in typeahead
      th.input.$input.val("Aeneid");
      th.input.setQuery("Aeneid");
      th.input.trigger("upKeyed");
      //Clicking on one suggestion
      $j(".tt-dataset-texts > .tt-suggestions > .tt-suggestion").trigger("click");
      //Giving some false passage identifier
      $j(".cts-selector-passage-number").eq(0).val(1);
      $j(".cts-selector-passage-number").eq(1).val(2);
      $j(".cts-selector-passage-number").eq(2).val(3);
      $j(".cts-selector-passage-number").eq(3).val(4);
      $j(".cts-selector-passage-number").trigger("change");
      //Asking for retrieval
      expect(input.val()).toEqual("urn:cts:latinLit:phi0690.phi003.perseus-lat1:1.2-3.4")
    });

    it("should have called the right url with 2 levels", function() {
      //Asking for Carta in typeahead
      th.input.$input.val("Aeneid");
      th.input.setQuery("Aeneid");
      th.input.trigger("upKeyed");
      //Clicking on one suggestion
      $j(".tt-dataset-texts > .tt-suggestions > .tt-suggestion").trigger("click");
      //Giving some false passage identifier
      $j(".cts-selector-passage-number").eq(0).val(1);
      $j(".cts-selector-passage-number").eq(1).val(2);
      $j(".cts-selector-passage-number").eq(2).val(3);
      $j(".cts-selector-passage-number").eq(3).val(4);
      $j(".cts-selector-passage-number").trigger("change");
      //Asking for retrieval
      $j(".cts-selector-retriever").trigger("click");
      //Testing
      expect(jasmine.Ajax.requests.mostRecent().url).toEqual("http://fakeRepo.com/CTS.xq?request=GetPassage&inv=annotsrc&urn=urn:cts:latinLit:phi0690.phi003.perseus-lat1:1.2-3.4")
    });

    it("should have try to retrieve text", function() {
      //Asking for Carta in typeahead
      th.input.$input.val("carta");
      th.input.setQuery("carta");
      th.input.trigger("upKeyed");
      //Clicking on one suggestion
      $j(".tt-dataset-texts > .tt-suggestions > .tt-suggestion").trigger("click");
      //Giving some false passage identifier
      $j(".cts-selector-passage-number").first().val(1);
      $j(".cts-selector-passage-number").last().val(2);
      //Asking for retrieval
      $j(".cts-selector-retriever").trigger("click");
      //Mocking up ajax  
      jasmine.Ajax.requests.mostRecent().respondWith({
        "status" : 200,
        "contentType" : "text/xml",
        "responseXML" : (new DOMParser()).parseFromString(text, "text/xml"),
        "responseText" : text
      });
      //Testing
      expect(textarea.val()).toEqual(text_parsed)
    });

    it("should have sent a retrieved trigger on target", function() {
      //Spy
      var spy = jasmine.createSpy("success");
      textarea.on("cts-passage:retrieved", spy)
      //Asking for Carta in typeahead
      th.input.$input.val("carta");
      th.input.setQuery("carta");
      th.input.trigger("upKeyed");
      //Clicking on one suggestion
      $j(".tt-dataset-texts > .tt-suggestions > .tt-suggestion").trigger("click");
      //Giving some false passage identifier
      $j(".cts-selector-passage-number").first().val(1);
      $j(".cts-selector-passage-number").last().val(2)
      //Asking for retrieval
      $j(".cts-selector-retriever").trigger("click");
      //Mocking up ajax  
      jasmine.Ajax.requests.mostRecent().respondWith({
        "status" : 200,
        "contentType" : "text/xml",
        "responseXML" : (new DOMParser()).parseFromString(text, "text/xml"),
        "responseText" : text
      });
      //Testing
      expect(spy).toHaveBeenCalled();
      var spy = null;
    });

    it("should have sent a retrieving error trigger on target", function() {
      //Spy
      var spy = jasmine.createSpy("success");
      textarea.on("cts-passage:retrieving-error", spy)
      //Asking for Carta in typeahead
      th.input.$input.val("carta");
      th.input.setQuery("carta");
      th.input.trigger("upKeyed");
      //Clicking on one suggestion
      $j(".tt-dataset-texts > .tt-suggestions > .tt-suggestion").trigger("click");
      //Giving some false passage identifier
      $j(".cts-selector-passage-number").first().val(1);
      $j(".cts-selector-passage-number").last().val(2);
      //Asking for retrieval
      $j(".cts-selector-retriever").trigger("click");
      //Mocking up ajax  
      jasmine.Ajax.requests.mostRecent().respondWith({
        "status" : 400,
        "contentType" : "text/xml",
        "responseXML" : (new DOMParser()).parseFromString(text, "text/xml"),
        "responseText" : text
      });
      //Testing
      expect(spy).toHaveBeenCalled();
      var spy = null;
    });
  });

  describe("Options", function() {
    var install = function(options) {
      jasmine.Ajax.install();
      //Creating DOM ELEMENTS
      input = $j("<input />", { "class" : "target", "type" : "text"});
      textarea = $j("<textarea />", { "class" : "TEItext"});
      fixture = $j("<div />", {"class" : "fixture"});
      fixture.append(input);
      fixture.append(textarea);
      $j("body").append(fixture);
      //Plugin
      input.ctsTypeahead(options);
      //Getting AJAX
      jasmine.Ajax.requests.mostRecent().respondWith({
        "status" : 200,
        "contentType" : "text/xml",
        "responseXML" : (new DOMParser()).parseFromString(repo1, "text/xml"),
        "responseText" : repo1
      });
      if(Object.keys(options.inventories).length == 2) {
        jasmine.Ajax.requests.mostRecent().respondWith({
          "status" : 200,
          "contentType" : "text/xml",
          "responseXML" : (new DOMParser()).parseFromString(repo2, "text/xml"),
          "responseText" : repo2
        });
      }
      //Creating variables shortcut
      instance = $j(".target").data("_cts_typeahead");
      th = instance.typeahead.data("ttTypeahead");
    }

    var remove = function() {
      jasmine.Ajax.uninstall();
      fixture.remove();
      instance = null;
      th = null;
    }

    it("should get theoretical work", function() {
      install({
        "endpoint" : "http://fakeRepo.com/CTS.xq?",
        "version" : 3,
        "inventories" : {
          "annotsrc" : "Nice label for annotsrc"
        },
        "retrieve" : ".TEItext",
        "theoretical" : true
      });
      //<--Test
      //Asking for Carta in typeahead
      th.input.$input.val("Aeneid");
      th.input.setQuery("Aeneid");
      th.input.trigger("upKeyed");
      expect($j(".tt-dataset-texts > .tt-suggestions > .tt-suggestion").length).toEqual(2);
      //-->Test
      remove();
    });

    it("should get not show retrieval", function() {
      install({
        "endpoint" : "http://fakeRepo.com/CTS.xq?",
        "version" : 3,
        "inventories" : {
          "annotsrc" : "Nice label for annotsrc"
        },
        "retrieve" : false
      });
      //<--Test
      //Asking for Carta in typeahead
      th.input.$input.val("Aeneid");
      th.input.setQuery("Aeneid");
      th.input.trigger("upKeyed");
      expect($j(".cts-selector-retriever").length).toEqual(0);
      //-->Test
      remove();
    });

    it("should get not show passage", function() {
      install({
        "endpoint" : "http://fakeRepo.com/CTS.xq?",
        "version" : 3,
        "inventories" : {
          "annotsrc" : "Nice label for annotsrc"
        },
        "passage" : false
      });
      //<--Test
      //Asking for Carta in typeahead
      th.input.$input.val("Aeneid");
      th.input.setQuery("Aeneid");
      th.input.trigger("upKeyed");
      expect($j(".tt-dataset-texts > .tt-suggestions > .tt-suggestion").length).toEqual(1);
      $j(".tt-dataset-texts > .tt-suggestions > .tt-suggestion").trigger("click");
      expect($j(".cts-selector-passage-number").length).toEqual(0);
      //-->Test
      remove();
    });

    it("should retrieve in original input", function() {
      install({
        "endpoint" : "http://fakeRepo.com/CTS.xq?",
        "version" : 3,
        "inventories" : {
          "annotsrc" : "Nice label for annotsrc",
          "label" : "Label"
        },
        "retrieve" : true
      });
      //<--Test
      //Asking for Carta in typeahead
      th.input.$input.val("carta");
      th.input.setQuery("carta");
      th.input.trigger("upKeyed");
      $j(".tt-dataset-texts > .tt-suggestions > .tt-suggestion").trigger("click");
      //Giving some false passage identifier
      $j(".cts-selector-passage-number").first().val(1);
      $j(".cts-selector-passage-number").last().val(2);
      //Asking for retrieval
      $j(".cts-selector-retriever").trigger("click");
      //Mocking up ajax  
      jasmine.Ajax.requests.mostRecent().respondWith({
        "status" : 200,
        "contentType" : "text/xml",
        "responseXML" : (new DOMParser()).parseFromString(text, "text/xml"),
        "responseText" : text
      });
      expect(input.val()).toEqual(text_parsed.replace("\n", "")) // It is an input, there is no new lines
      //-->Test
      remove();
    });

    it("should retrieve only a scope", function() {
      install({
        "endpoint" : "http://fakeRepo.com/CTS.xq?",
        "version" : 3,
        "inventories" : {
          "annotsrc" : "Nice label for annotsrc",
          "label" : "Label"
        },
        "retrieve" : true,
        "retrieve_scope" : "seg"
      });
      //<--Test
      //Asking for Carta in typeahead
      th.input.$input.val("carta");
      th.input.setQuery("carta");
      th.input.trigger("upKeyed");
      $j(".tt-dataset-texts > .tt-suggestions > .tt-suggestion").trigger("click");
      //Giving some false passage identifier
      $j(".cts-selector-passage-number").first().val(1);
      $j(".cts-selector-passage-number").last().val(2);
      //Asking for retrieval
      $j(".cts-selector-retriever").trigger("click");
      //Mocking up ajax  
      jasmine.Ajax.requests.mostRecent().respondWith({
        "status" : 200,
        "contentType" : "text/xml",
        "responseXML" : (new DOMParser()).parseFromString(text, "text/xml"),
        "responseText" : text
      });
      expect(input.val()).toEqual('<seg xmlns="http://www.tei-c.org/ns/1.0" n="1">Ho ! Saki, pass around and offer the bowl (of love for God) : --- </seg>') // It is an input, there is no new lines
      //-->Test
      remove();
    });

    it("should add private css", function() {
      install({
        "endpoint" : "http://fakeRepo.com/CTS.xq?",
        "version" : 3,
        "inventories" : {
          "annotsrc" : "Nice label for annotsrc",
          "label" : "Label"
        },
        "retrieve" : true,
        "retrieve_scope" : "seg",
        "css" : {
          "container" : ["container", "lala"],
          "retrieve-button" : ["retrieve-button"],
          "retrieve-button-container" : ["retrieve-button-container"],

          "citation" : ["citation"],
          "citation-container" : ["citation-container"],
          "citation-container-legend" : ["citation-container-legend"],
          "citation-input" : ["citation-input", "citation-input-ohoh"],
        }
      });
      //<--Test
      //Asking for Carta in typeahead
      th.input.$input.val("carta");
      th.input.setQuery("carta");
      th.input.trigger("upKeyed");
      $j(".tt-dataset-texts > .tt-suggestions > .tt-suggestion").trigger("click");
      //Giving some false passage identifier
      $j(".cts-selector-passage-number").first().val(1);
      $j(".cts-selector-passage-number").last().val(2);
      //Asking for retrieval
      $j(".cts-selector-retriever").trigger("click");
      //Mocking up ajax  
      jasmine.Ajax.requests.mostRecent().respondWith({
        "status" : 200,
        "contentType" : "text/xml",
        "responseXML" : (new DOMParser()).parseFromString(text, "text/xml"),
        "responseText" : text
      });

      //Real tests
      expect($j(".cts-selector").hasClass("container")).toBe(true);
      expect($j(".cts-selector").hasClass("lala")).toBe(true); // Testing multiple values

      expect($j(".cts-selector-retriever").hasClass("retrieve-button")).toBe(true);

      expect($j(".cts-selector-retriever").parent().hasClass("retrieve-button-container")).toBe(true);

      expect($j(".cts-selector-passage-container").parent().hasClass("citation")).toBe(true);

      expect($j(".cts-selector-passage-container").hasClass("citation-container")).toBe(true);

      expect($j(".cts-selector-passage-label").hasClass("citation-container-legend")).toBe(true);

      expect($j(".cts-selector-passage-number").hasClass("citation-input")).toBe(true);
      expect($j(".cts-selector-passage-number").hasClass("citation-input-ahah")).toBe(false);
      expect($j(".cts-selector-passage-number").hasClass("citation-input-ohoh")).toBe(true);


      //-->Test
      remove();
    });
  });

});