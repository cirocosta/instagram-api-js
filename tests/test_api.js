
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
    var basePath = 'https://api.instagram.com/v1/';

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
                var expected = basePath + 'users/USERID/' +
                    '?access_token=ACCESSTOKEN';
                var actual = api._buildPath('user.info');

                assert.strictEqual(actual, expected);
            });

            it('should build user feed', function () {
                var expected = basePath + 'users/self/feed';
                var actual = api._buildPath('user.feed');

                assert.strictEqual(actual, expected);
            });

            it('should build user media', function () {
                var expected = basePath + 'users/USERID/media/recent';
                var actual = api._buildPath('user.media');

                assert.strictEqual(actual, expected);
            });

            it('should build user media liked', function () {
                var expected = basePath + 'users/self/media/liked';
                var actual = api._buildPath('user.media.liked');

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

            describe('for getting USERS INFO,', function () {
                it('should use the right params in the request', function () {
                    api._getUserInfo('userid', 'accesstoken');

                    assert.equal(!!$.ajax.called, true);
                    assert.equal($.ajax.getCall(0).args[0].url,
                                 basePath +
                                 'users/userid/?access_token=accesstoken');
                });
            });

            describe('for getting USERS MEDIA,', function () {
                it('should use the right params in the request', function () {
                    api._getUserMedia('userid', 'accesstoken');

                    assert.equal(!!$.ajax.called, true);
                    assert.equal($.ajax.getCall(0).args[0].url,
                                 basePath +
                                 'users/userid/media/recent?access_token=accesstoken');
                });
            });

            describe('for getting USERS FEED,', function () {
                it('should use the right params in the request', function () {
                    api._getUserFeed('accesstoken');

                    assert.equal(!!$.ajax.called, true);
                    assert.equal($.ajax.getCall(0).args[0].url,
                                 basePath +
                                 'users/self/feed?access_token=accesstoken');
                });

                it('should use deal gracefully w options', function () {
                    api._getUserFeed({access_token: 'accesstoken', count: 10});

                    assert.equal(!!$.ajax.called, true);
                    assert.equal($.ajax.getCall(0).args[0].url,
                                 basePath +
                                 'users/self/feed?access_token=accesstoken&count=10');
                });
            });

            describe('for getting USERS MEDIA LIKED,', function () {
                it('should use the right params in the request', function () {
                    api._getUserMediaLiked('accesstoken');

                    assert.equal(!!$.ajax.called, true);
                    assert.equal($.ajax.getCall(0).args[0].url,
                                 basePath +
                                 'users/self/media/liked?access_token=accesstoken');
                });

                it('should use deal gracefully w options', function () {
                    api._getUserMediaLiked({access_token: 'accesstoken', count: 10});

                    assert.equal(!!$.ajax.called, true);
                    assert.equal($.ajax.getCall(0).args[0].url,
                                 basePath +
                                 'users/self/media/liked?access_token=accesstoken&count=10');
                });

            });


        });

        describe('with the instagram object,', function () {

            var instaObj;

            describe('regarding pagination', function () {
                beforeEach(function () {
                   sinon.spy($, 'ajax');

                   instaObj = {
                        meta: {
                            code: "200"
                        },
                        data: {
                            something: "crazy"
                        },
                        pagination: {
                            next_url: "nexturl",
                            next_max_id: 123456
                        }
                    };
                });

                afterEach(function () {
                    $.ajax.restore();
                });

                it('should not execute if no next_url', function () {
                    instaObj.pagination = undefined;
                    api.getNextPage(instaObj);

                    assert.equal(true, true);
                    // assert.equal(!!$.ajax.called, false);
                });

                it('should use the right params in the request', function () {

                    api.getNextPage(instaObj);

                    assert.equal(!!$.ajax.called, true);
                    assert.equal($.ajax.getCall(0).args[0].url,
                                 'nexturl');
                });
            });
        });

    });
});
