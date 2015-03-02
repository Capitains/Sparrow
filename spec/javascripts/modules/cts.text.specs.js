describe( "Testing CTS Texts functions", function () {
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
        var text = new CTS.text.Passage("http://restservice/urn:cts:lala", false);

        it("shoud handle texts setters and getters", function() {
          expect(text.text).toEqual(null);
          text.setText("lala");
          expect(text.getText()).toEqual("lala");
        });
    });

    describe('XML Helpers', function(){
        var text = new CTS.text.Passage("http://restservice/urn:cts:lala", false);

      beforeEach(function() {
          xml = jasmine.getFixtures().read('xml/text.xml');
          xml = (new DOMParser()).parseFromString(xml, "text/xml");
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

  describe('Text', function(){
    describe('Have helpers for passage', function(){
    	beforeEach(function() {
      	T = new CTS.text.Text("urn:cts:greekLit:tlg0012.tlg001.perseus-grc1", "annotsrc", endpoint)
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
  });
  


});