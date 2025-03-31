// ==UserScript==
// @name         FreedCamp - Yes Ive donated
// @namespace    https://github.com/hash-bang/tampermonkey
// @version      0.1
// @description  Prevent the annoying modal popup asking for donations
// @author       Matt Carter <m@ttcarter.com>
// @match        https://freedcamp.com/*
// @updateURL    https://raw.githubusercontent.com/hash-bang/tampermonkey/master/freedcamp-yes-ive-donated.user.js
// ==/UserScript==

(function() {
    function throttle(cb, wait) {
		var throttleTimer;
		var reschedule = ()=> {
			clearTimeout(throttleTimer);
			throttleTimer = setTimeout(cb, wait);
		};

		return ()=> reschedule();
	};

    $('body').on('DOMSubtreeModified', throttle(()=> {
        $('.AgModal--fk-Modal-Underlay.fk-modal-underlay .AgShareFreedcamp--fk-AgShareFreedcamp-ModalBody')
            .closest('.AgModal--fk-Modal-Container')
            .find('.AgModal--fk-AgModal-Footer button.AgButton--fk-AgButton-Primary')
            .click();
    }, 250));
})();
