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

	const FRAME_DURATION = 1000 / 60;
	const SPEED = 1;
	let animatedLogo;
	let position = { x: 0, y: 0 };
	let maxWidth;
	let maxHeight;
	let lastFrameUpdate;
	let xDelta = SPEED; // +/- 1
	let yDelta = SPEED; // +/- 1

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

		// Background image
		$('[class*="bgImg-"]')
			.css({
				'filter': 'brightness(.66) blur(25px)',
				'height': 'calc(100vh + 40px)',
				'left': '-20px',
				'top': '-20px',
				'width': 'calc(100vw + 40px)',
			});

		// Background logo
		$('[class*="RoomBackground-"]')
			.append(
				$('<div>')
					.addClass('animated-logo')
					.css({
						'aspect-ratio': '948/1200',
						'background-image': `url("data:image/svg+xml,%3Csvg xmlns='http:%2F%2Fwww.w3.org%2F2000%2Fsvg' viewBox='0 0 108 138'%3E%3Cpath fill='%23f2f2f2' d='M107.8 96.7c-.6-1.8-2-3.4-4-4.1a9.4 9.4 0 0 0-3.7-.7v-3.5l-.1-.8.7-.6c1.4-1.4 1.3-2.9 1.2-4 0-1.1 0-2.5-1.2-3.6a4 4 0 0 0-4-1v-1.6l.7-1.6 2-4.6c1.4-3 2.4-5 .3-7a4 4 0 0 0-2.6-1.2h-.9c.4-1.2.5-2.5.5-4a8.5 8.5 0 0 0-3-6.3c.9-1 1.6-2 1.6-3.4a4.6 4.6 0 0 0-1.6-3.4 10.6 10.6 0 0 0-7.4-3h-.6a9.3 9.3 0 0 0-5.3 1.5 6.1 6.1 0 0 0-4.3-1.5c-1 0-1.6.2-2.5.6h-.1a4.3 4.3 0 0 0-2.3-.7c-.5 0-1 0-1.5.3a3 3 0 0 0-1.5 1 4.6 4.6 0 0 0-.2.2v.1c-.3-1-.8-1.8-1.3-2.6a18 18 0 0 1-2.6-6.4 11.6 11.6 0 0 1 0-2c.1-1 .6-2 1-2.8l2.2-2.3a163 163 0 0 0 2.2-2.3c2.8-3 4-5.9 4-9.2 0-1.5-.2-6.4-4.2-7h-.6c-1.7 0-3 .8-3.6 2.3l-.5 1.2-.2 1.4c-.2 1.4-.4 2-1 2.6a13.7 13.7 0 0 0-.7-13.1c-.3-.9-1.7-3-4.1-3a4.2 4.2 0 0 0-3 1.3l-.8 1.2c-.6 1.1-.6 2-.5 4.3v1.2c-.3 1.8-1.8 4-4.8 7.4a16.4 16.4 0 0 0-3.4 5.1l-.7-1.2a3.8 3.8 0 0 1-.5-2c0-.8 0-.9.8-4 .5-2 .8-3.8-.5-5.5A4.1 4.1 0 0 0 41.8 7c-2.4 0-3.6 2-4.2 3-2 3.2-3.1 6-3 9.7 0 1.5.3 2.6.7 4a18.5 18.5 0 0 0 3.3 6c.3.4.8 1 1 2.7v4c-.4 3-.2 3.8 0 4.2 0 .3.2.6.3.8l.1.2 1 1.3c-1.3.4-2.6 1-3.7 1.9a4.2 4.2 0 0 0-6.5-1.5c-.3.3-.5.4-1.5 1.8l-3.8 4.7c-4.5-6.3-5-6.6-5.7-7a4.4 4.4 0 0 0-2-.5c-1.8 0-2.8.7-3.5 2v.1l-.2.2v.3l-.1.1-.1.4v.1l-.2 1v.4l-.4 3-1 8.9c0 1.6-.2 2.9-.3 3.8a4.2 4.2 0 0 0-3.6 4.3l-.3 6.3-.2 6.6c-.9 1-1 1.8-1.1 6.2l-.2 4c0 .7 0 1.3.2 1.8-.7 0-1.4.2-2.2.5a7 7 0 0 0-4 3.5 5.8 5.8 0 0 0 .6 6 6.6 6.6 0 0 0 2 6.3c.4.5 1 1 1.6 1.3a7.5 7.5 0 0 0 2.3 4.1 11.6 11.6 0 0 0 2.2 1.8l.7 2c1.3 3.7 1.7 4.7 2.6 6 5.2 8 19.9 13.3 38.4 14h8.6a74 74 0 0 0 26.4-5.7c5.6-2.6 9.5-5.8 11.4-9.5l3.1-8.2a7.5 7.5 0 0 0 2.6-4.7 7.8 7.8 0 0 0 3.1-3.2 6.4 6.4 0 0 0 .5-4l.3-.5c1-1.4 1.2-3 .8-4.7z'%2F%3E%3Cpath fill='%23ab9c85' d='M63.6 45a14 14 0 0 1-2.6-2.5c-3.5-4.2-4.8-9.1-3.5-13.3a10.5 10.5 0 0 1 3-4.5 28.7 28.7 0 0 1 2.8-2.4c2.4-1.9 3.2-2.6 4-3.9a8.2 8.2 0 0 0 1.2-3.9l.1-1c.2-.6.7.7.8 2a8 8 0 0 1-1 4.5 18 18 0 0 1-3.5 4.2 41 41 0 0 0-2.7 2.8 11.8 11.8 0 0 0-2.2 5.2c-.2.7-.2 2.3 0 3a21 21 0 0 0 2.9 7.7c1.3 2.3 1.4 2.4.7 2zm-20-5.5V37c.2-2.1.2-3.3.2-4.4a9.5 9.5 0 0 0-2.2-6 14.5 14.5 0 0 1-2.7-5.5c-.5-2.4-.1-4.6 1.2-7.2l1.4-2.6c.3-.4.3-.4.3 0 0 .5 0 1-.5 2.5-.7 2.7-.8 4-.5 5.6.3 1.6 1.2 3.3 2.5 5a10.2 10.2 0 0 1 2.2 4.6c.4 2.3.2 5-.8 8l-1 2.5-.1-.1zm8.8-2.8a16.3 16.3 0 0 1-2.2-3.6 13.5 13.5 0 0 1-1.2-5.8 12.1 12.1 0 0 1 3.3-8.3 37.2 37.2 0 0 0 3.7-4.6c1-1.4 1.7-3 2.1-4.5.2-1 .3-1.5.2-3 0-1.6 0-2 .2-2 .3-.1 1.3 1.6 1.7 3 .3.9.4 1.5.4 2.5a14 14 0 0 1-2 6.8 32.5 32.5 0 0 1-3.7 6 8.8 8.8 0 0 0-2.4 5c-.3 1.6-.2 3 .4 6 .2 1.6.3 2.5.2 2.7-.1.3-.3.3-.7-.2z'%2F%3E%3Cpath fill='%23985f2c' d='M51.8 133a88.5 88.5 0 0 1-14.6-1.6 39.9 39.9 0 0 1-19.1-8.2 13 13 0 0 1-1.8-2.1c-.7-1-1-1.6-2.2-5.1l-1.2-3.5c0-.2-.2-.3-.6-.5a7.1 7.1 0 0 1-2.8-2.2c-.9-1.4-.6-2.5.8-3.2.2 0 .3-.1.3-.2h-.8a5.5 5.5 0 0 1-2.2-.4c-1.6-.7-2.5-2-2.3-3.2.2-1 1.1-1.8 2.5-2.1.7-.2.7-.2-.3-.3-1.4-.1-2.7-.8-3-1.6-.3-.4-.3-1 0-1.4.4-1 1.8-1.6 3.6-1.6l2.8.1v.7a8.7 8.7 0 0 0-.1 3.6A13.4 13.4 0 0 0 14 107l2.5 2.4a52.9 52.9 0 0 0 26.3 9.9c7 .9 14.4 1 21.3.1 17.6-2 30.8-9.3 33-18 .5-1.7.5-3.4.1-5V96h2c1.5-.1 2.5 0 3.4.5 1 .5 1.5 1.5 1.2 2.3-.4.8-1.6 1.4-3 1.6l-1 .1.6.2c1.6.4 2.6 1.5 2.3 2.7 0 .5-.3.9-.8 1.4a4.8 4.8 0 0 1-2.7 1.3H99l-.1.5c-.2.4-.2.4-.1.5l.4 1c0 1-.5 2-1.6 2.8-.3.2-.5.3-.5.5l-1.6 4.2a113 113 0 0 1-1.7 4.4c-2.1 4.4-9 8.4-18.5 10.7a84.6 84.6 0 0 1-16.1 2.2h-7.4zM26 117.3s0-.1-.2 0v.1h.2z'%2F%3E%3Cpath fill='%23804b21' d='M80.9 124.7v-4.3l-.3.1-2.1.6a10 10 0 0 1-6-.2l-.4-.3v.3c0 .6-.4 1-1.3 1.6-1.5.7-3.9 1.2-6.1 1-2 0-3.4-.4-4-1a1.2 1.2 0 0 0-.3-.3l-.1.3-1 1c-1.8.8-5.6 1-8.2.5-1.5-.4-2.3-.8-2.7-1.5l-.1-.3-.3.3a4 4 0 0 1-1.7.8c-1 .2-1.3.3-2.8.3a12.4 12.4 0 0 1-2.2-.2 11.2 11.2 0 0 1-3.6-1c-.8-.4-1.2-1-1.1-1.6v-.2l-.5.3a9 9 0 0 1-5.3.3c-1.1-.2-2.3-.5-3.4-1v8.4h-.1a35.8 35.8 0 0 1-3.5-1.6 18.9 18.9 0 0 1-7.6-6c-.6-1-.9-1.8-2.1-5.3l-1.2-3.4-.7-.3c-1.8-1-3-2.3-3.2-3.5 0-.4 0-.7.3-1a3 3 0 0 1 1-.9c.5-.2.5-.2-.4-.2l-1.2-.1c-1.8-.4-3.1-1.4-3.4-2.8-.2-1.2.7-2.3 2.4-2.8l.6-.1c.2-.1 0-.2-.6-.2a6.2 6.2 0 0 1-2-.5c-.6-.3-1-.7-1.3-1.3-.3-.9.1-1.7 1.2-2.3 1.1-.5 2.2-.6 4.1-.5l1.2.1v.7a11 11 0 0 0 1 7.1c1.1 2.4 3.1 4.6 6 6.7a58 58 0 0 0 28.3 9.3c2.9.2 4 .3 7.9.3 4.3 0 6.1-.1 9.6-.5 13-1.5 24-5.7 29.7-11.6 2.2-2.3 3.5-4.6 4-7.1.2-.7.2-.9.2-2a8.3 8.3 0 0 0-.2-2.5c0-.2 0-.2.6-.2h1.5c1.3-.1 2.3 0 3.1.4 1.5.7 1.8 2 .8 3-.5.5-1.6.9-2.6 1l-.9.1.4.2c1 .2 1.7.6 2 1 .8.8.7 2-.1 3a4.6 4.6 0 0 1-2.5 1.3l-.7.2a2.2 2.2 0 0 0-.2.4v.4l.1.3c.6 1 .2 2.3-1.2 3.5l-.6.5-1.6 4.2A304.8 304.8 0 0 1 94 120c-1.4 2.8-4.9 5.6-9.7 7.7-1 .5-2.1 1-3.2 1.3v-4.3zm-55-7.4c.1 0 .2-.1.1-.2 0 0-.2 0-.2.2h.2z'%2F%3E%3Cpath fill='%237f017b' d='M52 115.5v-12.4h2.4c2.6 0 2.9 0 3.6.3.6.3.8.5 1.3 1 .4.3.5.5.8 1 1 2.2.5 5.2-1.3 6.6-.8.6-1.6.8-3 .9H55v2.6zm3-5.6h.3a6 6 0 0 0 1.3 0c.7-.3 1-1 1-2.1 0-.7-.2-1-.6-1.4-.2-.2-.5-.3-1.2-.3H55v3.8zm-5.2 5.5a30 30 0 0 1-1.3 0l-.9-.2-.2-2.7v-2.3l-2.7 3.2-.3-.3-1.3-1.9-1.2-1.5-.1 2.3-.2 2.5h-.2s-.9 0-1.3-.2l-1.4-.2v-.3l.8-11.5v-.2h.2a440 440 0 0 0 5 6.9l1.4-1.6 2.4-3c1.1-1.4 1.1-1.4 1.3-1.4.2.1.2.1.4 5.8l.3 6v.6h-.7zm9.9-.1 1-2.4a1209 1209 0 0 0 3.4-9l.8-1.5h.1l1 2a470.4 470.4 0 0 0 3.4 7.4l1 2h-.1c-.2.3-2.4.6-2.5.6h-.5l-.2-.5a2.5 2.5 0 0 0-.2-.3l-3.9.4-.1.4a2 2 0 0 1-.2.6c-.2.2-2.4.3-2.4.3zm5.2-6.5-.9 2.6 1-.2.9-.1a34 34 0 0 0-1-2.3zm6.2 5c-.2 0-.2-.1-.2-.6v-5.3a581.3 581.3 0 0 1-.2-5.5v-1.1l1.4 1c1.8 1.4 3.6 2.6 5.5 3.8l-.1-2.7v-3l2.4-.6h.1c.2.2.5 11.3.5 11.4v.6l-.6-.3-5.6-3.5-.7-.5.1 4.2v1.6l-1.5.3-1 .2zm-37.7-.8H33a7.1 7.1 0 0 1-4.7-3.3 7.6 7.6 0 0 1-1.4-4.3c0-1 .2-1.8.6-2.6a4.3 4.3 0 0 1 4-2.3c.5 0 1 0 1.3.2a7.3 7.3 0 0 1 5.2 8.7 5.1 5.1 0 0 1-1.5 2.5 5 5 0 0 1-1.8 1h-1.2zm-1.6-9.6c-.5 0-1 .2-1.3.6-1 1-1 3.4.1 4.8A3.1 3.1 0 0 0 33 110c.3 0 .6 0 .8-.2.6-.3 1-.9 1.2-1.6a5.8 5.8 0 0 0-.1-2.3c-.4-1.4-1.4-2.3-2.7-2.4a2.4 2.4 0 0 0-.3 0zm-7.8 6.4h-.6c-2.9-.5-5.5-3.3-6.3-6.7a9.5 9.5 0 0 1 0-1.3c0-1.1 0-1.6.4-2.3.6-1.3 1.9-2 3.3-2 .6 0 1.4.2 2.1.5a7.5 7.5 0 0 1 2.7 1.9c.4.5.8 1 1 1.7 0 .1 0 .2-1.5.8l-.6.3-.3-.5a4.2 4.2 0 0 0-1.4-1.5l-1.2-.3c-.8 0-1.3.5-1.6 1.4v2.3a4 4 0 0 0 2.7 2.7h.5c.4 0 .7-.1 1-.4l.5-.4 1 1.1c1 1 1 1.2 1 1.3l-.5.5a3 3 0 0 1-2.2 1zm61-.4-.2-2V106l-.4-.6c0-.1-3.7-5.4-3.7-5.6l.4-.3 1.4-.3 1.1-.3a67.8 67.8 0 0 0 2.5 3.6l1-2.6 1-2.6 1.4-.5 1.3-.5c.2.2.2.2-1.5 4.4l-1.7 4.2.1 1.4v2c.1.4 0 .5-1 .9l-1.7.7zm12-2.8c-.3 0-.3-.3-.3-.4v-.2h.2c.2 0 .4 0 .5.2v.3H97zm-44.9-6-.5-.1A4.6 4.6 0 0 1 49 99a5.5 5.5 0 0 1-1.6-3.7c-.1-2.6 1.3-4.8 3.6-5.4h2.3a5 5 0 0 1 3.4 3.6c.6 2.3-.1 4.7-1.8 6-.8.6-1.7 1-2.7 1zm0-8.1a2 2 0 0 0-.5 0A2 2 0 0 0 50 94l-.1 1.1.1 1.1c.2.6.3.8.6 1.1a2 2 0 0 0 2.2.5c.6-.2 1-.7 1.3-1.4.2-.5.2-1.5 0-2a2.5 2.5 0 0 0-.7-1.4 2 2 0 0 0-1.3-.5zm5.6 7.8V90h.7a48.7 48.7 0 0 1 4 0 3.4 3.4 0 0 1 2.2 2.6c.2.7.2 2 0 2.6a3.8 3.8 0 0 1-3.7 2.8h-.3c-.4 0-.4 0-.4.7v1.5h-.8l-1.1.1h-.6zm2.5-4.7 1-.1c.5 0 .9-.5 1-1a3.2 3.2 0 0 0-.1-1.5c-.2-.5-.5-.6-1.2-.6h-.8l.1 3.2zM46.8 100h-1.1c-.2 0-4.4-.4-4.6-.6V89.3l.5.1 1 .1 1 .1v6.1a16.8 16.8 0 0 0 0 1.7l1.5.2 1.8.1h.4v2.5zm18.5-1 .2-5 .2-4.3h.2l1 1c1 1.3 2 2.5 3.1 3.6l1.5-2.2 2-2.9c.3-.6.3-.6.5-.6h.1l.8 9.6c0 .4-2.1.6-2.2.6h-.1l-.3-2.1-.1-1.8-.9 1.4-1.1 1.6c-.2 0-.3-.1-1.4-1.3a3 3 0 0 0-1-1v3.7l-.1.4h-1l-1 .2h-.4zm-25.5.5-5-.8-1.2-.2V97l.2-4.7c0-4 0-4 .4-4l.7.1 4 .6 1 .2c.2 0 .2 0 .1 1.2v1.2h-.4l-3.3-.5v2s.3.2 1.4.3l1.5.2.1 1.1-.1 1.1H39l-1.4-.1a16 16 0 0 0-1.4-.2v.8l1.8.3 2 .3v1.2c0 1.1 0 1.1-.2 1.2zM76.3 98c-.2 0-.3-.2-.3-.4v-9.4l1.5-.3a105.8 105.8 0 0 0 4.2-.8h.1c.1 0 .2 0 .2 1 0 .9 0 1.1-.2 1.2l-1.8.4-1.6.4v2c.5 0 2.5-.5 2.7-.6h.1c.2 0 .4.1.4 1.5v.6l-.4.1-1.4.4-1.3.3v.8l1.9-.5 1.8-.4c.2.1.2.1.2 1.1v1.1l-.6.2c-1.8.5-3.5 1-5.3 1.3zm-49.2-6c-1.8-5.2-1.8-5.2-1.7-5.3h.1l1.1.1 1.2.3.8 2.5a34 34 0 0 0 .7 2.1L30 90l1-2 2.3.3c0 .1.1.2-3.2 7L29 97.8l-2-5.6zm56.5 4c-.1 0-.3 0-.3-.2l-.3-9.2v-.2h.2l1.3.8a105 105 0 0 0 4 2.4 55 55 0 0 0-.1-4.2c0-.3.1-.3 1-.6l1-.3.2.4.2 3.8.2 4.3v1l-1.3-.6a88 88 0 0 1-4.2-2.4v4.4s-.1.2-1.7.6h-.2zm-59.4 0c-.1 0-5.3-1.7-5.5-2-.2-.1.3-8.9.3-9h.2l1.4.4 2.8.8 1.5.4v1l-.1 1v.2h-.2l-3.4-1v2l2.4.7.5.1v1.8l-.1.4-1.6-.5-1.3-.4v.7l.3.2 1.8.6 1.6.5v1.6l-.1.6zm69.5-3.5v-.3l-.4-6.3-.8.3-1 .3h-.2v-.1a2 2 0 0 1-.2-.8v-1.1l1.9-.7 3-1 1.5-.6.1.1.2 1v.9l-1.2.4-.9.4.1 3.2c.2 3.4.1 3.4 0 3.5l-1 .4-1 .4zm-78.5 0h-.4a5.9 5.9 0 0 1-1.7-.6 63.6 63.6 0 0 1-2.6-1.2v-4.2c.2-4.1.3-4.1.4-4.2h.1l.9.2 1.6.6a6 6 0 0 1 4.5 6.3c-.2 1.8-1 3-2.6 3zM13 85l-.1 2.3v2.2l1 .4h.7c.4 0 .7-.4.9-1 .2-.7 0-2-.7-2.9a3.3 3.3 0 0 0-1.3-.8L13 85v.2zm48.7 1.3A233 233 0 0 1 55 80l-1.2-1.2v7.6h-3.5V70l3.2 3 5.3 5.2v-7.6h1.6l1.2-.1h.5l.2 14.4v1.9l-.6-.5zm-14 0-4.4-.3-4-.4-.1-.1v-.1l.3-15.2h.8c2.5.1 5 .3 7.6.3h.7v3.7l-3.2-.1a69.8 69.8 0 0 0-2 0H43v3.3l3.2.2 1.4.1v3.4l-3-.1a32.6 32.6 0 0 0-1.6 0v1.4l4 .2 1.5.1h.4v3.7h-1zm16.9-.3c-.3 0-.3-.1-.3-.9l-.1-13.5v-1.2l3.1-.2 2.3-.1c1.1 0 1.7.1 2.6.5a6.1 6.1 0 0 1 3 2.8 10 10 0 0 1-.1 8.2 7.1 7.1 0 0 1-4.7 3.8l-4.5.5zm3.2-11.4L68 79v.6l.1 2.6h.1l.8-.1c1-.1 1.7-.4 2.3-1a4.7 4.7 0 0 0 1-3.6c0-1.8-.7-3-2-3.5l-1-.1H68v.9zm-31 10.7-3.2-.5c-.2-.1.2-14.9.3-15v-.1h.2l3.3.3v7.4L37 85c0 .1 0 .4-.3.4zm-5.2-.8-1.7-.3L28 84l-.8-1.8a36 36 0 0 0-.9-1.8 7.6 7.6 0 0 0-1-.2l-.1 1.4-.1 1.6v.2H25l-3.3-.8c-.1-.1.4-14 .5-14.1v-.1h.2a210.5 210.5 0 0 0 5.5.8 5.7 5.7 0 0 1 4.2 4.2c.2.8.2 1.3.2 2.3a5.3 5.3 0 0 1-1.4 3.6 5 5 0 0 1-1 .8l2 4.3v.2h-.1zm-6.1-7.8 1.6.3.5-.1c.9-.3 1-1.3 1-2 0-1.3-.4-2.1-1.2-2.4a10.3 10.3 0 0 0-1.8-.4l-.1 4.6zm52.3 7.7c-.1 0-.3-.1-.4-.4 0-.1-.5-14.4-.3-14.5l1.7-.3 1.7-.2v1l.3 4.8c0 3.7.1 5.1.2 5.5l3.4-.7 1.7-.4h.1v.1c.2 0 .2.1.2 1.6v1.6c-.3.3-8.6 1.9-8.6 1.9zm11.6-2.7s-.2-.1-.2-.4l-.1-2-.1-2.1c0-.2 0-.3-.8-1.5-4.5-7-4.4-7-4.2-7.2l3.4-.5c.2 0 .3.1 1 1.2a84.5 84.5 0 0 0 2.2 3.7l.5-1.2c2-4.7 2-4.7 2.2-4.7l3.1-.7h.1v.1c.2.1.2.1-.5 1.8l-3.4 7.5-.1.4v1.7l.2 2.3c0 .5 0 .6-.3.8l-3 .8zM15 80.6l-1.5-.5a8 8 0 0 1-1.6-.5v-.2l.5-12.8v-.1h.2l1 .2a146.2 146.2 0 0 0 7.3 1.4c.2.2 0 3 0 3l-.1.2h-.2l-4-.8a7.7 7.7 0 0 0-.9-.1v2.9l3 .7 1.4.3c.1.2-.2 3.1-.2 3.2h-.1l-2.1-.5a40.5 40.5 0 0 0-2.2-.5 149.1 149.1 0 0 0-.5 4.1zm29.3-13.5h-.8a8.6 8.6 0 0 1-4.9-2.4 10.6 10.6 0 0 1-3.2-7.9c0-2.5.6-4.6 1.9-6.4a9 9 0 0 1 5.6-4 9.5 9.5 0 0 1 3 0c4.3 1 7.3 5.2 7.3 10.4 0 3-1 5.6-2.7 7.5a8.4 8.4 0 0 1-4.6 2.7l-1.6.1zm0-16c-2.3 0-4 2-4.2 5a7 7 0 0 0 .9 4.4 3.9 3.9 0 0 0 3.9 1.8c1.7-.3 3-1.7 3.4-3.8l.2-1.4c.1-3.4-1.5-5.8-4-6zm10 15.4.2-4 .8-16.2h.2l1.4 1.9a597.4 597.4 0 0 0 5.6 7.6l1 1.2a55.5 55.5 0 0 0 1.6-2.3c5.8-8.4 5.8-8.4 6-8.4.2 0 .2 0 .4 3.2l.7 9.8.5 7-2 .2-2.2.2c-.1 0-.3 0-.3-.3a295.1 295.1 0 0 1-.6-8L65.8 61l-2 3-.3.3-.3-.3-2.2-3a64.8 64.8 0 0 0-2-2.6v4.2l-.3 4.3h-2.2l-2.3.1zm-20.8-.3c-.2 0-1.1 0-2.1-.2l-1.9-.2-.1-4.2v-3.8l-.8 1c-1 1-2.8 3.3-3.2 3.7l-.4.5-1.2-1.7-2.9-4-.3 3.4-.4 3.9H20s-3.8-.4-4-.6c-.2 0-.2 0 .5-6.7l.8-8.6.2-2.2v-.2h.3a116.5 116.5 0 0 1 7.4 10c.7-.7 4.4-5.3 7.3-9 .7-1 .8-1 .9-1h.1v.2l.1 3.2.3 15.4v1.1zm51.9-.9h-.7a6.7 6.7 0 0 1-3.8-1.4c-.1-.1-1.3-1.1-1.3-1.4 0-.2 2.8-2.8 2.8-2.9l.3-.2.7.6a3.3 3.3 0 0 0 2.4 1c.9 0 1.8-.2 2-.7.3-.2.4-.6.3-1a1.1 1.1 0 0 0-.4-.7l-2.1-.7c-2.2-.7-3-1-3.8-1.9a5.3 5.3 0 0 1-1.4-2.6 9 9 0 0 1 0-3 5 5 0 0 1 3.7-4 8.4 8.4 0 0 1 5 .6 7 7 0 0 1 2 1.5c.1.2 0 .4-1 1.6l-1 1.4h-.5l-.5-.2a3.2 3.2 0 0 0-2-.8h-.7c-.6.2-.9.5-1 1 0 .5.1.7.3 1 .2.2.5.3 2.2.9l2.1.7c1.8.8 2.8 1.8 3.2 3.3.1.5.2.7.2 1.6a5.5 5.5 0 0 1-3.2 5.4 9.6 9.6 0 0 1-3.3.9h-.7zM75 54.7c-.4 0-.6 0-.6-.2l.4-1.5.3-1.4a.8.8 0 0 0-.1 0c-.6-.3-1-1-1.2-1.8a4 4 0 0 1 0-2c.3-.6.9-1.2 1.6-1.4h.8a2 2 0 0 1 1.6.7c.6.6.8 1.2.8 2.2 0 1-.2 1.7-1.4 3.7l-.9 1.6H75z'%2F%3E%3Cpath fill='%23582c0d' d='M52.3 124.1a7 7 0 0 1-3.6-1.2l-.4-.7v-.1l-.4.2c-.7.8-2.2 1.2-4.4 1.2a14 14 0 0 1-3.2-.3A7.3 7.3 0 0 1 37 122c-.4-.4-.5-.7-.5-1v-.5l-.2.1c-1.4 1-4.6 1.1-7.6.1-2-.6-3.3-1.6-3.3-2.5 0-.3.2-.7.4-.7.2-.2.3-.3 0-.3a.6.6 0 0 0-.2.1c-.5.4-2.1.6-3.5.4-2.6-.3-5.4-1.6-6-3-.3-.6-.2-1.1.3-1.6l.3-.3h-.4c-1 .3-3.1 0-3.5-.4a7.3 7.3 0 0 0-.9-.4 6.2 6.2 0 0 1-2.8-2.5 1.7 1.7 0 0 1-.2-1v-.7c.2-.3.6-.7 1.2-1l.5-.3h-.9a5.8 5.8 0 0 1-2-.3 4 4 0 0 1-2.3-2 2 2 0 0 1-.2-1c0-.4 0-.5.2-.8.4-.8 1.2-1.3 2.5-1.6.7-.2.7-.3-.1-.3a5.5 5.5 0 0 1-2.7-.8c-.6-.4-1-.9-1-1.5 0-1.1 1.2-2 3-2.2a14.3 14.3 0 0 1 3.7.1l-.1.5a11.6 11.6 0 0 0 0 4.3c.4 2 1.3 3.9 2.8 5.7 1 1.3 3 3.1 4.7 4.3 9.4 6.7 26 10.2 42.4 9 9.4-.7 18-2.9 24.5-6.2a33.2 33.2 0 0 0 6.6-4.2l2.8-2.8a12 12 0 0 0 2.8-10 2.4 2.4 0 0 1 0-.5h3.9l.5.1c1 .3 1.7.8 2 1.4.2.4.2 1 0 1.4-.5.7-1.5 1.3-3 1.4l-.8.1c-.2 0-.4 0-.2.1l.6.2c1.1.3 2 .8 2.2 1.5.2.3.2.4.2.8 0 .5 0 .6-.2 1a4 4 0 0 1-2 1.7 7 7 0 0 1-1.4.4.7.7 0 0 0-.3 0c0 .1-.2.2-.6.2-.6 0-.6 0 0 .3l.3.3.2.5c.3.3.3.5.3 1 0 .7-.6 1.6-1.3 2.2l-.7.6a6 6 0 0 1-2.7 1.1H92c-.2 0-.2 0 .1.2.4.4.5.8.5 1.1-.2 1.2-2 2.6-4.3 3.3a9 9 0 0 1-2.9.6 6.2 6.2 0 0 1-2.7-.4l.1.3c.2.3.2.7 0 1-.6 1.4-4 2.7-7.1 2.8a6.4 6.4 0 0 1-3.7-.7l-.3-.2v.3c.1.4 0 .7-.3 1.1-1 1-3.7 1.7-6.5 1.7-2.2 0-3.7-.4-4.5-1.2-.3-.3-.4-.3-.4-.2l-.4.8c-.5.5-1.6 1-3.1 1.2h-4.4zm45-17.8H97h.4z'%2F%3E%3Cpath fill='%234b2007' d='M52.9 124.1a9.5 9.5 0 0 1-3.7-1c-.5-.2-.9-.7-.9-1v-.2l-.4.3c-.8.8-2.2 1.2-4.5 1.2-4 0-7.2-1.3-6.8-2.7v-.3h-.3c-.7.6-2.3 1-3.8.9-3.6-.3-7-1.8-7-3.2 0-.3 0-.5.4-.7.4-.4.2-.5-.3-.3a8 8 0 0 1-5 .1c-2.6-.6-4.5-2-4.5-3.2 0-.5.3-1 .9-1.2.2-.1.3-.2.2-.3h-.3c-.7.3-2.3.3-3.5 0a12 12 0 0 1-2.3-1.2 4.8 4.8 0 0 1-2.1-2.5c-.2-.9.2-1.6 1.2-2 .4-.3.6-.4.5-.5a9.3 9.3 0 0 0-1 0 5 5 0 0 1-3-.8 3.3 3.3 0 0 1-1.3-1.4l-.1-1 .1-.8c.5-.8 1.3-1.3 2.6-1.6l.7-.2-.6-.2c-.4 0-1.2 0-1.7-.2-1-.2-1.8-.8-2-1.4-.2-.3-.2-.9 0-1.2.2-.6.9-1 1.7-1.4s2-.3 3.8-.2c.7 0 .9 0 .8.1l-.1.8a13 13 0 0 0-.1 3c.4 3.6 2.6 7 6.3 10 11 8.9 33.2 12.6 53 8.8 10.8-2 19.8-6.3 24.3-11.5 2.8-3.3 4-7 3.3-10.4a2.8 2.8 0 0 1 0-.5 29.2 29.2 0 0 1 4.2 0c1.3.4 2.1 1.1 2.2 2 0 1-1 1.9-2.8 2.2a8.2 8.2 0 0 1-1 0h-.5c-.1.1 0 .3.2.3a7 7 0 0 1 2.4 1c.4.5.6 1 .6 1.5l-.2.8c-.7 1.3-2.5 2.2-4.4 2.2H97c0 .1.1.2.3.2l1 .5c.2.1.6.6.7.9v.9c-.2 1.3-1.7 2.7-3.5 3.3a7 7 0 0 1-3.2.2c-.7 0-.8 0-.3.3 1 .7.9 1.5-.1 2.5a10.5 10.5 0 0 1-5.9 2.5 6.5 6.5 0 0 1-2.8-.3l-.6-.2s0 .2.2.3c.2.3.3.4.3.7 0 1-1.2 1.8-3.3 2.5-1.5.5-2.9.7-4.3.7a5.8 5.8 0 0 1-3.2-.6l-.5-.2v.1c.5 1.2-1.3 2.3-4.5 2.8l-2.2.1-2.2-.1c-1.2-.3-2-.7-2.4-1.3l-.2-.1-.1.2c-.1.4-.3.7-.6.9-.8.5-2 .9-3.6 1-.7.1-2.3.2-3 .1z'%2F%3E%3C%2Fsvg%3E")`,
						'background-repeat': 'no-repeat',
						'background-size': 'contain',
						'height': 'calc(10vw + 10vh)',
						'position': 'absolute',
						'width': 'auto',
						'z-index': '2',
					})
			)

		animatedLogo = document.querySelector('[class*="RoomBackground-"] > .animated-logo');

		calculateSizes();
		// Initial position
		position.x = Math.floor(Math.random() * maxWidth);
		position.y = Math.floor(Math.random() * maxHeight);
		// Initial time
		lastFrameUpdate = Date.now();

		requestAnimationFrame(dvdAnimationStep);
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

	// Calculate {{{
	function calculateSizes() {
		// Max sizes accounting for offsetting the inserted logo size
		maxWidth = Math.floor($(document).width() - animatedLogo.offsetWidth);
		maxHeight = Math.floor($(document).height() - animatedLogo.offsetHeight);
	}
	// }}}

	// If window is resized, recalculate sizes {{{
	window.onresize = calculateSizes;
	// }}}

	// Move inserted logo diagonally {{{
	function dvdAnimationStep() {
		const now = Date.now();
		const timeDelta = (now - lastFrameUpdate) / FRAME_DURATION;

		position.x += xDelta * timeDelta;
		position.y += yDelta * timeDelta;

		if (position.x <= 0) {
			position.x = 0;
			xDelta = SPEED;
		} else if (position.y <= 0) {
			position.y = 0;
			yDelta = SPEED;
		} else if (position.x >= maxWidth) {
			position.x = maxWidth;
			xDelta = -SPEED;
		} else if (position.y >= maxHeight) {
			position.y = maxHeight;
			yDelta = -SPEED;
		}

		animatedLogo.style.left = `${ position.x }px`;
		animatedLogo.style.top = `${ position.y }px`;

		lastFrameUpdate = now;
		requestAnimationFrame(dvdAnimationStep);
	}
	// }}}
})();
