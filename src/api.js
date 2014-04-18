(function ($) {
    'use strict';

    /**
     * Verifies if running on top of nodejs or not
     * @return {Boolean} if on nodejs or not
     */
    function isRunningOnNode () {
        return (typeof module !== 'undefined' && module.exports)
               ? true
               : false;
    }

    if (isRunningOnNode()) var $ = require('jQuery');

    /**
     * Default errors for the API.
     */
    var ERRORS = {
        no_cid_redir: "ClientID and Redirect URI must be Set.",
        no_uid_at: "UserID and AccessToken must be passed as arguments",
        no_at: "No AccessToken specified."
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

        _objToQueryString: function (obj) {
            var str = [];
            for(var p in obj) {
                if (obj.hasOwnProperty(p)) {
                    str.push(encodeURIComponent(p) +
                             "=" + encodeURIComponent(obj[p]));
                }
            }
            return str.join("&");
        },

        _isFunction: function(obj) {
            return !!(obj && obj.constructor && obj.call && obj.apply);
        },

        _isString: function (obj) {
            return (typeof obj == 'string' || obj instanceof String)
                   ? true
                   : false;
        },

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
                return this.BASE_URL + 'users/self/feed';

                case 'user.media':
                return this.BASE_URL +
                    'users/USERID/media/recent';

                case 'user.media.liked':
                return this.BASE_URL +
                    'users/self/media/liked';
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

        _getUserFeed: function (options, cb) {

            if (!options) throw new Error(ERRORS.no_uid_at);

            if (this._isString(options)) options = {access_token: options};

            if (!options.access_token)
                throw new Error(ERRORS.no_uid_at);

            var url = this._buildPath('user.feed') +
                '?' + this._objToQueryString(options);

            return $.ajax({
                type: 'GET',
                dataType: 'jsonp',
                url: url,
                success: cb
            });
        },

        _getUserMediaLiked: function (options, cb) {

            if (!options) throw new Error(ERRORS.no_uid_at);

            if (this._isString(options)) options = {access_token: options};

            if (!options.access_token)
                throw new Error(ERRORS.no_uid_at);

            var url = this._buildPath('user.media.liked') +
                '?' + this._objToQueryString(options);

            return $.ajax({
                type: 'GET',
                dataType: 'jsonp',
                url: url,
                success: cb
            });
        },


        /**
         * Fetcher user media.
         * @param  {String} userId      the ID of the user that you want to
         *                              fetch the info.
         * @param  {String} accessToken the accessToken for the
         *                              authenticated user
         * @param  {Function} cb          a function  for the $.ajax
         *                                callback.
         * @return {$.Deferred}         a deferred object.
         */
        _getUserMedia: function (userId, options, cb) {
            if (!options || !userId) throw new Error(ERRORS.no_uid_at);

            if (this._isString(options)) options = {access_token: options};

            if (!options.access_token)
                throw new Error(ERRORS.no_uid_at);


            var url = this._buildPath('user.media').replace(/USERID/, userId) +
                '?' + this._objToQueryString(options);

            return $.ajax({
                type: 'GET',
                dataType: 'jsonp',
                url: url,
                success: cb
            });
        },

        /**
         * Makes a request for the next objects. If no more, doesn't make
         * it.
         * @param  {obj}   obj instagram object
         * @param  {Function} cb  callback function for success
         * @return {obj|undefined}       obj if has next_url, otherwise,
         *                                   undefined
         */
        getNextPage: function (obj, cb) {
            if (obj && obj.pagination && obj.pagination.next_url) {
                return $.ajax({
                    type: 'GET',
                    dataType: 'jsonp',
                    url: obj.pagination.next_url,
                    success: cb
                });
            }

            return;
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

    if(!isRunningOnNode()) window.InstagramApi = InstagramApi;

    (function (module) {
        module.exports = InstagramApi;
    })(isRunningOnNode() ? module : {});

})((typeof module !== 'undefined' && module.exports) ? {} : $);
