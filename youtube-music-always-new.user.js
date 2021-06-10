// ==UserScript==
// @version      0.3
// @name         YTM: Always new
// @namespace    http://tampermonkey.net/
// @description  Auto-next on music that has already been liked or disliked
// @author       Matt Carter <m@ttcarter.com>
// @match        https://music.youtube.com/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @updateURL    https://raw.githubusercontent.com/hash-bang/tampermonkey/master/youtube-music-always-new.user.js
// ==/UserScript==

var lastTrack = false;


(function() {
    'use strict';

    var checkTrack = ()=> {
        if (checkTrack.timer) clearTimeout(checkTrack.timer);
        var thisTrack = $('.ytmusic-player-bar > yt-formatted-string.title').text();

        if (!lastTrack || thisTrack != lastTrack) {
            console.log('%cYTM:AN!', 'color: blue', 'Detected song change to', thisTrack);
            checkTrack.timer = setTimeout(()=> { // Let song settle
                var isRated = !! ($('tp-yt-paper-icon-button.dislike[aria-pressed=true]').length || $('tp-yt-paper-icon-button.like[aria-pressed=true]').length);
                console.log('%cYTM:AN!', 'color: blue', 'Detected song change to', thisTrack, 'isRated?', isRated);
                lastTrack = thisTrack;

                if (isRated) {
                    console.log('%cYTM:AN!', 'color: blue', 'Moving to next track');
                    $('tp-yt-paper-icon-button.next-button').trigger('click');
                }
                setTimeout(checkTrack, 1000);
            }, 1000);
        } else {
            setTimeout(checkTrack, 250);
        }
    };

    setTimeout(checkTrack, 2000);
})();
