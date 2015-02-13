Adding a new CTS.XSLT implementation
===

Fork, branch and propose by PR. But before PRequesting, here are some tips !

## Code it
XSLT are really "simple" to implement. You will have to use the prototype most of the time and just declare options :

```javascript
CTS.xslt.stylesheets["name of plugin"] = function(endpoint, options) {
  //We call the prototype
  CTS.xslt.XSLT.call(this, endpoint, options);
  this.options = {
    "e_lang" : { 
      //Type can be string or boolean
      "type" : "string",
      //html can be textarea, checkbox, hidden or input(for input[type="text"])
      "html" : "input",
      //Default can be a function, anonymous function, a string, a boolean or simply not exist !
      "default" : "lat"
    }
  }
}
//Then we need to create the prototype
CTS.xslt.stylesheets["name of plugin"].prototype = Object.create(CTS.xslt.XSLT)
```
[Example](../../src/xslt/llt.segtok_to_tb.js)

You can also overwrite prototypes methods after the call. See [CTS.XSLT abstraction code](../../src/modules/xslt.js)

## Add tests
For now, tests are limited to just checking in `spec/javascripts/modules/cts.xslt.specs.js` that the service is available. In the following describe :
```javascript
describe("Available plugins should be registered", function() {
});
```
Add a test like the following :
```javascript
it("should have (Name of your XSLT Plugin)", function() {
  expect(CTS.xslt.stylesheets["Name of your XSLT Plugin"]).toBeDefined();
})
```

## I18n it !

If you want your plugin to be available in jQuery or any other libraries, it would be cool that you offer at least one language. To do so, create for each options field an entry in an i18n file, such as [the English language one](../../src/i18n/en.js). Follow the template `nameoftheplugin.fieldname` for keys. Example for llt.segtok_to_tb :

```javascript
"llt.segtok_to_tb" : "Treebank Parameters",
"llt.segtok_to_tb.e_lang" : "Language",
"llt.segtok_to_tb.e_format" : "Treebank grammar",
"llt.segtok_to_tb.e_docuri" : "Document URI",
"llt.segtok_to_tb.e_agenturi" : "Agent URI",
"llt.segtok_to_tb.e_appuri" : "Application URI",
"llt.segtok_to_tb.e_datetime" : "Date",
"llt.segtok_to_tb.e_collection" : "Collection",
"llt.segtok_to_tb.e_attachtoroot" : "Attach to the root", 
```


## Document it 
Create a new document in `doc/xslt/` with the name of your plugin. Add the link to the [README.md](../../README.md) markdown file 

```
##Relevant links
- [Capitains Sparrow Implementation Source](../../src/xslt/newXSLT.js)
- [XSLT File](URI To an example of the XSLT File)

##Parameters

| Parameter name         | Type    | Default  | HTML Embodiement   | Description            |  
| ---------------------- | ------- | -------- | ---------          | ---------------------- |  
| e_lang                 | string  | lat      | input[type="text"] | Input language         |  
```
[Example](./llt.segtok_to_tb.md)