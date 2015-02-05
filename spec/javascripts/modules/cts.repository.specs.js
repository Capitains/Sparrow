describe( "Testing CTS Repository object", function () {

    describe("Verifying its modules are available", function() {
    	beforeEach(function(){
	    	xml = jasmine.getFixtures().read('xml/repo.xml');
		});
        it("should exist and be an object", function() {
            expect(typeof CTS).toEqual("object");
        });
    });

});
