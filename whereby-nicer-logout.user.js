// ==UserScript==
// @name         Whereby - Nicer logout screen
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove up-sells on the post-meeting screen
// @author       Matt Carter <m@ttcarter.com>
// @match        https://whereby.com/*
// @icon         https://www.google.com/s2/favicons?domain=whereby.com
// @updateURL    https://raw.githubusercontent.com/hash-bang/tampermonkey/master/whereby-nicer-logout.user.js
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// ==/UserScript==

(function() {
	'use strict';

	let meetingEnded = ()=> {
		// Fetch the Whereby button style from an existing button on-screen
		let prototypeButtonClasses = (document.querySelector('[class^="Button-"][class*="primary"]')?.classList || 'button').toString();

		$('[class^="RoomLeftLayout-"] > [class^="inner"]')
			.empty() // Remove existing child elements
			.css({ // Stretch main display area across screen height
				'height': '100%',
				'align-items': 'end',
			})
			.append( // Create 'New meeting' button
				$('<a>')
					.text('New meeting...')
					.addClass(prototypeButtonClasses)
					.on('click', ()=> window.location.reload())
			)
	};

	// Watch for "meeting has ended" div creation {{{
	let bodyObserver = new MutationObserver(()=> {
		if (document.querySelector('[class^="RoomLeftLayout-"]')) { // Found "has left room" element
			bodyObserver.disconnect();
			meetingEnded();
		}
	});
	bodyObserver.observe(document.body, {
		childList: true,
		subtree: true,
	});
	// }}}

})();
