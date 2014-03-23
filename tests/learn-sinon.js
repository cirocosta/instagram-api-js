'use strict';
/**
 * It provides some basic showoff of some functionalities that sinonJs
 * gives us. This is some things that we'll be using for our tests.
 */


var $ = require('jQuery');
var sinon = require('sinon');
var assert = require('assert');

//takes a function as an argument and returns a new function. It uses
//the concept of closure, which will let us not call this function more
//than one time. How could we know if `once` the function is acting as
//we expect, i.e, it is calling the callback function that we are
//passing if it is the first time we are calling it?
function once (fn) {

    // private stuff

    var privateValue = "LOL";
    var returnValue,
        called = false;

    return function () {
        if (!called) {
            called = true;
            returnValue = fn.apply(this, arguments);
        }

        return returnValue;
    }
}

describe('for sanity', function () {

    it("jquery should be loaded", function () {
        assert.equal(!!$, true);
    });
});

describe('our function', function () {
    it('should call the original function', function () {
        // a spy is a function that records: arguments, return value,
        // value of `this` and exception thrown calls. It is designed to
        // be used for testing callbacks and also how certain functions
        // and/or methods are being used throught the system which we
        // are aiming to test here.
        var callback = sinon.spy();
        var proxy = once(callback);
        var obj = {};

        proxy();

        assert.equal(!!callback.thisValues, true);
        assert.equal(callback.called, true);
    });

    it('should return the return value from the original fn', function () {
        // stubs are functions (spies) with pre-programmed behavior.
        // When wrapping an existing function with a stub, the original
        // function is not called, but the stub per se.  We use it to
        // force some desired behavior from a fun/method, e.g, forcing a
        // method to raise an error so that we are able to test the
        // error handling stuff. Another situation is for preventing a
        // specific method from being called directly.

        var callback = sinon.stub().returns(42);
        var proxy = once(callback);

        assert.equal(proxy(), 42);
    });
});

// here we are instantiating a function which will trigger the jquery's
// ajax function which initiates an asynchronous work and then, when the
// response come back, it calls the function (callback) that we passed
// as an argument. We then might want to test if the getTodos function
// is actually triggering network activity.
var getTodos = function (listId, callback) {
    $.ajax({
        url: '/todo/' + listId + '/items',
        success: function (data) {
            callback(null, data);
        }
    });
}

// we are able to spy on objects that already exists. There are three
// ways to create a spy for that:

// sinon.spy() -->
//
// sinon.spy(myFunc) -->
//
// sinon.spy(object, 'method') -->

describe('testing ajax', function () {

    // Here we'll say that we are going to spy on a particular method
    // that is contained in an object. The spy won't do anything.
    beforeEach(function () {
        sinon.spy($, 'ajax');
    });

    // unwrapping the spy
    afterEach(function () {
        $.ajax.restore();
    });

    it("should know if ajax was called and know the resources used", function () {
        $.getJSON("/some/resource");

        assert.equal(!!$.ajax.calledOnce, true);
        assert.equal("/some/resource", $.ajax.getCall(0).args[0].url);
        assert.equal("json", $.ajax.getCall(0).args[0].dataType);
    });

});

//////////////////
// TESTING MOCK //
//////////////////

var Api = function (name) {
    this.name = name;
};

Api.prototype.metodo = function() {
    return this.name;
};

Api.prototype.reveal = function () {
    return this.metodo();
}

describe('mocking bird', function () {

    it('mocking bird', function () {
        var api = new Api('wow');
        var mock = sinon.mock(api);
        var expectation = mock.expects('metodo').once();

        api.reveal();
        expectation.verify();
    });
});




