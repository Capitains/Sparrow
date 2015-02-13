Adding a new CTS.Service implementation
===

Fork, branch and propose by PR. But before PRequesting, here are some tips !

## Code it
Services are really "simple" to implement. You will have to use the prototype most of the time and just declare options :

```javascript
CTS.service.services["name of plugin"] = function(endpoint, options) {
  //We call the prototype
  CTS.service._service.call(this, endpoint, options);
  this.options = {
    "e_lang" : { 
      //Type can be string, boolean, list
      "type" : "string",
      //html can be textarea, checkbox, hidden or input(for input[type="text"])
      "html" : "input",
      //Default can be a function, anonymous function, a string, a boolean, a list or simply not exist !
      "default" : "lat"
    }
  }
}
//Then we need to create the prototype
CTS.service.services["name of plugin"].prototype = Object.create(CTS.service._service)
```
[Example](../../src/services/llt.tokenizer.js)

You can also overwrite prototypes methods after the call. See [CTS.Service abstraction code](../../src/modules/service.js)

## Add tests
For now, tests are limited to just checking in `spec/javascripts/modules/cts.service.specs.js` that the service is available. In the following describe :
```javascript
describe("Available plugins should be registered", function() {
});
```
Add a test like the following :
```javascript
it("should have (Name of your Service Plugin)", function() {
  expect(CTS.service.services["Name of your Service Plugin"]).toBeDefined();
})
```

## I18n it !

If you want your plugin to be available in jQuery or any other libraries, it would be cool that you offer at least one language. To do so, create for each options field an entry in an i18n file, such as [the English language one](../../src/i18n/en.js). Follow the template `nameoftheplugin.fieldname` for keys. Example for llt.tokenizer :

```javascript
"llt.tokenizer" : "Tokenizer parameters",
"llt.tokenizer.xml" : "XML Formatted input",
"llt.tokenizer.inline" : "?",
"llt.tokenizer.splitting" : "Split Enclytics",
"llt.tokenizer.merging" : "Merge split words",
"llt.tokenizer.shifting" : "Shift Enclytics",
"llt.tokenizer.text" : "Text to tokenize",
"llt.tokenizer.remove_node" : "Nodes to remove from XML",
"llt.tokenizer.go_to_root" : "Name of the root node",
"llt.tokenizer.ns" : "Namespace of the XML",
```

## Document it 
Create a new document in `doc/services/` with the name of your plugin. Add the link to the [README.md](../../README.md) markdown file 

```
##Relevant links
- [Capitains Sparrow Implementation Source](../../src/services/newService.js)
- [Service File](URI To an example of the Service Running or code base)

##Parameters

| Parameter name         | Type    | Default  | HTML Embodiement   | Description            |  
| ---------------------- | ------- | -------- | ---------          | ---------------------- |  
| e_lang                 | string  | lat      | input[type="text"] | Input language         |  
```

[Example](./llt.tokenizer.md)