//Initialization of test 
var jasmine = require("unit.js"),
  cts = require("../src/cts"),
  fs = require('fs'),
  oldXHR = cts.repository.xhr,
  path = require("path");
//Testing retriever
describe('Testing local', function(){

  beforeEach(function() {
    jasmine.Ajax.install();
  });

  afterEach(function() {
    jasmine.Ajax.uninstall();
  });

  //http://localhost:8080/exist/rest/db/repository/CTS.xq?request=GetCapabilities&inv=annotsrc
  it("should get to the url", function() {
    //test.should(cts.utils.xhr).be.Function;
    test.promisify(cts.repository.load);

    cts.repository.load(
      ["test_data/repo.xml"], 
      function() {
        test.object(cts.repository.data).isNotEmpty();
      }
    ).then(function (cts) {
      test.object(cts.repository.data).isNotEmpty();
    });
  });
})