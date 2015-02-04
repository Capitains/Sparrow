describe( "Testing CTS Synchronous functions", function () {

    describe("Checking structure", function() {
        it("should exist and be an object", function() {
            expect(typeof CTS.utils).toEqual("object");
        });
	    it("should have an xhr function", function() {
	    	expect(typeof CTS.utils.xhr).toEqual("function");
	    });
	    it("should have a encoding data function", function() {
	    	expect(typeof CTS.utils.dataEncode).toEqual("function");
	    });
	    it("should have a checking endpoint function", function() {
	    	expect(typeof CTS.utils.checkEndpoint).toEqual("function");
	    });
	    it("should have a parseInt function", function() {
	    	expect(typeof CTS.utils.parseInt).toEqual("function");
	    });
	    it("should have a validPassage function", function() {
	    	expect(typeof CTS.utils.validPassage).toEqual("function");
	    });
	    it("should have a URL parameters helper function", function() {
	    	expect(typeof CTS.utils.uriParam).toEqual("function");
	    });
    });

});
