Latin Language Toolkit Tokenizer Output to OA Treebank XML XSLT implementation
===

##Relevant links

- [LLT Tokenizer](https://github.com/latin-language-toolkit/llt-tokenizer)
- [LLT API](https://github.com/latin-language-toolkit/llt)
- [Capitains Sparrow Implementation Source](../../src/xslt/llt.segtok_to_tb.js)
- [XSLT File](https://github.com/alpheios-project/treebank-editor/blob/master/db/xslt/segtok_to_tb.xsl)


##Parameters

| Parameter name         | Type    | Default                                    | HTML Embodiement       | Description                                  |  
| ---------------------- | ------- | --------                                   | ---------              | ----------------------                       |  
| e_lang                 | string  | lat                                        | input[type="text"]     | Input language                               |  
| e_format               | string  | aldt                                       | input[type="text"]     | Grammar used for Treebank                    |  
| e_docuri               | string  |                                            | input[type="text"]     | URI of the source document (For OA sourcing) |  
| e_agenturi             | string  | http://services.perseids.org/llt/segtok    | input[type="text"]     | Agent of Tokenization                        |  
| e_appuri               | string  |                                            | input[type="text"]     | Application used (OA related)                |  
| e_datetime             | string  | Anonymous function return current DateTime | input[type="hidden"]   | Date/Time of creation                        |  
| e_collection           | string  | urn:cite:perseus:lattb                     | input[type="text"]     | Output CTS collection for the treebank       |  
| e_attachtoroot         | boolean | false                                      | input[type="checkbox"] | Attach unannotated tokens to the root        |  
