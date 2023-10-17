// ==UserScript==
// @name         FreedCamp - Nicer copyable links
// @namespace    https://github.com/hash-bang/tampermonkey
// @version      0.4
// @description  Copy full issue links in FreedCamp instead of just the title
// @author       Matt Carter <m@ttcarter.com>
// @match        https://freedcamp.com/*
// @updateURL    https://raw.githubusercontent.com/hash-bang/tampermonkey/master/freedcamp-nicer-copyable-links.user.js
// ==/UserScript==

(function() {
	'use strict';
	function fcCopyReference() {
		var issue = { // Details about this issue
			id: $('.ItemViewFields--fk-ItemViewField-Container:last-child > .ItemViewFields--fk-ItemViewField-Value').text(),
			title: $('.ItemCommentsPage--fk-ItemCommentsPage-Content .ItemViewSubheader--fk-ItemBasicFields-Title').text(),
			url: window.location.href,
		};

		if (!issue.id) return alert('Cannot find FreedCamp issue within page');

		var html =
			'<div>'
				+ `<a href="${issue.url}">`
					+ issue.id
				+ '</a>'
				+ ' - '
				+ issue.title
			+ '</div>';

		navigator.clipboard.write([
			new ClipboardItem({
				'text/plain': new Blob([$(html).text()], {type: 'text/plain'}), // Create plain-text version without HTML
				'text/html': new Blob([html], {type: 'text/html'}),
			})
		]);
	}

	$('body').on(
		'click',
		'.ItemCommentsPage--fk-ItemCommentsPage-Content .EditableContentLink--fk-EditableContentLink-CopyIcon',
		e => {
			console.log('INTERCEPT COPY');
			fcCopyReference();
		});

	console.log('%cFreedCamp - Nicer copyable links', 'color: blue', 'Started');
})();
