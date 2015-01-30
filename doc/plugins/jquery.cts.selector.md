jQuery CTS Selector
===

[Back to the index](../README.md)

If you are looking for the CTS Search field, this is [here](./jquery.cts.typeahead.js.md). -If you are looking for droids, these are not the one you are looking for.

# Description

This plugins aims to provide a solid selector for passage or text in your front-end. Giving it a simple CTS API endpoint and one inventory to call, this plugin will generate for you, next to a given input, the whole DOM necessary for browsing your inventories !

![This ain't pretty but you can give it some css love yourself](./img/screenshot.jquery.cts.selector.png)

To use it, you will need to use compressed (or uncompressed) `cts.js`, 

```html
<!DOCTYPE html>
<html>
<head>
  <title>An example</title>
  <script type="text/javascript" src="../build/cts.min.js"></script>
  <script type="text/javascript" src="../build/i18n/en.min.js"></script>
  <script type="text/javascript" src="/path/to/jQuery.js"></script>
  <script type="text/javascript" src="../build/jquery.cts.selector.min.js"></script>
</head>
<body>

<script type="text/javascript">
  $(document).ready(function() {
    $(".target").ctsSelector({
      "endpoint" : "URL/exist/rest/db/xq/CTS.xq?",
      "version" : 3,
      "inventories" : {
        "annotsrc" : "Nice label for annotsrc",
        "pilots" : "Pilots"
      }
    });
  });

</script>
</body>
</html>
```

# Events

| Name                   | Description
|------------------------|---------------------------------
| cts-passage:retrieving | Before retrieving the passage, this event is triggered on the retrieve_scope, aka. settings["retrieve_scope"] or on the element targeted at the init phase (`$(".target")` in the example)
| cts-passage:retrieved  | After retrieving the passage, this event is triggered on the retrieve_scope, aka. settings["retrieve_scope"] or on the element targeted at the init phase (`$(".target")` in the example)

# Basic parameters

| Key            | Type              | Default | Required | Description
|----------------|-------------------|---------|----------|------------------
| endpoint       | string            |    ""   |    Yes   | CTS API endpoint (URI) finishing with "?"
| css            | object            |    {}   |          | See below [CSS custom classes](#css-custom-classes)
| version        | int               |    3    |          | Version of the CTS implementation (3 or 5)
| inventories    | object            |    {}   |    Yes   | Object where keys are inventory's name and value are label to show
| retrieve       | boolean or string | false   |          | If set to true, replace the content of plugin target by the plugins data on clicking retrieve. If it's a string, will use string as a jQuery selector to fill with retrieved passage
| retrieve_scope | null or string    | null    |          | Element to retrieve from retrieved passage

# CSS custom classes

Because so many plugins force you to dig the code or extend your already existing CSS classes, we thought it might be cool to give you the availability to add your own classes to **all the generated DOM elements !**. To do so, when passing your `option` object to the constructor, add the `css` dictionary, where keys are identifier described below and value a list of classes (**WITHOUT THE DOT**).

|      Identifier          |  Automatic class                   | Description
|--------------------------|------------------------------------|--------------
| container                | `["cts-selector"]`                 | Container for all the generated DOM
| retrieve-button          | `[]`                               | `<button />` used to retrieve passage
|                          |                                    |
| hidden-inventory         | `["cts-hidden-inventory"]`         | `<input[type="hidden"] />` containing inventory information
| select-inventory         | `["cts-selector-inventory"]`       | `<select />` containing inventory choices (None when there is only one inventory)
| select-textgroup         | `["cts-selector-textgroup"]`       | `<select />` containing textgroup choices
| select-work              | `["cts-selector-work"]`            | `<select />` containing work choices
| select-text              | `["cts-selector-text"]`            | `<select />` containing text choices (Edition, Translation, etc.)
| trigger-button           | `["cts-selector-trigger"]`         | `<button />` triggering change on select-text when needed.
|                          |                                    |
| citation-fieldset        | `["cts-selector-citation"]`        | `<Fieldset />` containing beginning or end passage selection's inputs
| citation-fieldset-legend | `[]`                               | `<Legend />` for the given fieldset
| citation-label           | `[]`                               | `<Label />` for one passage selection's input
| citation-input           | `["cts-selector-passage"]`         | `<Input />` for passage selection
| citation-input-container | `["cts-selector-input-container"]` | `<Div />` containing one input for passage selection