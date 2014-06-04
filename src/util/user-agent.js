/**
 * @fileOverview User agent functions.
 */

var memoize = require('streamhub-ui/util/functions').memoize;

/** @type {Object} */
var userAgent = {};

/**
 * Get the browser version.
 * @return {string|number}
 */
userAgent.getIEVersion = memoize(function () {
    if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
        return parseInt(RegExp.$1, 10);
    }
    return null;
});

/**
 * Is the current browser IE?
 * @return {boolean} yay or nay.
 */
userAgent.isIE = memoize(function () {
    return /MSIE ([0-9]+)\./.test(navigator.userAgent);
});

/**
 * Is the current browser mobile?
 * @return {boolean} yay or nay.
 */
userAgent.isMobile = memoize(function () {
    var mobile = navigator.appVersion.indexOf('Mobile') !== -1;
    var android = navigator.appVersion.indexOf('Android') !== -1;
    return mobile || android;
});

module.exports = userAgent;
