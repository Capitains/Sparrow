describe('jQuery CTS XSLT', function() {
  beforeEach(function() {
    jasmine.Ajax.uninstall();
    jasmine.getFixtures().fixturesPath = 'base/spec/javascripts/fixtures';

    xslt_sample_1_xslt = jasmine.getFixtures().read('xml/xslt_sample_1_xsl.xml');
    xslt_sample_2_xslt = jasmine.getFixtures().read('xml/xslt_sample_2_xsl.xml');


    xmlReparsing = function(string) {
      var str = (new XMLSerializer()).serializeToString((new DOMParser()).parseFromString(string, "text/xml")).replace(/(\r\n|\n|\r)/gm,"").replace('<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />', '');
      str = str.replace('<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />', '')
      str = str.replace('<?xml version="1.0" encoding="UTF-8"?>', '');
      return str;
    }

    /*
    Transformation fixtures
     */
    xslt_sample_1 = jasmine.getFixtures().read('xml/xslt_sample_1.xml');
    xslt_sample_1_parsed = xmlReparsing(xslt_sample_1, "text/xml");
    xslt_sample_1_transformed = jasmine.getFixtures().read('xml/xslt_sample_1_transformed.xml');
    xslt_sample_1_transformed_parsed = xmlReparsing(xslt_sample_1_transformed);

    xslt_sample_2 = jasmine.getFixtures().read('xml/xslt_sample_2.xml');
    xslt_sample_2_parsed = xmlReparsing(xslt_sample_2, "text/xml");
    xslt_sample_2_transformed = jasmine.getFixtures().read('xml/xslt_sample_2_transformed.xml');
    xslt_sample_2_transformed_parsed = xmlReparsing(xslt_sample_2_transformed);


    //CTS Service mockup
    CTS.xslt.stylesheets.fakeXSLT = function(endpoint, options) {
      CTS.xslt.XSLT.call(this, endpoint, options);
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
    CTS.xslt.stylesheets.fakeXSLT2 = function(endpoint, options) {
      CTS.xslt.XSLT.call(this, endpoint, options);
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
        "input" : {
          "type" : "string",
          "html" : "input",
          "default" : "TEI"
        }
      }
    }
    //CTS Service mockup
    CTS.xslt.stylesheets.Simple = function(endpoint, options) {
      CTS.xslt.XSLT.call(this, endpoint, options);
      this.method = "POST";
      this.options = {
      }
    }
  });
  afterEach(function() {
    $j("body > div").remove();
    delete CTS.xslt.stylesheets.fakeXSLT;
    delete CTS.xslt.stylesheets.fakeXSLT2;
    delete CTS.xslt.stylesheets.Simple;
  })
  var start = function(serviceName, options) {
    jasmine.Ajax.install();

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
    //Creating DOM ELEMENTS
    fixture = $j("<div />", {"class" : "fixture"});
    button = $j("<button />", {"class" : "button"});
    dom = $j("<textarea />", {"class" : "text"});
    dom.val(xslt_sample_1)
    dom.text(xslt_sample_1)
    text_fixture =$j("<div />")
    text_fixture.append(dom)
    fixture.append(text_fixture)
    $j("body").append(fixture);
    fixture.ctsXSLT(serviceName, options)
    instance = fixture.data("_cts_xslt_"+serviceName);
    instance.xslt.stylesheeting(xslt_sample_1_xslt);
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
    start("fakeXSLT", options);
  }
  var startSimple = function(options) {
    if(typeof options === "undefined") {
      options = {
        "xml" : ".text"
      }
    }
    start("Simple", options);
  }

  var remove = function() {
    fixture.remove();
  }
  describe("Types recognition", function() {
    afterEach(function() { remove(); });
    it("should create a CTS.Service object", function() {
      startFake();
      expect(instance.xslt).toBeDefined();
      expect(instance.xslt.getValues).toBeDefined()
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
      expect(fixture.find("textarea:not(.text)").length).toEqual(1);
    });
  });

  describe("Workflow", function() {
    afterEach(function() { remove(); });

    it("should call the callback", function() {
      var spy = jasmine.createSpy("success");
      startSimple({
        callback : spy,
        trigger : "trigger",
        "xml" : ".text",
      });
      expect(spy).not.toHaveBeenCalled();
      fixture.trigger("trigger")
      expect(spy).toHaveBeenCalled();
    });

    it("should transform stuff", function() {
      //Mockup for phantomJS
      window.expectedXML = xslt_sample_1_transformed;
      //-->
      var spy = jasmine.createSpy("success");
      var cb = function(data) { 
        expect(xmlReparsing(data)).toEqual(xslt_sample_1_transformed);
        spy();
      }
      startSimple({
        callback : cb,
        trigger : "trigger",
        "xml" : ".text",
      });
      fixture.trigger("trigger")
      expect(spy).toHaveBeenCalled()
    });

    it("should take options in transform", function() {
      var spy = jasmine.createSpy("success");
      var cb = function(data) { 
        expect(xmlReparsing(data)).toEqual(xslt_sample_2_transformed);
        spy();
      }
      start("fakeXSLT2", {
        callback : cb,
        trigger : "trigger",
        "xml" : ".text",
      });
      fixture.find("textarea:not(.text)").val("some text");
      fixture.find("textarea:not(.text)").text("some text");
      $j(".text").text(xslt_sample_2);
      $j(".text").val(xslt_sample_2);
      instance.xslt.stylesheeting(xslt_sample_2_xslt);
      fixture.trigger("trigger")
      expect(spy).toHaveBeenCalled()
    });

    it("should trigger doing", function() {
      var spy = jasmine.createSpy("success");
      startSimple({
        trigger : "trigger",
        "xml" : ".text"
      });
      fixture.on("cts-xslt:Simple:doing", spy)
      fixture.trigger("trigger");
      expect(spy).toHaveBeenCalled();
      spy = null;
    });
    it("should trigger done", function() {
      var spy = jasmine.createSpy("success");
      startSimple({
        trigger : "trigger",
        "xml" : ".text"
      });
      fixture.on("cts-xslt:Simple:done", spy)
      fixture.trigger("trigger");
      expect(spy).toHaveBeenCalled();
      spy = null;
    });
    it("should run on click", function() {
      var spy = jasmine.createSpy("success");
      var element = $j("<a />");
      startSimple({
        click : element,
        callback : spy,
        "xml" : ".text"
      });
      element.trigger("click")
      expect(spy).toHaveBeenCalled();
      spy = null;
    });
    /*
*/

  });

  describe("Default recognition", function() {
    afterEach(function() { remove(); });
    it("should show true on hidden", function() {
      start("fakeXSLT");
      expect(fixture.find("input[type='hidden']").val()).toEqual("true");
    });
    it("should show false on hidden", function() {
      start("fakeXSLT2");
      expect(fixture.find("input[type='hidden']").val()).toEqual("false");
    });
    it("should check on true for checkbox", function() {
      start("fakeXSLT2");
      expect(fixture.find("input[type='checkbox']:checked").length).toEqual(1);
    });
    it("should not check on false for checkbox", function() {
      startFake();
      expect(fixture.find("input[type='checkbox']:checked").length).toEqual(0);
    });
    it("should put nothing when default is empty", function() {
      startFake();
      expect(fixture.find("textarea:not(.text)").val()).toEqual("");
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

  describe("Driver options", function() {
    afterEach(remove);
    it("should take element for values", function() {
      var a = $j("<input />", { type : "text"});
      startFake({
        driver : {
          "input" : a
        }
      });
      expect(instance.getValues().input).toEqual("")
      a.val("foo")
      expect(instance.getValues().input).toEqual("foo")
    });
    it("should take selector for values", function() {
      var a = $j("<input />", { type : "text", "class" : "element"});
      startFake({
        driver : {
          "input" : ".element"
        }
      });
      fixture.append(a)
      expect(instance.getValues().input).toEqual("")
      a.val("bar")
      expect(instance.getValues().input).toEqual("bar")
    })
    it("should take callback for value", function() {
      startFake({
        driver : {
          "input" : function() { return "foo"; }
        }
      });
      expect(instance.getValues().input).toEqual("foo")
    })
    it("should take list", function() {
      startFake({
        driver : {
          "list" : function() { return ["foo"]; }
        }
      });
      expect(instance.getValues().list).toEqual(["foo"])
    });
    it("should take boolean", function() {
      var foo = function() { return true; }
      startFake({
        driver : {
          "boolean" : function() { return foo(); }
        }
      });
      expect(instance.getValues().boolean).toEqual(true)
      var foo = function() { return false; }
      expect(instance.getValues().boolean).toEqual(false)
    });
    it("should handle checkbox selector correctly", function() {
      var a = $j("<input />", { type : "checkbox", "class" : "element"});
      a[0].checked = true;
      startFake({
        driver : {
          "checkbox" : ".element"
        }
      });
      fixture.append(a)
      expect(instance.getValues().checkbox).toEqual(true)
      a[0].checked = false;
      expect(instance.getValues().checkbox).toEqual(false)
    });
    it("should handle checkbox object correctly", function() {
      var a = $j("<input />", { type : "checkbox", "class" : "element"});
      a[0].checked = true;
      startFake({
        driver : {
          "boolean" : a
        }
      });
      fixture.append(a)
      expect(instance.getValues().boolean).toEqual(true)
      a[0].checked = false;
      expect(instance.getValues().boolean).toEqual(false)
    });
  });

  describe("Names options", function() {
    //The name option give names to fields
    //Our goal here is to check it works with every type of input supported
    afterEach(remove);
    it("should work for checkbox", function() {
      startFake({
        names : {
          "checkbox" : "boolean"
        }
      });
      expect(fixture.find("input[type='checkbox'][name='boolean']").length).toEqual(1)
    })
    it("should work for hidden", function() {
      startFake({
        names : {
          "boolean" : "boolean"
        }
      });
      expect(fixture.find("input[type='hidden'][name='boolean']").length).toEqual(1)
    })
    it("should work for text", function() {
      startFake({
        names : {
          "input" : "boolean"
        }
      });
      expect(fixture.find("input[type='text'][name='boolean']").length).toEqual(1)
    })
    it("should work for text", function() {
      startFake({
        names : {
          "textarea" : "boolean"
        }
      });
      expect(fixture.find("textarea[name='boolean']").length).toEqual(1)
    })
  });

  describe("CSS/show options", function() {
    afterEach(remove);
    it("shoud not show on show=false", function() {
      startFake({show:false});
      expect(fixture.find("fieldset:visible").length).toEqual(0)
    })
    it("shoud not show on show=true", function() {
      startFake({show:true});
      expect(fixture.find("fieldset:visible").length).toEqual(1)
    })
    it("shoud toggle on trigger on target element", function() {
      startFake({show:"true"});

      expect(fixture.find("fieldset:visible").length).toEqual(1)
      fixture.trigger("true");
      expect(fixture.find("fieldset:visible").length).toEqual(0)
    });

    it("should use css defined class", function() {
      startFake({
        css : {
          "container" : ["container"],
          "container-legend" : ["container-legend"],

          "field-container" : ["field-container"],
          "field-label" : ["field-label"],
          "field-input-container" : ["field-input-container"],

          "field-text" : ["field-text"],
          "field-checkbox" : ["field-checkbox"],
          "field-textarea" : ["field-textarea"]
        }
      })
      expect(fixture.find(".container").length).toEqual(1);
      expect(fixture.find(".container-legend").length).toEqual(1);

      expect(fixture.find(".field-textarea").length).toEqual(1);
      expect(fixture.find(".field-text").length).toEqual(2); // list + input
      expect(fixture.find(".field-checkbox").length).toEqual(1);

      //There is one hidden so... 4 fields !
      expect(fixture.find(".field-container").length).toEqual(4)
      expect(fixture.find(".field-label").length).toEqual(4)
      expect(fixture.find(".field-input-container").length).toEqual(4)
    })

  });

  describe("Defaults options", function() {
    afterEach(remove);
    it("should take boolean default", function() {
      startFake({
        "defaults" : {
          "checkbox" : true,
          "boolean" : false,//hidden
          "textarea" : "hello",
          "list" : ["a", "b"],
          "input" : "Epidoc"
        }
      });
      expect(instance.getValues().checkbox).toEqual(true);
      expect(instance.getValues().boolean).toEqual(false);
      expect(instance.getValues().textarea).toEqual("hello");
      expect(instance.getValues().list).toEqual(["a", "b"]);
      expect(instance.getValues().input).toEqual("Epidoc");
    });
  });
});