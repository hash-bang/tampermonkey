// ==UserScript==
// @name         MS-Todo - No tooltips
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove the dummy-mode tooltips from Microsoft ToDo
// @author       Matt Carter <m@ttcarter.com>
// @match        https://to-do.live.com/tasks/*
// @icon         https://www.google.com/s2/favicons?domain=live.com
// @grant        GM_addStyle
// @updateURL    https://raw.githubusercontent.com/hash-bang/tampermonkey/master/ms-todo-no-tooltips.user.js
// ==/UserScript==

(function() {
	'use strict';

	GM_addStyle('.ms-Tooltip { display: none !important }');
})();
