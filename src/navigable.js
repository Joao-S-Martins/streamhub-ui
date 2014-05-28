/**
 * @fileOverview Navigable view. This optionally adds a nav bar on the top
 * with a back button. It fires events that the NavigableContainer listens for.
 */

var inherits = require('inherits');
var UserAgentUtil = require('streamhub-sdk/user-agent');
var View = require('view');

/**
 * Navigable view.
 * @constructor
 * @extends {View}
 * @param {Object} opts Config options.
 */
var Navigable = function(opts) {
    View.call(this, opts);

    /**
     * @param {?string}
     */
    this._actionDesc = opts.actionDesc;

    /**
     * @param {?function()}
     */
    this._actionHandler = opts.actionHandler || function () {};

    /**
     * The event to trigger when the user clicks the back button.
     * @type {?string}
     * @private
     */
    this._backEvent = opts.backEvent;

    /**
     * The string to use for the back button.
     * @type {?string}
     * @private
     */
    this._backStr = opts.backStr;

    /**
     * Title for the menu.
     * @param {?string}
     * @private
     */
    this._title = opts.title;

    /**
     * Allows for the removal of the top nav bar. Not every subclass will want
     * one I'm guessing.
     * @type {boolean}
     * @private
     */
    this.topNavEnabled = true;
};
inherits(Navigable, View);

/** @enum {string} */
Navigable.CLASSES = {
    ACTION_BTN: 'lf-menu-action-btn',
    BACK_BTN: 'lf-menu-back-btn',
    BODY: 'lf-menu-body',
    HEADER: 'lf-menu-head',
    MENU: 'lf-menu'
};

/** @override */
Navigable.prototype.elClass = Navigable.CLASSES.MENU;

/** @override */
Navigable.prototype.events = (function() {
    var CLASSES = Navigable.CLASSES;
    var events = {};
    var event = UserAgentUtil.isMobile() ? 'tap' : 'click';
    events[event + ' .' + CLASSES.ACTION_BTN] = '_handleActionClick';
    events[event + ' .' + CLASSES.BACK_BTN] = '_handleBackClick';
    return events;
})();

/**
 * @type {function()}
 */
Navigable.prototype.navTemplate = require('hgn!templates/mobile/navbar');

/**
 * The sub template that will be used for the body of the menu template.
 * @type {function()}
 */
Navigable.prototype.subTemplate = require('hgn!templates/navigablesub');

/** @override */
Navigable.prototype.template = require('hgn!templates/navigable');

/**
 * Handle the back button click. This should trigger a navigate event.
 * @param {jQuery.Event} ev
 * @private
 */
Navigable.prototype._handleBackClick = function(ev) {
    // The back click takes us back to the normal DOM, and we don't want
    // to retrigger the event.
    ev.preventDefault();
    this.$el.trigger(this._backEvent || 'thread.navigate_back');
};

/**
 * Handle the action button click. This should call an optional handler
 * @param {jQuery.Event} ev
 * @private
 */
Navigable.prototype._handleActionClick = function (ev) {
    this._actionHandler(ev);
};

/** @override */
Navigable.prototype.getTemplateContext = function () {
    return {
        actionButton: !!this._actionDesc,
        strings: {
            actionBtn: this._actionDesc,
            backBtn: this._backStr || 'menuBackBtn',
            title: this._title
        },
        topNavEnabled: this.topNavEnabled
    };
};

/** @override */
Navigable.prototype.render = function () {
    this.$el.html(this.template(this.getTemplateContext(), {
        body: this.subTemplate.template,
        navbar: this.navTemplate.template
    }));
};

module.exports = Navigable;
