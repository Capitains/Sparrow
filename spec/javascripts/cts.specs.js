describe( "Testing CTS Global object", function () {

    describe("Verifying its modules are available", function() {
        it("should exist and be an object", function() {
            expect(typeof CTS).toEqual("object");
        });
    });

});
