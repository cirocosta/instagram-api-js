
///////////////////////////////
//////////////////////////// //
// THE THREE RULES OF TDD // //
//////////////////////////// //
///////////////////////////////

/**
 * 1. You are not allowed to write any production code unless it is to
 * make a failing unit test pass.
 *
 * 2. You are not allowed to write any more of a unit test than is
 * sufficient to fail; and compilation failures ARE failures.
 *
 * 3. You are not allowed to write any more production code than is
 * sufficient to pass the one failing unit test.
 *
 * Yep, this is damm hard :P
 */

var $ = require('jQuery');
var sinon = require('sinon');
var InstagramApi = require('../src/api');
var assert = require('assert');

// remember that the order of the params of methods that checks for
// equalitty is (ACTUAL, EXPECTED). Don't mess up (◕‿◕)


describe('sanity', function () {
    it('should go well', function () {
        assert.equal(!!typeof(InstagramApi), true);
    });
});

describe('InstagramApi,', function () {

    var clientId = 'clientId';
    var redirUri = 'redirUri';

    it('should initialize with args', function () {
        assert.throws(function () {
            var api = new InstagramApi();
        }, Error);
    });

    describe('regarding its methods,', function () {

        var USERID = 'USERID';
        var ACCESSTOKEN = 'ACCESSTOKEN';
        var api;

        beforeEach(function () {
            api = new InstagramApi(clientId, redirUri);
        });

        it('should get auth Url', function () {

            var expectedUrl = "https://instagram.com/oauth/authorize/" +
                "?client_id=" + clientId +
                "&redirect_uri=" + redirUri +
                "&response_type=token";

            assert.strictEqual(api.getAuthUrl(), expectedUrl);
        });

        describe('when building path,', function () {
            it('should build user info', function () {
                var expected = 'https://api.instagram.com/v1/' +
                    'users/USERID/' +
                    '?access_token=ACCESSTOKEN';
                var actual = api._buildPath('user.info');

                assert.strictEqual(actual, expected);
            });

            it('should build user feed', function () {
                var expected = 'https://api.instagram.com/v1/' +
                    'users/self/feed' +
                    '?access_token=ACCESSTOKEN';
                var actual = api._buildPath('user.feed');

                assert.strictEqual(actual, expected);
            });

            it('should build user media', function () {
                var expected = 'https://api.instagram.com/v1/' +
                    'users/USERID/media/recent/' +
                    '?access_token=ACCESSTOKEN';
                var actual = api._buildPath('user.media');

                assert.strictEqual(actual, expected);
            });
        });

        describe('when emitting requests,', function () {

            beforeEach(function () {
               sinon.spy($, 'ajax');
            });

            afterEach(function () {
                $.ajax.restore();
            });

            describe('for getting users stuff,', function () {
                it('should use the right params in the request', function () {
                    api.getUserInfo('userid', 'accesstoken');

                    assert.equal(!!$.ajax.called, true);
                    assert.equal($.ajax.getCall(0).args[0].url,
                                 'https://api.instagram.com/v1/users/userid/?access_token=accesstoken');
                });
            });
        });
    });
});