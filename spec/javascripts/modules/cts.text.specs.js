describe( "Testing CTS Texts functions", function () {

  getFirstPassagePlus = jasmine.getFixtures().read('xml/getFirstPassagePlus.xml');
  getValidReff = jasmine.getFixtures().read('xml/getValidReff.xml');
  getLabel = jasmine.getFixtures().read('xml/getLabel.xml');
  //First, test the non AJAX functions
  describe('Passage', function(){
    describe('Creation of the object', function(){
      it("should handle normal creation", function() {
        var text = new CTS.text.Passage("urn:cts:lala", "http://endpoint", "annotsrc");
        expect(text.endpoint.url).toEqual("http://endpoint?");
        expect(text.urn).toEqual("urn:cts:lala");
        expect(text.inventory).toEqual("annotsrc");
      });

      it("should handle normal creation", function() {
        var text = new CTS.text.Passage("http://restservice/urn:cts:lala", false);
        expect(text.endpoint).toEqual(null);
        expect(text.urn).toEqual("http://restservice/urn:cts:lala");
        expect(text.inventory).toEqual(null);
      });

    });

    describe('Setters and getters for TEXT', function(){

        beforeEach(function() {
          text = new CTS.text.Passage("http://restservice/urn:cts:lala", false);
        });
        afterEach(function() {
          delete text;
        })

        it("shoud handle texts setters and getters", function() {
          expect(text.text).toEqual(null);
          text.setText("lala");
          expect(text.getText()).toEqual("lala");
        });

        it("shoud handle stripping via setters and getters", function() {
          expect(text.text).toEqual(null);
          text.setText("\r\n\tlala     \t\t\n lala\n\n\r\n\r");
          expect(text.getText(null, true)).toEqual("lala lala");
        });
    });

    describe('XML Helpers', function(){
        var text = new CTS.text.Passage("http://restservice/urn:cts:lala", false);

      beforeEach(function() {
          xml = jasmine.getFixtures().read('xml/text.xml');
          xml = (new DOMParser()).parseFromString(xml, "text/xml");

          xml2 = jasmine.getFixtures().read('xml/text2.xml');
          xml2 = (new DOMParser()).parseFromString(xml2, "text/xml");
      });

        it("should say data is (TEI-)XML when it is", function() {
          text.document = xml;
          expect(text.checkXML()).toEqual(true);
          text.document = "";
          expect(text.checkXML()).toEqual(false);
        });

        it("should return xml nodes in string", function() {
          text.document = xml;
          expect(text.getXml("seg", "string")).toEqual(
            "<seg xmlns=\"http://www.tei-c.org/ns/1.0\" n=\"1\">Ho ! Saki, pass around and offer the bowl (of love for God) : --- </seg>"
          );
        });

        it("should return text", function() {
          text.document = xml;
          expect(text.getText()).toEqual(
            "Ho ! Saki, pass around and offer the bowl (of love for God) : --- "
          );
        });

        it("should return stripped text", function() {
          text.document = xml2;
          expect(text.getText(null, true)).toEqual(
            "Ho ! Saki, pass around and offer the bowl (of love for God) : --- "
          );
        });
        it("should return xml nodes in XML", function() {
          text.document = xml;
          var ret = text.getXml("seg", "xml");
          expect(ret instanceof NodeList).toEqual(true);
        });
    });
    
    //Then the ajax one


    describe("Retrieving text from normal CTS endpoint", function() {
      var text = new CTS.text.Passage(
        "urn:cts:greekLit:tlg0012.tlg001.perseus-grc1:1.1-1.2",
        "http://localhost:8080/exist/rest/db/xq/CTS.xq?",
        "annotsrc"
      );
      beforeEach(function() {
        jasmine.Ajax.install();
        successFN = jasmine.createSpy("success");
        errorFN = jasmine.createSpy("error");
        xml = jasmine.getFixtures().read('xml/text.xml');
      });
      afterEach(function() {
        jasmine.Ajax.uninstall();
      });

      it("should call the object endpoint with the right URL", function() {
        text.retrieve();
        expect(jasmine.Ajax.requests.mostRecent().url).toBe('http://localhost:8080/exist/rest/db/xq/CTS.xq?request=GetPassage&urn=urn:cts:greekLit:tlg0012.tlg001.perseus-grc1:1.1-1.2&inv=annotsrc');
      });

      it("should call it and answer an error on 400", function() {
        text.retrieve({success : successFN, error : errorFN});
            expect(successFN).not.toHaveBeenCalled();
            expect(errorFN).not.toHaveBeenCalled();

            jasmine.Ajax.requests.mostRecent().respondWith({
              "status": 404,
              "contentType": 'text/plain'
            });
            expect(successFN).not.toHaveBeenCalled();
            expect(errorFN).toHaveBeenCalled();
      });

      it("should success on XML data", function() {
        text.retrieve({
          "success" : successFN,
          "error" : errorFN
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
          "status": 200,
          "contentType": 'text/xml',
          "responseText": xml
        });
        expect(successFN).toHaveBeenCalled();
        expect(errorFN).not.toHaveBeenCalled();
        expect(text.getXml(false, "string")).toEqual(
          (new XMLSerializer()).serializeToString((new DOMParser()).parseFromString(xml, "text/xml"))
        );
      });

      it("should take new endpoint url", function() {
        text.retrieve({success : successFN, error : errorFN, endpoint : "http://localhost:8181"});
        expect(jasmine.Ajax.requests.mostRecent().url).toBe('http://localhost:8181?request=GetPassage&urn=urn:cts:greekLit:tlg0012.tlg001.perseus-grc1:1.1-1.2&inv=annotsrc');
      });
    });


    describe("Retrieving text from REST CTS endpoint", function() {

      beforeEach(function() {
        jasmine.Ajax.install();
        successFN = jasmine.createSpy("success");
        errorFN = jasmine.createSpy("error");
        text = new CTS.text.Passage("http://restservice/urn:cts:lala", new CTS.endpoint.simpleUrl("http://restservice/urn:cts:lala"));
      });

      afterEach(function() {
        jasmine.Ajax.uninstall();
      });

      it("should handle REST citations", function() {
        text.retrieve({success : successFN, error : errorFN});
        expect(jasmine.Ajax.requests.mostRecent().url).toBe('http://restservice/urn:cts:lala');
      });
      
    });
  });

  describe('Text', function() {
  	beforeEach(function() {
  		endpoint = "http://localhost:8080/exist/rest/db/xq/CTS.xq?";
  	});

    describe('Have helpers for passage', function(){
    	beforeEach(function() {
      	T = new CTS.text.Text("urn:cts:greekLit:tlg0012.tlg001.perseus-grc1", endpoint, "annotsrc")
    	});

    	it('Should make urn from lists', function(){
    	  expect(T.makePassageUrn([1,1], [2,2])).toEqual("urn:cts:greekLit:tlg0012.tlg001.perseus-grc1:1.1-2.2")
    	  expect(T.makePassageUrn(["1","1"], ["2","2"])).toEqual("urn:cts:greekLit:tlg0012.tlg001.perseus-grc1:1.1-2.2")
    	  expect(T.makePassageUrn([1,""], [2,2])).toEqual("urn:cts:greekLit:tlg0012.tlg001.perseus-grc1:1-2")
    	  expect(T.makePassageUrn([1,""], ["", ""])).toEqual("urn:cts:greekLit:tlg0012.tlg001.perseus-grc1:1")
    	  expect(T.makePassageUrn([], [])).toEqual("urn:cts:greekLit:tlg0012.tlg001.perseus-grc1")
    	  expect(T.makePassageUrn(["1"], [])).toEqual("urn:cts:greekLit:tlg0012.tlg001.perseus-grc1:1")
    	});

    	it("Should create a passage with good urn", function() {
    		var passage = T.getPassage([1,1], [2,2]);
    		expect(passage).toBeDefined();
    		expect(passage.urn).toEqual("urn:cts:greekLit:tlg0012.tlg001.perseus-grc1:1.1-2.2");
    	})

    });

  	describe('getFirstPassagePlus', function(){
  	  
    	beforeEach(function() {
      	T = new CTS.text.Text("urn:cts:greekLit:tlg0012.tlg001.perseus-grc1", endpoint, "annotsrc")
        jasmine.Ajax.install();
        successFN = jasmine.createSpy("success");
        errorFN = jasmine.createSpy("error");
	    });
	    afterEach(function() {
	        jasmine.Ajax.uninstall();
	    });

    	it('Should be able to call a getFirstPassagePlus and make success callback', function(){
    	  T.getFirstPassagePlus({
    	  	success : successFN,
    	  	error : errorFN
    	  });
	      expect(successFN).not.toHaveBeenCalled();
	      jasmine.Ajax.requests.mostRecent().respondWith({
	        "status": 200,
	        "contentType": 'text/xml',
	        "responseText": getFirstPassagePlus
	      });
	      expect(successFN).toHaveBeenCalled();
    	});

    	it('Should be able to call a getFirstPassagePlus and make error callback', function(){
    	  T.getFirstPassagePlus({
    	  	success : successFN,
    	  	error : errorFN
    	  });
	      expect(successFN).not.toHaveBeenCalled();
	      jasmine.Ajax.requests.mostRecent().respondWith({
	        "status": 400,
	        "contentType": 'text/xml',
	        "responseText": getFirstPassagePlus
	      });
	      expect(successFN).not.toHaveBeenCalled();
	      expect(errorFN).toHaveBeenCalled();
    	});

    	it('Should be able to call a getFirstPassagePlus and make a Passage with given body', function(){
    		var text = null;
    	  T.getFirstPassagePlus({
    	  	success : function(ref, data) {
    	  		text = data;
    	  		successFN();
    	  	},
    	  	error : errorFN
    	  });
	      expect(successFN).not.toHaveBeenCalled();
	      expect(jasmine.Ajax.requests.mostRecent().url).toBe("http://localhost:8080/exist/rest/db/xq/CTS.xq?request=GetFirstPassagePlus&urn=urn:cts:greekLit:tlg0012.tlg001.perseus-grc1&inv=annotsrc")
	      jasmine.Ajax.requests.mostRecent().respondWith({
	        "status": 200,
	        "contentType": 'text/xml',
	        "responseText": getFirstPassagePlus
	      });

	      expect(successFN).toHaveBeenCalled();
	      expect(text.urn).toEqual("urn:cts:greekLit:tlg0012.tlg001.perseus-grc1:1.1")
	      expect(text.getText()).toEqual("μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος")
    	});

  	});

	
		describe('GetValidReff', function(){
  	  
    	beforeEach(function() {
      	T = new CTS.text.Text("urn:cts:greekLit:tlg0012.tlg001.perseus-grc1", endpoint, "annotsrc")
        jasmine.Ajax.install();
        successFN = jasmine.createSpy("success");
        successFN2 = jasmine.createSpy("success");
        errorFN = jasmine.createSpy("error");
	    });
	    afterEach(function() {
	        jasmine.Ajax.uninstall();
	    });

    	it('Should be able to call a getValidReff', function(){
    		var text = null;
    	  T.getValidReff({
    	  	success : function(data) {
    	  		expect(data["1"]).toEqual("urn:cts:greekLit:tlg0012.tlg001.perseus-grc1:1")
    	  		successFN();
    	  	},
    	  	error : errorFN
    	  });
	      expect(successFN).not.toHaveBeenCalled();
	      expect(jasmine.Ajax.requests.mostRecent().url).toBe("http://localhost:8080/exist/rest/db/xq/CTS.xq?request=GetValidReff&urn=urn:cts:greekLit:tlg0012.tlg001.perseus-grc1&level=1&inv=annotsrc")
	      jasmine.Ajax.requests.mostRecent().respondWith({
	        "status": 200,
	        "contentType": 'text/xml',
	        "responseText": getValidReff
	      });

	      expect(successFN).toHaveBeenCalled();
    	  T.getValidReff({
    	  	success : function(data) {
    	  		expect(data["1"]).toEqual("urn:cts:greekLit:tlg0012.tlg001.perseus-grc1:1")
    	  		successFN2();
    	  	},
    	  	error : errorFN
    	  });
    	  expect(successFN2).toHaveBeenCalled();
    	});
			
		});

    describe('GetLabel', function(){
      
      beforeEach(function() {
        T = new CTS.text.Text("urn:cts:greekLit:tlg0012.tlg001.perseus-grc1", endpoint, "annotsrc")
        jasmine.Ajax.install();
        successFN = jasmine.createSpy("success 1");
        successFN2 = jasmine.createSpy("success 2");
        errorFN = jasmine.createSpy("error");
      });
      afterEach(function() {
          jasmine.Ajax.uninstall();
      });

      it('Should be able to call getLabel', function(){
        var text = null;
        T.getLabel({
          success : function(data) {
            expect(data.getTextgroup("eng")).toEqual("Smith, William")
            expect(data.getTitle("eng")).toEqual("A Dictionary of Greek and Roman biography and mythology")
            successFN();
          },
          error : errorFN
        });
        expect(successFN).not.toHaveBeenCalled();
        expect(jasmine.Ajax.requests.mostRecent().url).toBe("http://localhost:8080/exist/rest/db/xq/CTS.xq?request=GetLabel&urn=urn:cts:greekLit:tlg0012.tlg001.perseus-grc1&inv=annotsrc")
        jasmine.Ajax.requests.mostRecent().respondWith({
          "status": 200,
          "contentType": 'text/xml',
          "responseText": getLabel
        });

        expect(successFN).toHaveBeenCalled();
      });
      
    });

    describe('Titles and textgroups', function(){
      afterEach(function() {
          jasmine.Ajax.uninstall();
      });
      describe('Titles', function(){
        beforeEach(function() {
          T = new CTS.text.Text("urn:cts:greekLit:tlg0012.tlg001.perseus-grc1", endpoint, "annotsrc")
        });
        //When no titles, throw
        it('Should throw an error when title does not exist', function(){
          expect(function() { return T.getTitle(); }).toThrow(new Error("No title are available"))
        });
        it("Should get the lang asked for", function() {
          T.title = { "eng" : "hi", "fre" : "ahah"}
          expect(T.getTitle("eng")).toEqual("hi")
        })
        it("Should get a default when lang asked for does not exist", function() {
          T.title = { "eng" : "hi"}
          expect(T.getTitle("fre")).toEqual("hi")
        })
        it("Should get a default when no lang is asked", function() {
          T.title = { "eng" : "hi"}
          expect(T.getTitle()).toEqual("hi")
        })
      });

      describe('Textgroups', function(){
        beforeEach(function() {
          T = new CTS.text.Text("urn:cts:greekLit:tlg0012.tlg001.perseus-grc1", endpoint, "annotsrc")
        });
        //When no titles, throw
        it('Should throw an error when title does not exist', function(){
          expect(function() { return T.getTextgroup(); }).toThrow(new Error("No textgroup are available"))
        });
        it("Should get the lang asked for", function() {
          T.textgroup = { "eng" : "hi", "fre" : "ahah"}
          expect(T.getTextgroup("eng")).toEqual("hi")
        })
        it("Should get a default when lang asked for does not exist", function() {
          T.textgroup = { "eng" : "hi"}
          expect(T.getTextgroup("fre")).toEqual("hi")
        })
        it("Should get a default when no lang is asked", function() {
          T.textgroup = { "eng" : "hi"}
          expect(T.getTextgroup()).toEqual("hi")
        })
      });
      
    });

  });
  


});