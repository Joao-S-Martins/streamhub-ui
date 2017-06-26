/**
 * @fileOverview Container base class which provides the basic functionality for
 * popovers (e.g. showing, hiding, etc)
 */

var $ = require('jquery');
var inherits = require('inherits');
var nullFunction = function () {};
var UserAgentUtil = require('streamhub-ui/util/user-agent');
var View = require('view');

/** @enum {string} */
var VIS_EVENT = {
    HIDE: 'hide',
    SHOW: 'show'
};

/** @enum {string} */
var VIS_STATE = {
    HIDDEN: 'hidden',
    HIDING: 'hiding',
    SHOWING: 'showing',
    VISIBLE: 'visible'
};

/**
 * Container base class.
 * @constructor
 * @extends {View}
 * @param {Object} opts Config options.
 */
function Container(opts) {
    View.call(this, opts);

    /**
     * The active vis change state.
     * @type {VIS_STATE}
     * @private
     */
    this._activeVisState = VIS_STATE.HIDDEN;

    /**
     * Queued callback functions.
     * @type {Object.<string, Array.<function()>>}
     * @private
     */
    this._queuedEvents = {};
    this._queuedEvents[VIS_EVENT.HIDE] = [];
    this._queuedEvents[VIS_EVENT.SHOW] = [];

    /**
     * Animation time for the popover to hide.
     * @type {number}
     * @private
     */
    this._hideTimeMS = 0;

    /**
     * Animation time for the popover to show.
     * @type {number}
     * @private
     */
    this._showTimeMS = 0;

    this.render();
    var appendee = this.el.parentNode || this.el;
    this._parentEl = opts.parentEl || document.body;
    this._parentEl.appendChild(appendee);
}
inherits(Container, View);

/** @enum {string} */
Container.CLASSES = {
    ACTIVE: 'lf-active',
    BASE: 'lf-thread',
    CONTENT: 'lf-thread-content',
    REMOVE: 'lf-remove'
};

/** @override */
Container.prototype.elClass = Container.CLASSES.BASE;

/** @override */
Container.prototype.events = (function () {
    var events = {};
    if (!UserAgentUtil.isMobile()) {
        events['mousedown'] = '_handlePress';
    }
    return events;
})();

/** @override */
Container.prototype.template = require('hgn!streamhub-ui/templates/container');

/**
 * Handle the mousedown event. Don't want it to bubble all the way to the body
 * because it'll kill itself.
 * @param {jQuery.Event} ev
 * @private
 */
Container.prototype._handlePress = function (ev) {
    ev.stopPropagation();
};

/**
 * Process the set of queued callbacks for a specific type.
 * @param {VIS_EVENT} type The visibility type to process.
 * @private
 */
Container.prototype._processQueuedCallbacks = function (type) {
    var callback;
    while (this._queuedEvents[type].length) {
        callback = this._queuedEvents[type].pop();
        callback();
    }
};

/**
 * Hide the popover.
 * @param {function()=} opt_callback
 */
Container.prototype.hide = function (opt_callback) {
    if (this._activeVisState === VIS_STATE.HIDING) {
        opt_callback && this.onHide(opt_callback);
        return;
    }

    this.$el.addClass(Container.CLASSES.REMOVE);
    setTimeout($.proxy(this.hideInternal, this, opt_callback), this._hideTimeMS);
};

/**
 * Additional functionality to be fired when the popover has completed the hide
 * animation (via CSS).
 * @param {function()=} opt_callback
 */
Container.prototype.hideInternal = function (opt_callback) {
    this.$el.hide().attr('class', this.elClass);
    this._activeVisState = VIS_STATE.HIDDEN;
    (typeof opt_callback === 'function') && opt_callback();
    this._processQueuedCallbacks(VIS_EVENT.HIDE);
};

/**
 * Is the popover in the process of showing?
 * @return {boolean}
 */
Container.prototype.isShowing = function () {
    return this._activeVisState === VIS_STATE.SHOWING;
};

/**
 * Is the popover visible?
 * @return {boolean}
 */
Container.prototype.isVisible = function () {
    return this._activeVisState === VIS_STATE.VISIBLE;
};

/**
 * Add a callback that fires when the popover becomes hidden. If the current
 * state of the popover is hidden, it immediately calls the callback.
 * @param {function()} callback The callback to call when hidden.
 */
Container.prototype.onHide = function (callback) {
    if (this._activeVisState === VIS_STATE.HIDDEN) {
        return callback();
    }
    this._queuedEvents[VIS_EVENT.HIDE].push(callback);
};

/**
 * Add a callback that fires when the popover becomes visible. If the current
 * state of the popover is visible, it immediately calls the callback.
 * @param {function()} callback The callback to call when hidden.
 */
Container.prototype.onShow = function (callback) {
    if (this._activeVisState === VIS_STATE.VISIBLE) {
        return callback();
    }
    this._queuedEvents[VIS_EVENT.SHOW].push(callback);
};

/**
 * Resize and reposition the popover element.
 * @param {Element} elem The element to position the popover next to.
 */
Container.prototype.resizeAndReposition = nullFunction;

/**
 * @param {Element} el The root element of the content
 */
Container.prototype.setContentNode = function (el) {
    var content = this.$('.' + Container.CLASSES.CONTENT);
    content.empty();
    content.append(el);
};

/**
 * Show the popover.
 * @param {Element} el The element to show next to.
 * @param {function()=} opt_callback
 */
Container.prototype.show = function (el, opt_callback) {
    if (this._activeVisState === VIS_STATE.SHOWING) {
        return;
    }

    this._activeVisState = VIS_STATE.SHOWING;
    this.resizeAndReposition(el);
    this.$el.show();
    this.$el.addClass(Container.CLASSES.ACTIVE);

    setTimeout($.proxy(function() {
        this._activeVisState = VIS_STATE.VISIBLE;
        opt_callback && opt_callback();
        this._processQueuedCallbacks(VIS_EVENT.SHOW);
    }, this), this._showTimeMS);
};

module.exports = Container;
