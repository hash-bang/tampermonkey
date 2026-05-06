// ==UserScript==
// @name         FreedCamp - Nicer copyable links
// @namespace    https://github.com/hash-bang/tampermonkey
// @version      0.5
// @description  Copy full issue links in FreedCamp instead of just the title
// @author       Matt Carter <m@ttcarter.com>
// @match        https://freedcamp.com/*
// @updateURL    https://raw.githubusercontent.com/hash-bang/tampermonkey/master/freedcamp-nicer-copyable-links.user.js
// ==/UserScript==

(function() {
	'use strict';

	// Firefox blocks navigator.clipboard.write() in TamperMonkey contexts; fall back to
	// selecting a temporary off-screen element and using execCommand('copy').
	function legacyCopy(html) {
		var el = document.createElement('div');
		el.innerHTML = html;
		Object.assign(el.style, {position: 'fixed', left: '-9999px', top: '-9999px'});
		document.body.appendChild(el);
		var range = document.createRange();
		range.selectNodeContents(el);
		var sel = window.getSelection();
		sel.removeAllRanges();
		sel.addRange(range);
		document.execCommand('copy');
		sel.removeAllRanges();
		document.body.removeChild(el);
	}

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

		if (navigator.clipboard && window.ClipboardItem) {
			navigator.clipboard.write([
				new ClipboardItem({
					'text/plain': new Blob([$(html).text()], {type: 'text/plain'}),
					'text/html': new Blob([html], {type: 'text/html'}),
				})
			]).catch(() => legacyCopy(html));
		} else {
			legacyCopy(html);
		}
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
