jQuery CTS Service 
===

In all example and documentation, "target element" or $(target) is the element on which ctsService have been started. To start a service on a given container - thus filling it with the form -, use the following expression : `$(element).ctsService(serviceName, options)`

## Services

See implemented services documentations.

## API

- `$(target).ctsService(serviceName, "getValues")` : returns a dictionary representing the form

## Events

| Name                   | Description
|-------------------------------|---------------------------------
| cts-service:serviceName:doing | Before sending request to service naed "serviceName"
| cts-service:serviceName:done  | When sending request to service named "serviceName" is done

## Options
| Key              | type           | Default       | Informations
| ---------------- | -------------- | ------------- | -----------------------------------
| trigger          | string         | null          | Send request when trigger is trigger on target element
| click            | string,element | false         | Send request when click is triggered on given element
| DOM              | dictionary     | {}            | Instead of generating DOM, reuse an element in the DOM for a given parameter
| defaults         | dictionary     | {}            | Override a default value of the service
| names            | dictionary     | {}            | When generating DOM inputs, give to a field a given name.
| show             | boolean,string | true          | Hide/Show the element. If a string, $(target).trigger(the string) will toggle the visibility of the form
| callback         | function       | null          | Function to call on service calling. Response from ajax request is passed as data to the callback function


## CSS custom classes

Because so many plugins force you to dig the code or extend your already existing CSS classes, we thought it might be cool to give you the availability to add your own classes to **all the generated DOM elements !**. To do so, when passing your `option` object to the constructor, add the `css` dictionary, where keys are identifier described below and value a list of classes (**WITHOUT THE DOT**).

|      Identifier          |  Automatic class                   | Description
|--------------------------|------------------------------------|--------------
| container                | `["cts-service"]`                  | Container for all the generated DOM (`<fieldset />`)
| container-legend         | `["cts-service-legend"]`           | Container for the title of the service (`<legend />`)
|                          |                                    |
| field-container          | `[]`                               | `<div />` containing a field
| field-label              | `[]`                               | `<Label />` of the field
| field-input-container    | `[]`                               | `<div />` wrapping the input inside the field-container
| field-text               | `[]`                               | Classes for `<input type="text" />`
| field-checkbox           | `[]`                               | Classes for `<input type="checkbox" />`
| field-textarea           | `[]`                               | Classes for `<textarea />`

## Example 

```html
<html>
<head>
<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<script type="text/javascript" src="../src/cts.js"></script>
<script type="text/javascript" src="../src/modules/utils.js"></script>
<script type="text/javascript" src="../src/modules/i18n.js"></script>
<script type="text/javascript" src="../src/modules/service.js"></script>
<script type="text/javascript" src="../src/i18n/en.js"></script>
<!-- Dependencies -->
<script type="text/javascript" src="../node_modules/jquery/dist/jquery.min.js"></script>
<!-- Plugins using dependencies -->
<script type="text/javascript" src="../src/plugins/jquery.cts.service.js"></script>
<script type="text/javascript">
	$(document).ready(function() {
		$("#lltTokenizer").ctsService("llt.tokenizer", {
			"endpoint" : "http://services.perseids.org/llt/segtok",
			"DOM" : {
				"text" : $(".TEItext")
			},
			"click" : ".button",
			"trigger" : "tokenize!",
			"callback" : function(data) {
				console.log(data);
				$(".TEItext").val(data);
			},
			"show" : "SHOW_ME_THE_GONDOR"
		});
		$("#lltTokenizer").on("cts-service:llt.tokenizer:done", function() {
			//console.log(data);
		});
		$(".toggle_button").on("click", function(e) {
			e.preventDefault();
			$("#lltTokenizer").trigger("SHOW_ME_THE_GONDOR");
		});
	});
</script>
</head>
<body>
<button class="button">Click me !</button> 
<button class="toggle_button">Toggle me !</button>
<div id="lltTokenizer"></div>
<!--
	<textarea class="TEItext" style="width:100%; height:100px;"></textarea>
	<input type="text" value="Target" class="target" style="width:100%;" />
	<p></p>
	<textarea class="TEItext2" style="width:100%; height:100px;"></textarea>
	<input type="text" value="Target" class="target2" style="width:100%;" />
-->
	<textarea class="TEItext" style="width:100%; height:300px;"><?xml version="1.0" encoding="UTF-8"?>
<GetPassage xmlns="http://chs.harvard.edu/xmlns/cts3">
    <request>
        <requestName>GetPassage</requestName>
        <requestUrn>urn:cts:greekLit:tlg0019.tlg007.perseus-grc2:1-6</requestUrn>
        <psg>1-6</psg>
        <workurn>urn:cts:greekLit:tlg0019.tlg007.perseus-grc2</workurn>
        <groupname xml:lang="en">Aristophanes</groupname>
        <title xml:lang="eng">Lysistrata</title>
        <label xml:lang="eng">Lysistrata</label>
    </request>
    <reply>
        <passage>
            <TEI xmlns="http://www.tei-c.org/ns/1.0">
                <teiHeader type="text">
                    <fileDesc>
                        <titleStmt>
                            <title type="work" n="Lys.">Lysistrata</title>
                            <title type="sub">Machine readable text</title>
                            <author n="Aristoph.">Aristophanes</author>
                            <editor role="editor" n="OCT">F.W. Hall and W.M. Geldart</editor>
                            <sponsor>Perseus Project, Tufts University</sponsor>
                            <principal>Gregory Crane</principal>
                            <respStmt>
                                <resp>Prepared under the supervision of</resp>
                                <name>Lisa Cerrato</name>
                                <name>William Merrill</name>
                                <name>Elli Mylonas</name>
                                <name>David Smith</name>
                            </respStmt>
                            <funder n="org:AnnCPB">The Annenberg CPB/Project</funder>
                        </titleStmt>
                        <extent>About 145Kb</extent>
                        <publicationStmt>
                            <publisher>Trustees of Tufts University</publisher>
                            <pubPlace>Medford, MA</pubPlace>
                            <authority>Perseus Project</authority>
                        </publicationStmt>
                        <sourceDesc>
                            <biblStruct>
                                <monogr>
                                    <author>Aristophanes</author>
                                    <title>Aristophanes Comoediae, ed. F.W. Hall and W.M. Geldart, vol.
							2</title>
                                    <editor role="editor">F.W. Hall and W.M. Geldart</editor>
                                    <imprint>
                                        <pubPlace>Oxford</pubPlace>
                                        <publisher>Clarendon Press, Oxford</publisher>
                                        <date>1907</date>
                                    </imprint>
                                </monogr>
                            </biblStruct>
                        </sourceDesc>
                    </fileDesc>
                    <encodingDesc>
                        <refsDecl>
                            <refState unit="line"/>
                        </refsDecl>
                    </encodingDesc>
                    <profileDesc>
                        <langUsage>
                            <language ident="grc">Greek</language>
                        </langUsage>
                    </profileDesc>
                    <revisionDesc>
                        <change who="Bridget Almas">
                            <date>2014-06-09</date>
				Converted from TEI edition at https://github.com/PerseusDL/canonical/blob/master/CTS_XML_TEI/perseus/greekLit/tlg0019/tlg006/tlg0019.tlg007.perseus-grc1.xml
				Conversion involved: converting speaker tags to said tags, adding line numbers, converting div1 and div2 to divs.				
			</change>
                    </revisionDesc>
                </teiHeader>
                <text xml:lang="grc">
                    <body>
                        <div type="edition" xml:lang="grc" n="urn:cts:greekLit:tlg0019.tlg007.perseus-grc2">
                            <div type="textpart" subtype="Prologue">
                                <said who="#Λυσιστράτη">
                                    <l n="1">ἀλλʼ εἴ τις ἐς Βακχεῖον αὐτὰς ἐκάλεσεν,</l>
                                </said>
                            </div>
                        </div>
                    </body>
                </text>
            </TEI>
        </passage>
        <prevnext>
            <prev/>
            <next/>
        </prevnext>
        <subref xmlns=""/>
    </reply>
</GetPassage></textarea>
	</div>
</body>
</html>
```