
// Auxiliary functions for dealing with cookies and also a hash that may
// be appended to the url.

/**
 * Given a Cookiename, return its value if found in the document.cookie
 * container.
 * @param  {String} name cookie name
 * @return {String}      Cookie value if found. Empty string otherwise.
 */
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue =
                    decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

/**
 * Sets cookie into document.cookie.
 * @param {String} name  Cookie name
 * @param {String} value Cookie value
 */
function setCookie (name, value) {
    var cookie = name + "=" + value;
    if (typeof(document.cookie) !== 'undefined') {
        document.cookie = cookie
    }
    return cookie;
}

/**
 * Gets the hash appended to the current url.
 * @return {String} The hash or an empty string if not found.
 */
function getHash () {
    return location.hash
        ? location.hash.slice(1)
        : '';
}

/**
 * Gets the query string appended to the current url.
 * @return {String} The querySring or an empty one if not found.
 */
function getQueryString () {
    return location.search
        ? location.search.slice(1)
        : '';
}


////////////////////
// MAIN EXECUTION //
////////////////////

$(function () {

    'use strict';

    var hashValue = getHash();

    if (hashValue) {

        // we are in a redirect containing the access_token in the hash.
        // Awesome! Lets get the accessToken and then put it in the
        // 'atig' cookie so that we are able to get it within the other
        // window (that one that launches everything).

        var accessToken = hashValue.split('=')[1];
        setCookie('atig', accessToken);
        window.close();

    } else if (getQueryString()) {

        // we got an error or the user may have denied the permission :(
        // That sucks!

        window.close();

    } else {

        // we are in the normal page. Let's do whatever we would do in a
        // normal scenario.

        var clientId = '9a146342344c44ec972b6ab06d54bda3';
        var redirUri = 'http://localhost:8888/examples';
        var api = new InstagramApi(clientId, redirUri);

        $('.cool-button').click(function (e) {

            // wow! The user wants to log in

            var center = {
                x: $(window).width()/2,
                y: $(window).height()/2
            };

            // instantiating a new window which goes to the AuthUrl
            // generated by the API.

            var popupWin = window.open(api.getAuthUrl(),
                "SignIn",
                "width=500,height=300,toolbar=0,scrollbars=0,status=0," +
                "resizable=0,location=0,menuBar=0,left=" +
                center.x +
                ",top=" +
                center.y);

            // Check if the popup window we had openned is still
            // openned or not.

            var interval = setInterval(function () {
                if (popupWin.closed) {
                    clearInterval(interval);
                    api.user.info('self', getCookie('atig'), function (data) {
                        console.log(data);
                    });
                    api.user.media('self', getCookie('atig'), function (data) {
                        console.log(data);
                    });
                }
            }, 2000);

            return false;
        });

    }
});
