
/////////////////////
////////////////// //
// KEEP IN MIND // //
////////////////// //
/////////////////////

// Any fool can write code that a computer can understand. Good
// programmers write code that humans can understand. ~ Martin Fowler,
// 2008.

if (typeof(exports) !== 'undefined') {
    var $ = require('jQuery');
}

/**
 * Default errors for the API.
 */
var ERRORS = {
    no_cid_redir: "ClientID and Redirect URI must be Set.",
    no_uid_at: "UserID and AccessToken must be passed as arguments"
};

/**
 * The constructor function for the InstagramApi
 * @param {String} clientId the clientId given by the InstagramAPI
 *                          client application manager.
 * @param {String} redirUri the redirect uri configured for the
 *                          application at the InstagramAPI app manager.
 */
var InstagramApi = function (clientId, redirUri) {

    if (!(clientId && redirUri)) throw new Error(ERRORS.no_cid_redir);

    this.clientId = clientId;
    this.redirUri = redirUri;
};

InstagramApi.fn = InstagramApi.prototype = {

    /**
     * Authentication URL for the implicit authorization flow.
     * @type {String}
     */
    AUTH_URL:
        'https://instagram.com/oauth/authorize/?client_id=CLIENT_ID&redirect_uri=REDIRECT_URI&response_type=token',

    BASE_URL: 'https://api.instagram.com/v1/',

    /**
     * Generates the full path to the corrent endpoint. Notice that it
     * is not ready to go as it is not formed with the arguments it
     * requires.
     * @param  {String} arg the pre-configured 'path' to the endpoint.
     * @return {String}     full not-finished path.
     */
    _buildPath: function (arg) {
        switch (arg) {
            case 'user.info':
            return this.BASE_URL + 'users/USERID/?access_token=ACCESSTOKEN';

            case 'user.feed':
            return this.BASE_URL + 'users/self/feed?access_token=ACCESSTOKEN';

            case 'user.media':
            return this.BASE_URL +
                'users/USERID/media/recent/?access_token=ACCESSTOKEN';
        }
    },

    /**
     * Gets the Authorization Url.
     * @return {String} The absolute url to be used for the implicit
     * authorization flow.
     */
    getAuthUrl: function() {
        return this.AUTH_URL.replace(/CLIENT_ID/, this.clientId)
                            .replace(/REDIRECT_URI/, this.redirUri);
    },

    /**
     * Generates a deffered object to be used for getting the user info.
     * @param  {String} userId      the ID of the user that you want to
     *                              fetch the info.
     * @param  {String} accessToken the accessToken for the
     *                              authenticated user
     * @param  {Function} cb          a function  for the $.ajax
     *                                callback.
     * @return {$.Deferred}         a deferred object.
     */
    _getUserInfo: function (userId, accessToken, cb) {

        if (!(userId && accessToken)) throw new Error(ERRORS.no_uid_at);

        return $.ajax({
            type: 'GET',
            dataType: 'jsonp',
            url: this._buildPath('user.info')
                        .replace(/USERID/, userId)
                        .replace(/ACCESSTOKEN/, accessToken),
            success: cb
        });
    },

    _getUserMedia: function (userId, accessToken, cb) {
        if (!(userId && accessToken)) throw new Error(ERRORS.no_uid_at);

        return $.ajax({
            type: 'GET',
            dataType: 'jsonp',
            url: this._buildPath('user.media')
                        .replace(/USERID/, userId)
                        .replace(/ACCESSTOKEN/, accessToken),
            success: cb
        });
    }
};


//////////////
//  Wrapper //
//////////////

/**
 * Wrapper for the functions that regards the User
 * @type {Object}
 */
InstagramApi.fn.user = {
    info: function () {
        return InstagramApi.fn._getUserInfo
            .apply(InstagramApi.fn, arguments);
    },

    media: function () {
        return InstagramApi.fn._getUserMedia
            .apply(InstagramApi.fn, arguments);
    }
};

(function (module, $) {
    module.exports = InstagramApi;
})(typeof module === 'undefined' ? this.mymodule = {} : module, $);
