describe('jQuery CTS Selector', function() {
  beforeEach(function() {
    jasmine.getFixtures().fixturesPath = 'base/spec/javascripts/fixtures';
    repo1 = jasmine.getFixtures().read('xml/repo.xml');
    repo2 = jasmine.getFixtures().read('xml/repo2.xml');
    text = jasmine.getFixtures().read('xml/text.xml');
    text_parsed = (new XMLSerializer()).serializeToString((new DOMParser()).parseFromString(text, "text/xml"));

    //CTS Service mockup
    CTS.service.services.fakeService = function(endpoint, options) {
      CTS.service._service.call(this, endpoint, options);
      this.method = "POST";
      this.options = {
        "xml" : {
          "type" : "boolean",
          "html" : "checkbox",
          "default" : false
        },
        "inline" : {
          "type" : "boolean",
          "html" : "hidden",
          "default" : true
        },
        "text" : {
          "type" : "text", // Text unlinke string is a big thing
          "html" : "textarea"
        },
        "remove_node" : {
          "type" : "list",
          "html" : "input",
          "default" : ["teiHeader","head","speaker","note","ref"]
        },
        "go_to_root" : {
          "type" : "string",
          "html" : "input",
          "default" : "TEI"
        }
      }
    }
    //CTS Service mockup
    CTS.service.services.fakeService2 = function(endpoint, options) {
      CTS.service._service.call(this, endpoint, options);
      this.method = "POST";
      this.options = {
        "checkbox" : {
          "type" : "boolean",
          "html" : "checkbox",
          "default" : true
        },
        "hidden" : {
          "type" : "boolean",
          "html" : "hidden",
          "default" : false
        },
        "textarea" : {
          "type" : "text", // Text unlinke string is a big thing
          "html" : "textarea"
        },
        "list" : {
          "type" : "list",
          "html" : "input",
          "default" : ["teiHeader","head","speaker","note","ref"]
        },
        "input" : {
          "type" : "string",
          "html" : "input",
          "default" : "TEI"
        }
      }
    }
  });
  afterEach(function() {
    $j("body > div").remove();
    delete CTS.service.services.fakeService;
    delete CTS.service.services.fakeService2;
  })
  var start = function(serviceName, options) {

    if(typeof options === "undefined") {
      options = {
        "endpoint" : "http://services.perseids.org/llt/segtok",
        "click" : ".button",
        "trigger" : "tokenize!",
        "callback" : function(data) {
          console.log(data);
        },
        "show" : "SHOW_ME_THE_GONDOR",
        "names" : {
            "xml" : "xml_for_llt"
        }
      }
    }
    jasmine.Ajax.install();
    //Creating DOM ELEMENTS
    fixture = $j("<div />", {"class" : "fixture"});
    button = $j("<button />", {"class" : "button"});
    fixture.append(fixture)
    $j("body").append(fixture);
    fixture.ctsService(serviceName, options)
  }

  var startFake = function(options) {
    if(typeof options === "undefined") {
      options = {
        "endpoint" : "http://services.perseids.org/llt/segtok",
        "click" : ".button",
        "trigger" : "tokenize!",
        "callback" : function(data) {
          console.log(data);
        },
        "show" : "SHOW_ME_THE_GONDOR",
        "names" : {
            "xml" : "xml_for_llt"
        }
      }
    }
    start("fakeService", options);
  }

  var remove = function() {
    fixture.remove();
  }

  describe("Types recognition", function() {
    it("should add checkbox", function() {
      startFake();
      expect(fixture.find("input[type='checkbox']").length).toEqual(1);
      remove(); 
    });
    it("should add hidden", function() {
      startFake();
      expect(fixture.find("input[type='hidden']").length).toEqual(1);
      remove(); 
    });
    it("should add input[text]", function() {
      startFake();
      expect(fixture.find("input[type='text']").length).toEqual(2);
      remove(); 
    });
    it("should add textarea", function() {
      startFake();
      expect(fixture.find("textarea").length).toEqual(1);
      remove(); 
    });
  });

  describe("Default recognition", function() {
    it("should show true on hidden", function() {
      start("fakeService");
      expect(fixture.find("input[type='hidden']").val()).toEqual("true");
      remove();
    });
    it("should show false on hidden", function() {
      start("fakeService2");
      expect(fixture.find("input[type='hidden']").val()).toEqual("false");
      remove();
    });
    it("should check on true for checkbox", function() {
      start("fakeService2");
      expect(fixture.find("input[type='checkbox']:checked").length).toEqual(1);
      remove();
    });
    it("should not check on false for checkbox", function() {
      startFake();
      expect(fixture.find("input[type='checkbox']:checked").length).toEqual(0);
      remove();
    });
    it("should put nothing when default is empty", function() {
      startFake();
      expect(fixture.find("textarea").val()).toEqual("");
      remove();
    });
    it("should put nothing when default is empty", function() {
      startFake();
      expect(fixture.find("input[type='text']").last().val()).toEqual("TEI");
      remove();
    });
  });

  describe("GetValues recognition", function() {
  });
});