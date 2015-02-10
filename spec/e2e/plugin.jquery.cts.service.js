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
        "checkbox" : {
          "type" : "boolean",
          "html" : "checkbox",
          "default" : false
        },
        "boolean" : {
          "type" : "boolean",
          "html" : "hidden",
          "default" : true
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
        "boolean" : {
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
    instance = fixture.data("_cts_service_"+serviceName);
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
    afterEach(function() { remove(); });
    it("should create a CTS.Service object", function() {
      startFake();
      expect(instance.service).toBeDefined();
      expect(instance.service.getValues).toBeDefined()
    })
    it("should add checkbox", function() {
      startFake();
      expect(fixture.find("input[type='checkbox']").length).toEqual(1);
    });
    it("should add hidden", function() {
      startFake();
      expect(fixture.find("input[type='hidden']").length).toEqual(1);
    });
    it("should add input[text]", function() {
      startFake();
      expect(fixture.find("input[type='text']").length).toEqual(2);
    });
    it("should add textarea", function() {
      startFake();
      expect(fixture.find("textarea").length).toEqual(1);
    });
  });

  describe("Default recognition", function() {
    afterEach(function() { remove(); });
    it("should show true on hidden", function() {
      start("fakeService");
      expect(fixture.find("input[type='hidden']").val()).toEqual("true");
    });
    it("should show false on hidden", function() {
      start("fakeService2");
      expect(fixture.find("input[type='hidden']").val()).toEqual("false");
    });
    it("should check on true for checkbox", function() {
      start("fakeService2");
      expect(fixture.find("input[type='checkbox']:checked").length).toEqual(1);
    });
    it("should not check on false for checkbox", function() {
      startFake();
      expect(fixture.find("input[type='checkbox']:checked").length).toEqual(0);
    });
    it("should put nothing when default is empty", function() {
      startFake();
      expect(fixture.find("textarea").val()).toEqual("");
    });
    it("should put nothing when default is empty", function() {
      startFake();
      expect(fixture.find("input[type='text']").last().val()).toEqual("TEI");
    });
  });

  describe("GetValues recognition", function() {
    afterEach(function() { remove(); });
    it("should retrieve right boolean for checkbox", function() {
      startFake();
      expect(instance.getValues().checkbox).toEqual(false);
      instance.inputs.checkbox[0].checked = true;
      expect(instance.getValues().checkbox).toEqual(true);
    });
    it("should retrieve right boolean for hidden", function() {
      startFake();
      expect(instance.getValues().boolean).toEqual(true);
      instance.inputs.boolean.val(false);
      expect(instance.getValues().boolean).toEqual(false);
    });
    it("should retrieve text for text", function() {
      startFake();
      //With \n for textarea
      instance.inputs.textarea.val("Hello there\n ahah !");
      expect(instance.getValues().textarea).toEqual("Hello there\n ahah !");
      //Without for input
      instance.inputs.input.val("Hello there\n ahah !");
      expect(instance.getValues().input.replace("  ", " ")).toEqual("Hello there ahah !"); // Phantom replace \n by \s so let trim this string
    });
    it("should retrieve list for list", function() {
      startFake();
      expect(instance.getValues().list).toEqual(["teiHeader","head","speaker","note","ref"]);
      instance.inputs.list.val("ahah");
      expect(instance.getValues().list).toEqual(["ahah"]);
      instance.inputs.list.val("ahah, ohoh");
      expect(instance.getValues().list).toEqual(["ahah", "ohoh"]);
    })
  });

  describe("Workflow", function() {
    afterEach(function() { remove(); });
    it("should send to the right endpoint", function() {
      startFake({
        "endpoint" : "http://services.perseids.org/llt/segtok",
        trigger : "trigger"
      });
      fixture.trigger("trigger")
      expect(jasmine.Ajax.requests.mostRecent().url).toEqual("http://services.perseids.org/llt/segtok")
    });
    it("should call the callback", function() {
      var spy = jasmine.createSpy("success");
      startFake({
        callback : spy,
        trigger : "trigger"
      });
      fixture.trigger("trigger");
      jasmine.Ajax.requests.mostRecent().respondWith({
        status : 200
      })
      expect(spy).toHaveBeenCalled();
      spy = null;
    });
    it("should trigger doing", function() {
      var spy = jasmine.createSpy("success");
      startFake({
        trigger : "trigger"
      });
      fixture.on("cts-service:fakeService:doing", spy)
      fixture.trigger("trigger");
      expect(spy).toHaveBeenCalled();
      spy = null;
    });
    it("should trigger done", function() {
      var spy = jasmine.createSpy("success");
      startFake({
        trigger : "trigger"
      });
      fixture.on("cts-service:fakeService:done", spy)
      fixture.trigger("trigger");
      jasmine.Ajax.requests.mostRecent().respondWith({
        status : 200
      })
      expect(spy).toHaveBeenCalled();
      spy = null;
    });
    it("should run on click", function() {
      var spy = jasmine.createSpy("success");
      var element = $j("<a />");
      startFake({
        click : element,
        callback : spy
      });
      element.trigger("click")
      //Need to answer to have callback
      jasmine.Ajax.requests.mostRecent().respondWith({
        status : 200
      })
      expect(spy).toHaveBeenCalled();
      spy = null;
    });
    it("should pass data", function() {
      var element = $j("<a />");
      startFake({
        click : element
      });
      element.trigger("click")
      //Need to answer to have callback
      expect(jasmine.Ajax.requests.mostRecent().params.length).toBeGreaterThan(0);
    });
  });

  describe("Driver options", function() {

  });

  describe("Names options", function() {
    
  });

  describe("CSS/show options", function() {
    
  });

  describe("Defaults options", function() {
    
  });
});