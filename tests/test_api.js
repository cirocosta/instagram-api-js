
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

var $ = require('jquery');
var sinon = require('sinon');
var insta_api = require('../src/api');
var assert = require('assert');

// remember that the order of the params of methods that checks for
// equalitty is (ACTUAL, EXPECTED). Don't mess up (◕‿◕)


describe('sanity', function () {
    it('should go well', function () {
        assert.equal(!!typeof(insta_api), true);
    });
});