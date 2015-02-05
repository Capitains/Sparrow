describe( "Testing CTS Utils functions", function () {

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

    describe('Checking Encoding data function', function(){
    	it('should handle list properly', function(){
    	  expect(CTS.utils.dataEncode({"list" : ["1", "2"]})).toEqual("list[]=1&list[]=2")
    	});

    	it('should handle string properly', function(){
    	  expect(CTS.utils.dataEncode({"foo" : "bar"})).toEqual("foo=bar")
    	});

    	it('should handle boolean value properly', function(){
    	  expect(CTS.utils.dataEncode({"foo": true})).toEqual("foo=true")
    	  expect(CTS.utils.dataEncode({"foo": false})).toEqual("foo=false")
    	});

    	it('should handle xml properly', function () {
    	  expect(CTS.utils.dataEncode({"xml": "<xml attr=\"a\"></xml>"})).toEqual("xml=%3Cxml+attr%3D%22a%22%3E%3C%2Fxml%3E")
    	});
    });

    describe('Checking Endpoint Checking properly ', function(){
    	it('should be null when not a string', function() {
    		expect(CTS.utils.checkEndpoint(null)).toEqual(null);
    		expect(CTS.utils.checkEndpoint([])).toEqual(null);
    		expect(CTS.utils.checkEndpoint({})).toEqual(null);
    		expect(CTS.utils.checkEndpoint()).toEqual(null);
    		expect(CTS.utils.checkEndpoint(true)).toEqual(null);
    	});

    	it('should add a ? at the end when there is none', function() {
    		expect(CTS.utils.checkEndpoint("http://lala.com")).toEqual("http://lala.com?");
    	});

    	it('should return the string as it is when there is a ?', function() {
    		expect(CTS.utils.checkEndpoint("http://lala.com?")).toEqual("http://lala.com?");
    	});
    });
    

});



/**
 * Need to find a way to moc location.search

(function() {
	window.jasmine = jasmineRequire.core(jasmineRequire);
	jasmineRequire.html(jasmine);
	var env = jasmine.getEnv();
	var jasmineInterface = jasmineRequire.interface(jasmine, env);


	var queryString = new jasmine.QueryString({
		getWindowLocation: function() { return window.location; }
	});
	describe('Checking URL Params helper', function(){
		var context = {
			"window" : {
				location : {
					search : "?foo=bar&z=y"
				}
			}
		}
		it('should retrieve a value from a URI', function(){
			(function(window) {
				console.log(window.location.search.split(/\?|\&/));
				expect(CTS.utils.uriParam().foo).toEqual("bar");
			})(context.window)
		});
		
	});
})();

 */