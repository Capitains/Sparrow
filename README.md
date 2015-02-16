Capitains Sparrow 
===

[![Build Status](https://travis-ci.org/PerseusDL/Capitains-Sparrow.svg)](https://travis-ci.org/PerseusDL/Capitains-Sparrow)

# About
This software has been developed by @PerseusDL team to provide a simple and ready to use Javascript abstraction/implementation of the CTS norm. On the road leading to the CTS abstraction, we thought it might be nice to provide ready-to-use plugins for various uses and various libraries.

To build the compressed files, in a terminal, in the root of this repository:

```shell
npm install
grunt build
```

# Plugins/Modules

- [I18n plugin](./doc/i18n.md)

# Integrated plugins and relevant documentation

## Services

- [LLT.Tokenizer](./doc/services/llt.tokenizer.md) : A Service implementation for the Latin Language Toolkit Tokenizer API (Support more than Latin language !)
- [Add your own](./doc/services/new.md)

## XSLT

- [LLT.Segtok_to_tb](./doc/xslt/llt.segtok_to_tb.md) : An xslt which transform a tokenized output of LLT.Tokenizer to an OpenAnnotation Treebank XML layout
- [Add your own](./doc/xslt/new.md)

## jQuery

- [jQuery.cts.selector](./doc/plugins/jquery.cts.selector.md) : A way to browse and construct an URN using `<select />`
- [jQuery.cts.typeahead](./doc/plugins/jquery.cts.typeahead.md) : A way to search for an edition or translation
- [jQuery.cts.service](./doc/plugins/jquery.cts.service.md) : A way to embed service parameters and form in your html
- [jQuery.cts.xslt](./doc/plugins/jquery.cts.xslt.md) : A way to embed XSLT parameters and form in your html and transform the text