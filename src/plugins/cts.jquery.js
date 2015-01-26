(function (factory) {
	if (typeof define === "function" && define.amd) {
	// AMD. Register as an anonymous module.
		define(["jquery", "cts"], factory);
	} else {
		factory(jQuery, CTS);
	}
}(function($, CTS) {
	var $name = "jQuery.cts";
	var $default = { //Default Params
		"repository" : "http://www.perseus.tufts.edu/hopper/CTS",	//URL of the repository CTS endpoint
		"inventoryName" : null,
		"version" : 3, // Version of CTS
		"namespace" : "http://chs.harvard.edu/xmlns/cts3/ti", //Namesp
		"lang" : "en"
	};
	var $lang = {};

	function Plugin ( element, options ) {
		this.element = $(element);
		// jQuery has an extend method which merges the contents of two or
		// more objects, storing the result in the first object. The first object
		// is generally empty as we don't want to alter the default options for
		// future instances of the plugin
		this.settings = $.extend( {}, $default, options );
		this._name = $name;

		this.blocks = []; //Dom Set of the original elements

		if($this.settings["lang"] in $lang) {
			this.lang = $lang[this.settings["lang"]];
		} else {
			this.lang = $lang["en"];
		}

		this.repository = null;

		this.init();
	}

	$.extend(Plugin.prototype, {
		init: function () {

			var self = this,
				url = this.settings["repository"] + "?request=GetCapabilities";

			if(this.settings["inventoryName"] !== null) {
				url += "&inv=" + this.settings["inventoryName"];
			}

			this.repository = CTS.repository(this.version);
			this.repository.load(
				url, 
				this.generate
			);
		},
		generate : function () {
			var data = this.repository.data;
			if(data.length > 1) { // If we have more than one inventory, we must add a select for TextInventory

			}

			//Add a select for TextGroup
			//Add a select for Work
			//Add a select for Text(Edition/Translation)
			//Add boxes for GetPassage
			//Create on changes.
		}
	});
});