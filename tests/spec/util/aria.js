'use strict';

var $ = require('jquery');
var AriaUtil = require('streamhub-ui/util/aria');

describe('streamhub-ui/util/aria', function () {

    describe('isNonAriaKeyEvent', function () {
        it('returns false for mouse event', function () {
            var evt = {
                type: 'click',
                which: 1
            };
            expect(AriaUtil.isNonAriaKeyEvent(evt)).toBe(false);
        });

        it('returns false for space', function () {
            var evt = {
                type: 'keyup',
                which: 32,
                preventDefault: function() {}
            };
            expect(AriaUtil.isNonAriaKeyEvent(evt)).toBe(false);
        });

        it('returns false for enter', function () {
            var evt = {
                type: 'keyup',
                which: 13
            };
            expect(AriaUtil.isNonAriaKeyEvent(evt)).toBe(false);
        });

        it('returns true for tab', function () {
            var evt = {
                type: 'keyup',
                which: 9
            };
            expect(AriaUtil.isNonAriaKeyEvent(evt)).toBe(true);
        });

        it('returns true for "a"', function () {
            var evt = {
                type: 'keyup',
                which: 65
            };
            expect(AriaUtil.isNonAriaKeyEvent(evt)).toBe(true);
        });
    });
});
