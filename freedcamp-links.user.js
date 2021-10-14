// ==UserScript==
// @name         FreedCamp - Links
// @namespace    https://github.com/hash-bang/tampermonkey
// @version      0.1
// @description  Make all Freedcamp links operate as simple links - no sidebars
// @author       Matt Carter <m@ttcarter.com>
// @license      MIT
// @match        https://freedcamp.com/*
// @updateURL    https://raw.githubusercontent.com/hash-bang/tampermonkey/master/freedcamp-links.user.js
// ==/UserScript==

(function() {
	var options = {
		logPrefix: ['%cFreedCamp - links', 'color: blue'],
		exclude: [ // Array<RegExp> - Prefix list of URLs to always open as standard links
			/^\/view\/.+?\/discussions\/.+?$/,
		],
	};

	$(document).on('click', 'a', e => {
		var $el = $(e.target);
		var linkTo = $el.attr('href');
		if (linkTo && options.exclude.some(e => e.test(linkTo))) {
			console.log(...options.logPrefix, 'Override link click and handle as standard');
			e.stopPropagation();
			e.preventDefault();
			window.location = linkTo;
		}
	})
})();
