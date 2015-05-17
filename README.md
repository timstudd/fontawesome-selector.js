fontawesome-selector
====================

Font Awesome Selector is a very light-weight jQuery plugin for selecting/choosing/picking Font Awesome icons.

Usage
-----
	<script src="fontawesome-selector.min.js"></script>

	<script>
		$('i').faSelector();

		var someIconHolder = $('<div/>').appendTo('body');
		$('input').faSelector({
			stylesheet: 'fa.css',
			targets: [this, '#my-Icon', someIconHolder]
		});
	</script>

Options
-------

stylesheet: A string with the name (can be partial) of the Font Awesome stylesheet, default: 'font-awesome.'

targets: An array of elements or query selectors to update with changes, default: [this]

Advantages
----------

* Very light weight at ~4.5kb
* Only one file
* No dependencies
* Not version tied: does not require a re-build or update to use with new versions of Font Awesome

Disadvantages
-------------

FontAwesome.css must be on the same domain: this plugin works by inspecting the FA stylesheet for icons.  This means that the script is not tied to a specific version of FA and will not need to be updated along with FA.  It also means that the script can be very light weight as it does not need to statically include the selectors of all of the available icons.  For security reasons, however, CSS rules in stylesheets from different origins cannot be accessed.
