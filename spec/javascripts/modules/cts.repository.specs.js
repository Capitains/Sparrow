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

    it('should have a level n + 1 in Virgil being its works title', function(){
      var data = repo.inventories.annotsrc.getRaw();
      var work = Object.keys(data.Virgil);
      expect(work).toEqual(["Aeneid"]);
    });

    it('should have a level n + 1 in Virgil being its works title', function(){
      var data = repo.inventories.annotsrc.getRaw();
      var work = Object.keys(data.Virgil);
      expect(work).toEqual(["Aeneid"]);
    });
    
    it('should have a level n + 2 in Virgil being type of works', function(){
      var data = repo.inventories.annotsrc.getRaw();
      var work = Object.keys(data.Virgil.Aeneid);
      expect(work).toEqual(["edition", "translation"]);
    });
    
    it('should have a level n + 2 with theoretical text', function(){
      var data = repo.inventories.annotsrc.getRaw("eng", true);
      var work = Object.keys(data.Virgil.Aeneid);
      expect(work).toEqual(["edition", "translation", "theoretical"]);
    });
    
    it('should have a level n + 3  being editions', function(){
      var data = repo.inventories.annotsrc.getRaw();
      var work = Object.keys(data.Virgil.Aeneid.edition);
      expect(work).toEqual(["Aeneid"]);
    });
    
    it('should have a level n + 4  being editions/translation object', function(){
      var data = repo.inventories.annotsrc.getRaw();
      var work = Object.keys(data.Virgil.Aeneid.edition);
      expect(work).toEqual(["Aeneid"]);
      expect(data.Virgil.Aeneid.edition.Aeneid.prototype).toBe(CTS.repositoryPrototypes.Text);
    });
    
    it('should return given language when specified', function(){
      var data = repo.inventories.annotsrc.getRaw("fr");
      var work = Object.keys(data);
      expect(work).toEqual(["Virgile", "Ovid", "Lucan"]);
    });

  });

  describe('CTS3-Text ', function(){

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
        text = repo.inventories.annotsrc.getRaw("eng").Virgil.Aeneid.edition.Aeneid;
    });
    afterEach(function() {
        jasmine.Ajax.uninstall();
    });

    it('should have an URN', function(){
      expect(text.urn).toEqual("urn:cts:latinLit:phi0690.phi003.perseus-lat1");
    });

    it('should have citations Scheme', function(){
      expect(text.citations).toEqual(["book", "line"]);
    });

    it('should have citations Scheme', function(){
      expect(text.citations).toEqual(["book", "line"]);
    });

    it('should have at least one label', function(){
      var label = text.getLabel();
      expect(label).toBeDefined();
      expect(label).toBe("Aeneid");
    });

    it('should return other language label', function(){
      var label = text.getLabel("fr");
      expect(label).toBe("Énéide")
    });

    it('should return default language label when one does not existing', function(){
      var label = text.getLabel("nonExistingLanguage");
      expect(label).toBe("Aeneid")
    });

    it('should have at least one description', function(){
      var desc = text.getDesc();
      expect(desc).toBeDefined();
      expect(desc).toEqual("Perseus:bib:oclc,22858571, Vergil. Bucolics, Aeneid, and Georgics Of Vergil. J. B. Greenough. Boston. Ginn and Co. 1900.");
    });

    it('should return other language description', function(){
      var desc = text.getDesc("fr");
      expect(desc).toEqual("Perseus:bib:oclc,22858571, Vergil. Bucoliques, Énéide, and Géorgiques Of Vergil. J. B. Greenough. Boston. Ginn and Co. 1900.")
    });

    it('should return default language description when one does not exist', function(){
      var desc = text.getDesc("nonExistingLanguage");
      expect(desc).toEqual("Perseus:bib:oclc,22858571, Vergil. Bucolics, Aeneid, and Georgics Of Vergil. J. B. Greenough. Boston. Ginn and Co. 1900.")
    });
    
  });
  
  describe('CTS3-TextGroup ', function(){

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
        textgroup = repo.inventories.annotsrc.textgroups[0];

    });
    afterEach(function() {
        jasmine.Ajax.uninstall();
    });

    it('should have an URN', function(){
      expect(textgroup.urn).toEqual("urn:cts:latinLit:phi0690");
    });

    it('should have at least one label', function(){
      var label = textgroup.getName();
      expect(label).toBeDefined();
      expect(label).toBe("Virgil");
    });

    it('should return other language label', function(){
      var label = textgroup.getName("fr");
      expect(label).toBe("Virgile")
    });

    it('should return default language label when one does not existing', function(){
      var label = textgroup.getName("nonExistingLanguage");
      expect(label).toBe("Virgil")
    });

    it('should have children Works', function(){
      var label = textgroup.works;
      expect(label.length).toEqual(1)
    });

  });
  
  describe('CTS3-Work ', function(){

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
        work = repo.inventories.annotsrc.textgroups[0].works[0];

    });
    afterEach(function() {
        jasmine.Ajax.uninstall();
    });

    it('should have an URN', function(){
      expect(work.urn).toEqual("urn:cts:latinLit:phi0690.phi003");
    });

    it('should have at least one label', function(){
      var label = work.getTitle();
      expect(label).toBeDefined();
      expect(label).toBe("Aeneid");
    });

    it('should return other language label', function(){
      var label = work.getTitle("fr");
      expect(label).toBe("Énéide")
    });

    it('should return default language label when one does not existing', function(){
      var label = work.getTitle("nonExistingLanguage");
      expect(label).toBe("Aeneid")
    });

    it("should have a list of editions", function() {
      var editions = work.editions;
      expect(editions).toBeArray();
    });

    it("should have a list of editions of length 1", function() {
      var editions = work.editions;
      expect(editions.length).toEqual(1);
    });

    it("should have a list of translations", function() {
      var translations = work.translations;
      expect(translations).toBeArray();
    });

  });
});
