Latin Language Toolkit Tokenizer Service implementation
===

##Relevant links

- [LLT Tokenizer](https://github.com/latin-language-toolkit/llt-tokenizer)
- [LLT API](https://github.com/latin-language-toolkit/llt)
- [Capitains Sparrow Implementation Source](../../src/services/llt.tokenizer.js)


##Parameters

| Parameter name         | Type    | Default                     | Description 
| ---------------------- | ------- | --------                    | ----------------------
| xml                    | boolean | true                        | Wether or not text is XML
| inline                 | boolean | true                        | whether sentence id attributes should be added inline on the word ids
| splitting              | boolean | true                        | Split Enclytics
| merging                | boolean | false                       | Merge split words
| shifting               | boolean | false                       | Shift Enclytics
| text                   | xml     |                             | Text to tokenize
| remove_node            | list    |                             | List of nodes to remove from XML (Example : teiHeader,head,speaker,note,ref)
| go_to_root             | string  | TEI                         | Name of the root node
| ns                     | string  | http://www.tei-c.org/ns/1.0 | Namespace

##Not supported parameters

| Parameter name         | Type    | Default                     | Description 
| ---------------------- | ------- | --------                    | ----------------------
| uri                    | string  |                             | uri to retrieve text from (use instead of text) 
| newline_boundary       | int     | 1                           | number of new lines to consider breaking a segment