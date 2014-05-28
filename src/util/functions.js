'use strict'

/**
 * Memoize a function. That is, only run the function once and cache the result
 * so that it doesn't have to keep calculating it.
 * @param {function()} fn The function to memoize.
 * @return {function()} The memoized function.
 */
exports.memoize = function (fn) {
    return function() {
        var value = fn.call(this);
        fn = function () {
            return value;
        };
        return value;
    };
};
