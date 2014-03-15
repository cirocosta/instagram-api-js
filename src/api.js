
/////////////////////
////////////////// //
// KEEP IN MIND // //
////////////////// //
/////////////////////

// Any fool can write code that a computer can understand. Good
// programmers write code that humans can understand. Martin Fowler,
// 2008.

if (typeof(exports) !== 'undefined') {
    var $ = require('jquery');
}

var Objeto = {
    method: function (url, callback) {
        //do something here;
        return {
            cool: "cool!"
        };
    }
};


(function (exports, $) {
    exports.api = Objeto.method;
})(typeof exports === 'undefined' ? this['mymodule'] = {} : exports, $);