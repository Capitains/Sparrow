describe( "Testing CTS Repository object", function () {

    xml = jasmine.getFixtures().read('xml/repo.xml');

    describe("Verifying its modules are available", function() {
        beforeEach(function(){
            repo = CTS.repository("http://localhost") 
        });
        afterEach(function() {
            repo = null;
        });
        it("should exist and be an object", function() {
            expect(CTS.repository).toBeDefined();
        });
        it("should create a defined object", function() {
            expect(repo).toBeDefined();
        });
    });

    describe('checking DATA retrieval', function(){

      beforeEach(function() {
          repo = CTS.repository("http://localhost") 
          jasmine.Ajax.install();
          successFN = jasmine.createSpy("success");
          repo.addInventory("annotsrc");
          repo.load(successFN);
      });
      afterEach(function() {
          jasmine.Ajax.uninstall();
      });

      it('should call the right endpoint with the inventory informations', function(){
        expect(successFN).not.toHaveBeenCalled();
        expect(jasmine.Ajax.requests.mostRecent().url).toBe("http://localhost?request=GetCapabilities&inv=annotsrc");
        jasmine.Ajax.requests.mostRecent().respondWith({
          "status": 200,
          "contentType": 'text/xml',
          "responseText": xml
        });
        expect(successFN).toHaveBeenCalled();
      });

      it('should call the right endpoint with the inventory informations but fails when status is wrong', function(){
        expect(successFN).not.toHaveBeenCalled();
        jasmine.Ajax.requests.mostRecent().respondWith({
          "status": 400,
          "contentType": 'text/xml',
          "responseText": xml
        });
        expect(successFN).not.toHaveBeenCalled();
      });

      it("should have inventory with label and key (Without data loaded)", function() {
        expect(Object.keys(repo.inventory)).toContain("annotsrc");
        expect(repo.inventory.annotsrc).toContain("annotsrc");
      });
      it("should have inventories object when data are loaded", function() {
        jasmine.Ajax.requests.mostRecent().respondWith({
          "status": 200,
          "contentType": 'text/xml',
          "responseText": xml
        });
        expect(Object.keys(repo.inventories)).toContain("annotsrc");
      });

    });
    
    describe("getRaw, function for simplification of data", function () {
      /** 
       * Fixtures
       **/
      beforeEach(function() {
          repo = CTS.repository("http://localhost") 
          jasmine.Ajax.install();
          repo.addInventory("annotsrc");
          repo.load();
          jasmine.Ajax.requests.mostRecent().respondWith({
            "status": 200,
            "contentType": 'text/xml',
            "responseText": xml
          });
      });
      afterEach(function() {
          jasmine.Ajax.uninstall();
      });

      it('should have the basic level as textGroups titles', function(){
        var data = repo.inventories.annotsrc.getRaw();
        var textgroups = Object.keys(data);
        expect(textgroups).toEqual(["Virgil", "Ovid", "Lucan"]);
      });

    });

});
