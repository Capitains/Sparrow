Capitains Sparrow 
===

[![Build Status](https://travis-ci.org/Capitains/Sparrow.svg)](https://travis-ci.org/Capitains/Sparrow)
[![Bower version](https://badge.fury.io/bo/capitains-sparrow.svg)](http://badge.fury.io/bo/capitains-sparrow)
[![npm version](https://badge.fury.io/js/capitains-sparrow.svg)](http://badge.fury.io/js/capitains-sparrow)

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


# Releasing

Sparrow packages are registered as [npm](https://docs.npmjs.com/getting-started/publishing-npm-packages) and  [bower](http://bower.io/docs/creating-packages/) packages.  The release process is follows:

1. Update the release version in bower.json and package.json
1. `grunt build` 
1. commit the updated json and package files and push to github
1. `grunt page` to update the gh-pages branch with latest code documentation
1. Using the GitHub interface create a new release tag and release notes.
1. `npm publish` to publish the new release to NPM (Bower is published automatically from GitHub)
