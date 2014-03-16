
/////////////////////
////////////////// //
// KEEP IN MIND // //
////////////////// //
/////////////////////

// Any fool can write code that a computer can understand. Good
// programmers write code that humans can understand. Martin Fowler,
// 2008.

if (typeof(exports) !== 'undefined') {
    var $ = require('jQuery');
}

var ERRORS = {
    no_cid_redir: "ClientID and Redirect URI must be Set.",
    no_uid_at: "UserID and AccessToken must be passed as arguments"
};


function InstagramApi (clientId, redirUri) {

    if (!(clientId && redirUri)) throw new Error(ERRORS.no_cid_redir);

    this.clientId = clientId;
    this.redirUri = redirUri;
}

InstagramApi.prototype = {
    AUTH_URL:
        'https://instagram.com/oauth/authorize/?client_id=CLIENT_ID&redirect_uri=REDIRECT_URI&response_type=token',

    BASE_URL: 'https://api.instagram.com/v1/',

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

    getAuthUrl: function() {
        return this.AUTH_URL.replace(/CLIENT_ID/, this.clientId)
                            .replace(/REDIRECT_URI/, this.redirUri);
    },

    getUserInfo: function (userId, accessToken, options) {

        if (!(userId && accessToken)) throw new Error(ERRORS.no_uid_at);

        return $.ajax({
            url: this._buildPath('user.info')
                        .replace(/USERID/, userId)
                        .replace(/ACCESSTOKEN/, accessToken)
        }, options);
    }

};



(function (module, $) {
    module.exports = InstagramApi;
})(typeof module === 'undefined' ? this['mymodule'] = {} : module, $);


// https://instagram.com/oauth/authorize/?client_id=5f967632b02649dd904a2d441b59d5df&redirect_uri=http://ciro-s-costa.appstop.com/snoopthem&response_type=token

// 2482388.5f96763.5ed2f20cb439432f97c46c341535ef3f