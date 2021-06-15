// ==UserScript==
// @name         FreedCamp - Annotated issue links
// @namespace    https://github.com/hash-bang/tampermonkey
// @version      0.4
// @description  Annotate all FreedCamp issue links with the status of the linked item
// @author       Matt Carter <m@ttcarter.com>
// @license      MIT
// @match        https://freedcamp.com/*
// @updateURL    https://raw.githubusercontent.com/hash-bang/tampermonkey/master/freedcamp-annotated-issue-links.user.js
// ==/UserScript==

(function() {
	'use strict';

	var options = {
		reviewAsCompleted: true, // Use the completed icon for "Review" issue statuses
		labelBugs: true, // Whether to add a small label after Bug type issues
	};


	function throttle(cb, wait) {
		var throttleTimer;
		var reschedule = ()=> {
			clearTimeout(throttleTimer);
			throttleTimer = setTimeout(cb, wait);
		};

		return ()=> reschedule();
	};

	function fcAnnotateLinks() {
		var issues = {}; // Hash of issues we are fetching

		console.log('%cFreedCamp - Annotated issue links', 'color: blue', 'Refresh', window.location.pathname);
		$('.ItemDescription--fkItemDescriptionContainer a')
			.each((index, a) => {
				var $a = $(a);
				var link = /https:\/\/freedcamp.com\/view\/(?<project>\d+)\/issuetracker\/(?<issue>\d+)$/.exec($a.attr('href') || '');
				if (!link) return; // Not an issue tracker link
				link = link.groups; // Default to using named groups

				if (!issues[link.issue]) // Queue up fetcher promise if it doesn't already exist
					issues[link.issue] = fetch(`https://freedcamp.com/iapi/issues/${link.issue}`)
						.then(res => res.json())
						.then(res => res.data && res.data.issues && res.data.issues[0])
						.then(res => res || Promise.reject(`Cannot fetch issue "${link.issue}"`))

				issues[link.issue]
					.then(issue => {
						if (options.reviewAsCompleted && issue.status_title == 'Review') issue.status_title = 'Completed';

						switch (issue.status_title) {
							case 'Completed':
								$a.prepend('<svg class="fkail-icon fkIconClass Icon--fk-Icon Icon--Icon--fk-Icon ProgressIcon--fk-ProgressIcon ProgressIcon--fkProgressIconComplete" width="1em" height="1em" viewBox="0 0 18 18" style="color: rgb(160, 166, 199);"><defs><path d="M8.354 0c4.606 0 8.354 3.748 8.354 8.354 0 4.606-3.748 8.354-8.354 8.354C3.748 16.708 0 12.96 0 8.354 0 3.748 3.748 0 8.354 0z" id="a"></path><filter x="-14.7%" y="-14.7%" width="129.5%" height="129.5%" filterUnits="objectBoundingBox" id="b"><feGaussianBlur stdDeviation="1.5" in="SourceAlpha" result="shadowBlurInner1"></feGaussianBlur><feOffset dy="1" in="shadowBlurInner1" result="shadowOffsetInner1"></feOffset><feComposite in="shadowOffsetInner1" in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowInnerInner1"></feComposite><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0" in="shadowInnerInner1"></feColorMatrix></filter></defs><g transform="translate(.6 .6)" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g opacity="0.5" fill-rule="nonzero"><use fill="#27AE60" xlink:href="#a"></use><use fill="#000" filter="url(#b)" xlink:href="#a"></use><use stroke="#27AE60" stroke-width="0.928200009" xlink:href="#a"></use></g><path fill="#FFF" d="M7.30957507 11.9187843L3.74459089 8.35380008 5.22112505 6.87726592 7.30957507 8.96571594 11.4864751 4.7888159 12.9630093 6.26535006z"></path></g></svg>');
								break;
							case 'InProgress':
								$a.prepend('<svg class="fkail-icon fkIconClass Icon--fk-Icon Icon--Icon--fk-Icon ProgressIcon--fk-ProgressIcon" width="1em" height="1em" viewBox="0 0 16 16" style="color: rgb(160, 166, 199);"><g fill-rule="nonzero" fill="none"><path d="M15.25 8a7.227 7.227 0 0 1-2.126 5.124A7.227 7.227 0 0 1 8 15.25a7.227 7.227 0 0 1-5.124-2.126A7.227 7.227 0 0 1 .75 8c0-1.999.813-3.811 2.126-5.124A7.227 7.227 0 0 1 8 .75c1.999 0 3.811.813 5.124 2.126A7.227 7.227 0 0 1 15.25 8z" stroke="#FF8900" stroke-width="1.5"></path><path d="M7.924 2.641a5.289 5.289 0 0 1 5.283 5.283 5.255 5.255 0 0 1-1.058 3.168L7.924 7.924z" class="inProgressInner" fill="#FF8900"></path></g></svg>');
								break;
							case 'Invalid':
								$a.prepend('<svg class="fkail-icon fkIconClass Icon--fk-Icon Icon--Icon--fk-Icon ProgressIcon--fk-ProgressIcon" width="1em" height="1em" viewBox="0 0 16 16" style="color: rgb(160, 166, 199);"><g fill-rule="nonzero" fill="none"><path d="M15.25 8a7.227 7.227 0 0 1-2.126 5.124A7.227 7.227 0 0 1 8 15.25a7.227 7.227 0 0 1-5.124-2.126A7.227 7.227 0 0 1 .75 8c0-1.999.813-3.811 2.126-5.124A7.227 7.227 0 0 1 8 .75c1.999 0 3.811.813 5.124 2.126A7.227 7.227 0 0 1 15.25 8z" stroke="#ED7762" stroke-width="1.5"></path><circle fill="#ED7762" opacity="0.417" cx="8" cy="8" r="5"></circle></g></svg>');
								break;
							case 'Open':
								$a.prepend('<svg class="fkail-icon fkIconClass Icon--fk-Icon Icon--Icon--fk-Icon ProgressIcon--fk-ProgressIcon" width="1em" height="1em" viewBox="0 0 16 16" style="color: rgb(160, 166, 199);"><g fill-rule="nonzero" fill="none"><path d="M15.25 8a7.227 7.227 0 0 1-2.126 5.124A7.227 7.227 0 0 1 8 15.25a7.227 7.227 0 0 1-5.124-2.126A7.227 7.227 0 0 1 .75 8c0-1.999.813-3.811 2.126-5.124A7.227 7.227 0 0 1 8 .75c1.999 0 3.811.813 5.124 2.126A7.227 7.227 0 0 1 15.25 8z" stroke="#ADB9CC" stroke-width="1.5"></path><circle fill="#ADB9CC" opacity="0.417" cx="8" cy="8" r="5"></circle></g></svg>');
								break;
							case 'Review':
								$a.prepend('<svg class="fkail-icon fkIconClass Icon--fk-Icon Icon--Icon--fk-Icon ProgressIcon--fk-ProgressIcon" width="1em" height="1em" viewBox="0 0 16 16" style="color: rgb(160, 166, 199);"><g fill-rule="nonzero" fill="none"><path d="M15.25 8a7.227 7.227 0 0 1-2.126 5.124A7.227 7.227 0 0 1 8 15.25a7.227 7.227 0 0 1-5.124-2.126A7.227 7.227 0 0 1 .75 8c0-1.999.813-3.811 2.126-5.124A7.227 7.227 0 0 1 8 .75c1.999 0 3.811.813 5.124 2.126A7.227 7.227 0 0 1 15.25 8z" stroke="#B3ABF9" stroke-width="1.5"></path><path d="M8 11.5c2.031 0 3.611-1.808 4.288-2.858a1.17 1.17 0 0 0 0-1.342C11.611 6.308 10.031 4.5 8 4.5S4.389 6.308 3.712 7.358c-.283.409-.283.934 0 1.284C4.389 9.692 5.969 11.5 8 11.5zm0-5.25c.96 0 1.693.758 1.693 1.75S8.959 9.75 8 9.75c-.96 0-1.693-.758-1.693-1.75S7.041 6.25 8 6.25z" fill="#C3BDFA"></path></g></svg>');
								break;
							default:
								console.log('Unknown issue status type:', issue.status_title);
						}

						if (options.labelBugs && issue.type == 'Bug')
							$a.append('<span class="Tag--fk-Tag bug"><span class="Tag--fk-Tag-innerSpan">Bug</span></span>');
					});
			})
	}

	var lastLink; // Link we were viewing
	$('#web-app-root, .Drawer--fk-Drawer, .DropFiles--fk-DropFiles-Area-Content').on('DOMSubtreeModified', throttle(()=> {
		if ($('.ItemViewContent--fk-ItemViewContent-Description').hasClass('fc-annotated')) return; // Already annotated
		lastLink = window.location.pathname;
		fcAnnotateLinks();
		$('.ItemViewContent--fk-ItemViewContent-Description').addClass('fc-annotated');
	}, 500));

	$('head')
		.append('<style type="text/css">'
			+ '.fkail-icon { display: inline-flex; vertical-align: middle; margin-right: 5px; }\n'
			+ '.Tag--fk-Tag.bug { padding: 0px 8px; margin-left: 5px; }\n'
			+ '</style>'
		);

	console.log('%cFreedCamp - Annotated issue links', 'color: blue', 'Started');
})();
