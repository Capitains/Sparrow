describe('jQuery CTS Selector', function() {
  beforeEach(function() {
    jasmine.getFixtures().fixturesPath = 'base/spec/javascripts/fixtures';
    repo1 = jasmine.getFixtures().read('xml/repo.xml');
    repo2 = jasmine.getFixtures().read('xml/repo2.xml');
    text = jasmine.getFixtures().read('xml/text.xml');
    text_parsed = (new XMLSerializer()).serializeToString((new DOMParser()).parseFromString(text, "text/xml"));
  });

  afterEach(function() {
    $j("body > div").remove();
  })

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
        input.ctsSelector({
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
        expect($j("select:visible").length).toBeGreaterThan(1);
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
      input.ctsSelector({
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
      instance = $j(".target").data("_cts_selector");

    });
    afterEach(function() {
      jasmine.Ajax.uninstall();
      fixture.remove();
      instance = null;
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

    it("should show a repository selector", function() {
      expect(fixture.find("select:visible").first().find("option").length).toEqual(2);
      expect(fixture.find("select:visible").first().find("option").first().val()).toEqual("annotsrc");
      expect(fixture.find("select:visible").first().find("option").last().val()).toEqual("pilots");
    });

    it("should show labels", function() {
      expect(fixture.find("select:visible").first().find("option").length).toEqual(2);
      expect(fixture.find("select:visible").first().find("option").first().text()).toEqual("Nice label for annotsrc");
      expect(fixture.find("select:visible").first().find("option").last().text()).toEqual("?");
    });
    
    it("should show data from 1st repository", function() {
      //Fixture
      fixture.find("select:visible").first().find("option").first()[0].selected = true;
      fixture.find("select:visible").first().trigger("change");
      expect(fixture.find("select:visible").eq(1).data("inventory")).toEqual("annotsrc");
    });

    it("should show data from 2nd repository", function(){
      fixture.find("select:visible").first().find("option").last()[0].selected = true;
      fixture.find("select:visible").first().trigger("change");
      expect(fixture.find("select:visible").eq(1).data("inventory")).toEqual("pilots");
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
      input.ctsSelector({
        "endpoint" : "http://fakeRepo.com/CTS.xq?",
        "version" : 3,
        "inventories" : {
          "annotsrc" : "Nice label for annotsrc",
          "pilots" : "?"
        },
        "retrieve" : ".TEItext",
        "passage" : true
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
      instance = $j(".target").data("_cts_selector");

    });
    afterEach(function() {
      jasmine.Ajax.uninstall();
      fixture.remove();
      instance = null;
    });

    var selectCarta = function() {
      //Fixtures
      fixture.find("select:visible").eq(0).find("option").last()[0].selected = true;
      fixture.find("select:visible").eq(0).trigger("change");

      fixture.find("select:visible").eq(1).find("option").first()[0].selected = true;
      fixture.find("select:visible").eq(1).trigger("change");

      fixture.find("select:visible").eq(2).find("option").first()[0].selected = true;
      fixture.find("select:visible").eq(2).trigger("change");

      fixture.find("select:visible").eq(3).find("option").first()[0].selected = true;
      fixture.find("select:visible").eq(3).trigger("change");
    }

    var passageCarta = function() {
      $j(".cts-selector-passage").first().val(1);
      $j(".cts-selector-passage").last().val(2);
      $j(".cts-selector-passage").last().trigger("change");
    }

    var selectVirgil = function() {
      //Fixtures
      fixture.find("select:visible").eq(0).find("option").first()[0].selected = true;
      fixture.find("select:visible").eq(0).trigger("change");

      fixture.find("select:visible").eq(1).find("option").first()[0].selected = true;
      fixture.find("select:visible").eq(1).trigger("change");

      fixture.find("select:visible").eq(2).find("option").first()[0].selected = true;
      fixture.find("select:visible").eq(2).trigger("change");

      fixture.find("select:visible").eq(3).find("option").first()[0].selected = true;
      fixture.find("select:visible").eq(3).trigger("change");
    }

    var passageVirgil = function() {
      $j(".cts-selector-passage").eq(0).val(1);
      $j(".cts-selector-passage").eq(1).val(2);
      $j(".cts-selector-passage").eq(2).val(3);
      $j(".cts-selector-passage").eq(3).val(4);
      $j(".cts-selector-passage").last().trigger("change");
    }

    var retrieve = function() {
      $j("button:contains(Retrieve)").trigger("click");
    }

    /**
     * 
     *  Tests
     *  
     */
    it("should automatically trigger up to the end", function () {
      selectVirgil();
      //We select Virgil
      fixture.find("select:visible").eq(1).find("option:contains(Ovid)")[0].selected = true;
      fixture.find("select:visible").eq(1).trigger("change");
      //fixture.find(".cts-selector-trigger").trigger("click");
      expect(input.data("urn")).toEqual("urn:cts:latinLit:phi0959.phi006.perseus-lat1");
    });

    it("should trigger on cts-selector trigger", function () {
      var spy = jasmine.createSpy("success");
      selectVirgil();
      //We select Virgil
      fixture.find("select:visible").eq(1).find("option:contains(Lucan)")[0].selected = true;
      fixture.find("select:visible").eq(1).trigger("change");
      fixture.find("select:visible").eq(3).find("option").last()[0].selected = true;
      fixture.find("select:visible").eq(3).on("change", spy);
      $j(".cts-selector-trigger").trigger("click");

      expect(spy).toHaveBeenCalled()
      expect(input.data("urn")).toEqual("urn:cts:latinLit:phi0917.phi001.perseus-lat2");
    });
    
    it("should set input urn on click", function() {
      selectCarta();
      //Testing
      expect(input.data("urn")).toEqual("urn:cts:pdlmc:cdf.flc.perseus-lat1");
    });
    
    it("should set input inventory on click", function() {
      selectCarta();
      //Testing
      expect(input.data("inventory")).toEqual("pilots");
    });

    it("should trigger cts-passage:urn-updated", function() {
      var spy = jasmine.createSpy("success");
      input.on("cts-passage:urn-updated", spy);
      selectCarta();
      //Testing
      expect(spy).toHaveBeenCalled()
      var spy = null;
    });

    it("should trigger cts-passage:urn-work", function() {
      var spy = jasmine.createSpy("success");
      input.on("cts-passage:urn-work", spy);
      selectCarta();
      //Testing
      expect(spy).toHaveBeenCalled()
      var spy = null;
    });

    it("should have shown passage selection", function() {
      //Selecting Carta
      selectCarta();
      //Testing
      expect($j(".cts-selector-citation").length).toEqual(2);
      expect($j(".cts-selector-citation input").length).toEqual(2);
    });

    it("should have sent a retrieving trigger on target", function() {
      //Spy
      var spy = jasmine.createSpy("success");
      textarea.on("cts-passage:retrieving", spy)
      //Selecting Carta
      selectCarta();
      //Selecting passage
      passageCarta();
      //Asking for retrieval
      retrieve();
      expect(spy).toHaveBeenCalled();
      var spy = null;
    });

    it("should have called the right url", function() {
      //Selecting Carta
      selectCarta();
      //Selecting passage
      passageCarta();
      //Asking for retrieval
      retrieve();
      //Testing
      expect(jasmine.Ajax.requests.mostRecent().url).toEqual("http://fakeRepo.com/CTS.xq?request=GetPassage&inv=pilots&urn=urn:cts:pdlmc:cdf.flc.perseus-lat1:1-2")
    });

    it("should change value of input", function() {
      //Selecting Aeneid
      selectVirgil();
      //Selecting passage
      passageVirgil();
      //Asking for retrieval
      retrieve();
      //Asking for retrieval
      expect(input.val()).toEqual("urn:cts:latinLit:phi0690.phi003.perseus-lat1:1.2-3.4")
    });

    it("should have called the right url with 2 levels", function() {
      //Selecting Aeneid
      selectVirgil();
      //Selecting passage
      passageVirgil();
      //Asking for retrieval
      retrieve();
      //Testing
      expect(jasmine.Ajax.requests.mostRecent().url).toEqual("http://fakeRepo.com/CTS.xq?request=GetPassage&inv=annotsrc&urn=urn:cts:latinLit:phi0690.phi003.perseus-lat1:1.2-3.4")
    });

    it("should have try to retrieve text", function() {
      //Selecting Carta
      selectCarta();
      //Selecting passage
      passageCarta();
      //Asking for retrieval
      retrieve();
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
      //Selecting Carta
      selectCarta();
      //Selecting passage
      passageCarta();
      //Asking for retrieval
      retrieve();
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
      //Selecting Carta
      selectCarta();
      //Selecting passage
      passageCarta();
      //Asking for retrieval
      retrieve();
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
      input.ctsSelector(options);
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
      instance = $j(".target").data("_cts_selector");
    }

    var remove = function() {
      jasmine.Ajax.uninstall();
      fixture.remove();
      instance = null;
    }
    var selectVirgil = function() {
      //Fixtures
      fixture.find("select:visible").eq(0).find("option").first()[0].selected = true;
      fixture.find("select:visible").eq(0).trigger("change");

      fixture.find("select:visible").eq(1).find("option").first()[0].selected = true;
      fixture.find("select:visible").eq(1).trigger("change");

      fixture.find("select:visible").eq(2).find("option").first()[0].selected = true;
      fixture.find("select:visible").eq(2).trigger("change");
    }

    var passageVirgil = function() {
      $j(".cts-selector-passage").eq(0).val(1);
      $j(".cts-selector-passage").eq(1).val(2);
      $j(".cts-selector-passage").eq(2).val(3);
      $j(".cts-selector-passage").eq(3).val(4);
      $j(".cts-selector-passage").last().trigger("change");
    }

    var retrieve = function() {
      $j("button:contains(Retrieve)").trigger("click");
    }

    it("should get not show retrieval", function() {
      install({
        "endpoint" : "http://fakeRepo.com/CTS.xq?",
        "version" : 3,
        "inventories" : {
          "annotsrc" : "Nice label for annotsrc"
        },
        "retrieve" : false
      });
      selectVirgil();
      //<--Test
      expect(fixture.find("button:contains(Retrieve)").length).toEqual(0);
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
      selectVirgil();
      //<--Test
      expect($j(".cts-selector-citation").length).toEqual(0);
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
      selectVirgil()
      passageVirgil();
      retrieve();
      //<--Test
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
      selectVirgil()
      passageVirgil();
      retrieve();
      //<--Test
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

          "select-inventory" : ["select-inventory"],
          "select-textgroup" : ["select-textgroup"],
          "select-work" : ["select-work"],
          "select-text" : ["select-text"],

          "trigger-button" : ["trigger-button"],

          "citation-fieldset" : ["citation-fieldset"],
          "citation-fieldset-legend" : ["citation-fieldset-legend"],
          "citation-container-legend" : ["citation-container-legend"],
          "citation-label" : ["citation-label"],
          "citation-input" : ["citation-input", "citation-input-ohoh"],
          "citation-input-container" : ["citation-input-container"]
        }
      });
      selectVirgil()
      passageVirgil();
      retrieve();
      //<--Test
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

      expect(fixture.find("button:contains(Retrieve)").hasClass("retrieve-button")).toBe(true);

      expect($j(".cts-selector-inventory").hasClass("select-inventory")).toBe(true);
      expect($j(".cts-selector-textgroup").hasClass("select-textgroup")).toBe(true);
      expect($j(".cts-selector-work").hasClass("select-work")).toBe(true);
      expect($j(".cts-selector-text").hasClass("select-text")).toBe(true);
      expect($j(".cts-selector-trigger").hasClass("trigger-button")).toBe(true);


      expect($j(".cts-selector-citation").hasClass("citation-fieldset")).toBe(true);
      expect($j(".cts-selector-citation > legend").hasClass("citation-fieldset-legend")).toBe(true);
      expect($j(".cts-selector-citation label").hasClass("citation-label")).toBe(true);
      expect($j(".cts-selector-input-container").hasClass("citation-input-container")).toBe(true);
      expect($j(".cts-selector-passage").hasClass("citation-input")).toBe(true);
      expect($j(".cts-selector-passage").hasClass("citation-input-ahah")).toBe(false);
      expect($j(".cts-selector-passage").hasClass("citation-input-ohoh")).toBe(true);

      //-->Test
      remove();
    });
  });
});