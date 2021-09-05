// ==UserScript==
// @name         DarkReader
// @namespace    https://github.com/hash-bang/tampermonkey
// @version      0.1
// @description  DarkReader wrapper without the Chrome bloat
// @author       Matt Carter <m@ttcarter.com>
// @match        *://*/*
// @updateURL    https://raw.githubusercontent.com/hash-bang/tampermonkey/master/darkreader.user.js
// @require      https://cdn.jsdelivr.net/npm/darkreader@4.9.34/darkreader.min.js
// @run-at       document-end
// ==/UserScript==

(function() {
	'use strict';

	DarkReader.enable({
		brightness: 100,
		contrast: 90,
		sepia: 10,
	});
})();
