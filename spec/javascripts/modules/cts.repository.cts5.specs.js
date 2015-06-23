describe( "Testing CTS 5 Repository object", function () {
  fixtures = {
    "cts5" : {
      "repo" : jasmine.getFixtures().read('xml/repo-cts5.xml'),
      "translationsRepo" : jasmine.getFixtures().read('xml/repo-cts5.xml'),
      "json" : JSON.parse(jasmine.getFixtures().read('json/inventory-cts5.json'))
    }
  }

  describe("Verifying its modules are available", function() {
      beforeEach(function(){
          repo = new CTS.repository.repository("http://localhost", 5) 
      });
      afterEach(function() {
          repo = null;
      });
      it("should exist and be an object", function() {
          expect(CTS.repository.repository).toBeDefined();
      });
      it("should create a defined object", function() {
          expect(repo).toBeDefined();
      });
  });

  describe('checking DATA retrieval', function(){

    beforeEach(function() {
        repo = new CTS.repository.repository("http://localhost", 5) 
        jasmine.Ajax.install();
        successFN = jasmine.createSpy("success");
        repo.addInventory("sparrow");
        repo.load(successFN);
    });
    afterEach(function() {
        jasmine.Ajax.uninstall();
    });

    it('should call the right endpoint with the inventory informations', function(){
      expect(successFN).not.toHaveBeenCalled();
      expect(jasmine.Ajax.requests.mostRecent().url).toBe("http://localhost?request=GetCapabilities&inv=sparrow");
      jasmine.Ajax.requests.mostRecent().respondWith({
        "status": 200,
        "contentType": 'text/xml',
        "responseText": fixtures.cts5.repo
      });
      expect(successFN).toHaveBeenCalled();
    });

    it('should call the right endpoint with the inventory informations but fails when status is wrong', function(){
      expect(successFN).not.toHaveBeenCalled();
      jasmine.Ajax.requests.mostRecent().respondWith({
        "status": 400,
        "contentType": 'text/xml',
        "responseText": fixtures.cts5.repo
      });
      expect(successFN).not.toHaveBeenCalled();
    });

    it("should have inventory with label and key (Without data loaded)", function() {
      expect(Object.keys(repo.inventory)).toContain("sparrow");
      expect(repo.inventory.sparrow).toContain("sparrow");
    });
    it("should have inventories object when data are loaded", function() {
      jasmine.Ajax.requests.mostRecent().respondWith({
        "status": 200,
        "contentType": 'text/xml',
        "responseText": fixtures.cts5.repo
      });
      expect(Object.keys(repo.inventories)).toContain("sparrow");
    });

  });
  
  describe("getRaw, function for simplification of data", function () {
    /** 
     * Fixtures
     **/
    beforeEach(function() {
        repo = new CTS.repository.repository("http://localhost", 5) 
        jasmine.Ajax.install();
        repo.addInventory("sparrow");
        repo.load();
        jasmine.Ajax.requests.mostRecent().respondWith({
          "status": 200,
          "contentType": 'text/xml',
          "responseText": fixtures.cts5.repo
        });

    });
    afterEach(function() {
        jasmine.Ajax.uninstall();
    });

    it('should have the basic level as textGroups titles', function(){
      var data = repo.inventories.sparrow.getRaw();
      var textgroups = Object.keys(data);
      expect(textgroups).toEqual(["Virgil", "Ovid", "Lucan"]);
    });

    it('should have a level n + 1 in Virgil being its works title', function(){
      var data = repo.inventories.sparrow.getRaw();
      var work = Object.keys(data.Virgil);
      expect(work).toEqual(["Aeneid"]);
    });

    it('should have a level n + 1 in Virgil being its works title', function(){
      var data = repo.inventories.sparrow.getRaw();
      var work = Object.keys(data.Virgil);
      expect(work).toEqual(["Aeneid"]);
    });
    
    it('should have a level n + 2 in Virgil being type of works', function(){
      var data = repo.inventories.sparrow.getRaw();
      var work = Object.keys(data.Virgil.Aeneid);
      expect(work).toEqual(["edition", "translation"]);
    });
    
    it('should have a level n + 2 with theoretical text', function(){
      var data = repo.inventories.sparrow.getRaw("eng", true);
      var work = Object.keys(data.Virgil.Aeneid);
      expect(work).toEqual(["edition", "translation", "theoretical"]);
    });
    
    it('should have a level n + 3  being editions', function(){
      var data = repo.inventories.sparrow.getRaw();
      var work = Object.keys(data.Virgil.Aeneid.edition);
      expect(work).toEqual(["Aeneid"]);
    });
    
    it('should have a level n + 4  being editions/translation object', function(){
      var data = repo.inventories.sparrow.getRaw();
      var work = Object.keys(data.Virgil.Aeneid.edition);
      expect(work).toEqual(["Aeneid"]);
      expect(instanceOf(data.Virgil.Aeneid.edition.Aeneid, CTS.repository.Prototypes.Text)).toBe(true);
    });
    
    it('should return given language when specified', function(){
      var data = repo.inventories.sparrow.getRaw("fre");
      var work = Object.keys(data);
      expect(work).toEqual(["Virgile", "Ovid", "Lucan"]);
    });

  });

  describe('CTS5-Text ', function(){

    beforeEach(function() {
        repo = new CTS.repository.repository("http://localhost", 5) 
        jasmine.Ajax.install();
        repo.addInventory("sparrow");
        repo.load();
        jasmine.Ajax.requests.mostRecent().respondWith({
          "status": 200,
          "contentType": 'text/xml',
          "responseText": fixtures.cts5.repo
        });
        text = repo.inventories.sparrow.getRaw("eng").Virgil.Aeneid.edition.Aeneid;
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
      var label = text.getTitle();
      expect(label).toBeDefined();
      expect(label).toBe("Aeneid");
    });

    it('should return other language label', function(){
      var label = text.getTitle("fre");
      expect(label).toBe("Énéide")
    });

    it('should return default language label when one does not existing', function(){
      var label = text.getTitle("nonExistingLanguage");
      expect(label).toBe("Aeneid")
    });

    it('should have at least one description', function(){
      var desc = text.getDesc();
      expect(desc).toBeDefined();
      expect(desc).toEqual("Perseus:bib:oclc,22858571, Vergil. Bucolics, Aeneid, and Georgics Of Vergil. J. B. Greenough. Boston. Ginn and Co. 1900.");
    });

    it('should return other language description', function(){
      var desc = text.getDesc("fre");
      expect(desc).toEqual("Perseus:bib:oclc,22858571, Vergil. Bucoliques, Énéide, and Géorgiques Of Vergil. J. B. Greenough. Boston. Ginn and Co. 1900.")
    });

    it('should return default language description when one does not exist', function(){
      var desc = text.getDesc("nonExistingLanguage");
      expect(desc).toEqual("Perseus:bib:oclc,22858571, Vergil. Bucolics, Aeneid, and Georgics Of Vergil. J. B. Greenough. Boston. Ginn and Co. 1900.")
    });
    
  });
  
  describe('CTS5-TextGroup ', function(){

    beforeEach(function() {
        repo = new CTS.repository.repository("http://localhost", 5) 
        jasmine.Ajax.install();
        repo.addInventory("sparrow");
        repo.load();
        jasmine.Ajax.requests.mostRecent().respondWith({
          "status": 200,
          "contentType": 'text/xml',
          "responseText": fixtures.cts5.repo
        });
        textgroup = repo.inventories.sparrow.textgroups[0];

    });
    afterEach(function() {
        jasmine.Ajax.uninstall();
    });

    it('should have an URN', function(){
      expect(textgroup.urn).toEqual("urn:cts:latinLit:phi0690");
    });

    it('should have at least one label', function(){
      var label = textgroup.getTitle();
      expect(label).toBeDefined();
      expect(label).toBe("Virgil");
    });

    it('should return other language label', function(){
      var label = textgroup.getTitle("fre");
      expect(label).toBe("Virgile")
    });

    it('should return default language label when one does not existing', function(){
      var label = textgroup.getTitle("nonExistingLanguage");
      expect(label).toBe("Virgil")
    });

    it('should have children Works', function(){
      var label = textgroup.works;
      expect(label.length).toEqual(1)
    });

  });
  
  describe('CTS5-Work ', function(){

    beforeEach(function() {
        repo = new CTS.repository.repository("http://localhost", 5) 
        jasmine.Ajax.install();
        repo.addInventory("sparrow");
        repo.load();
        jasmine.Ajax.requests.mostRecent().respondWith({
          "status": 200,
          "contentType": 'text/xml',
          "responseText": fixtures.cts5.repo
        });
        work = repo.inventories.sparrow.textgroups[0].works[0];

    });
    afterEach(function() {
        jasmine.Ajax.uninstall();
    });

    it('should have an URN', function(){
      expect(work.urn).toEqual("urn:cts:latinLit:phi0690.phi003");
    });

    it('should have a lang', function(){
      expect(work.lang).toEqual("lat");
    });

    it('chould be converted to a theoretical object', function(){
      var theoretical = work.toTheoretical()
      expect(theoretical.urn).toEqual(work.urn);
      expect(theoretical.lang).toEqual(work.lang);
      expect(theoretical.getTitle()).toEqual(work.getTitle());
    });

    it('should have at least one label', function(){
      var label = work.getTitle();
      expect(label).toBeDefined();
      expect(label).toBe("Aeneid");
    });

    it('should return other language label', function(){
      var label = work.getTitle("fre");
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

  describe('CTS5-Translation and CTS5-Edition', function() {

    beforeEach(function() {
        repo = new CTS.repository.repository("http://localhost") 
        jasmine.Ajax.install();
        repo.addInventory("sparrow");
        repo.load();
        jasmine.Ajax.requests.mostRecent().respondWith({
          "status": 200,
          "contentType": 'text/xml',
          "responseText": translationRepo
        });
        work = repo.inventories.sparrow.textgroups[0].works[0];

    });
    afterEach(function() {
        jasmine.Ajax.uninstall();
    });

    describe("Translation", function() {
      it("should have a lang", function() {
        expect(work.translations[0].lang).toEqual("eng")
      })
    })
    describe("Edition", function() {
      it("should have a lang", function() {
        expect(work.editions[0].lang).toEqual("lat")
      })
      it("should have the lang of the parent", function() {
        expect(work.editions[0].lang).toEqual(work.editions[0].lang)
      })
    })
  })

  describe('Helpers', function(){
    //jsonInventory
    it("should create an object from JSON", function() {
      repo = new CTS.repository.repository("http://localhost", 5) 
      repo.fromObject(fixtures.cts5.json);
      expect(repo.inventories.sparrow.getRaw()).toBeDefined();
      expect(repo.inventories.sparrow.getRaw().Lucan["Civil War"].edition.Pharsalia.getTitle()).toEqual("Pharsalia");
    })
  });
  
});
