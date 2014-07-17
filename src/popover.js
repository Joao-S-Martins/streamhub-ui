/**
 * @fileOverview Popover base class which provides the basic functionality for
 * popovers (e.g. showing, hiding, etc)
 */

var $ = require('jquery');
var Container = require('streamhub-ui/container');
var domUtil = require('streamhub-ui/util/dom');
var inherits = require('inherits');

/**
 * Popover base class.
 * @constructor
 * @extends {Container}
 * @param {Object} opts Config options.
 */
function Popover(opts) {
    Container.call(this, opts);

    /**
     * The active position of the popover. This is set when the popover is
     * positioned. This only differs from this._position when it's set to auto.
     * @type {?string}
     * @private
     */
    this._activePosition = null;

    /** @override */
    this._hideTimeMS = 300;

    /** @override */
    this._showTimeMS = 300;
}
inherits(Popover, Container);

/** @enum {string} */
Popover.CLASSES = {
    BASE: 'lf-popover',
    ARROW: 'lf-popover-arrow',
    CONTENT: 'lf-popover-content',
    POSITION_PREFIX: 'lf-pos-',
    LF: 'lf'
};

/** @enum {string} */
Popover.POSITIONS = {
    SMART: 'smart',
    BOTTOM: 'bottom',
    LEFT: 'left',
    RIGHT: 'right'
};

/** @enum {function()} */
Popover.POSITION_FN_MAP = {
    'bottom': '_getBottomPosition',
    'left': '_getLeftPosition',
    'right': '_getRightPosition',
    'smart': '_getSmartPosition'
};

/** @override */
Popover.prototype.elClass = Popover.CLASSES.BASE;

/** @override */
Popover.prototype.template = require('hgn!streamhub-ui/templates/popover');

/**
 * Get the bottom position of the element where this popover should be positioned.
 * @param {Element} elem The element to position next to.
 * @return {Object} Top and left positioning for the popover.
 * @private
 */
Popover.prototype._getBottomPosition = function (elem) {
    this._activePosition = Popover.POSITIONS.BOTTOM;
    var boundingRect = domUtil.getBoundingClientRect(elem);

    var top;
    if (this.parentEl === document.body) {
        top = boundingRect.bottom + domUtil.getScrollY();
    } else {
        top = $(elem).height();
    }
    top += 10;

    var left;
    if (this.parentEl === document.body) {
        var availableWidth = boundingRect.right - boundingRect.left;
        var width = this.opts.maxWidth || availableWidth;
        left = (availableWidth - width) / 2;
        left += boundingRect.left + domUtil.getScrollX();
        left = Math.max(0, left);
    } else {
        left = -1 * $(elem).outerWidth() / 2;
    }

    return {
        top: top,
        left: left,
        width: width
    };
};

/**
 * Get the left position of the element where this popover should be positioned.
 * @param {Element} elem The element to position next to.
 * @return {Object} Top and left positioning for the popover.
 * @private
 */
Popover.prototype._getLeftPosition = function (elem) {
    this._activePosition = Popover.POSITIONS.LEFT;
    var boundingRect = domUtil.getBoundingClientRect(elem);
    var top = boundingRect.top + domUtil.getScrollY();
    var right = $('body').width() - boundingRect.left + this.opts.leftPadding;
    var width = boundingRect.left - this.opts.leftPadding;
    return {top: top, right: right, width: width};
};

/**
 * Get the width of the popover.
 * @param {number} width The width of the area where the popover will be.
 * @return {number} The width the popover should be.
 * @private
 */
Popover.prototype._getPopoverWidth = function (width) {
    if (width < this.opts.minWidth) return this.opts.minWidth;
    if (width > this.opts.maxWidth) return this.opts.maxWidth;
    width -= this.opts.sidePadding * (this._activePosition === Popover.POSITIONS.BOTTOM ? 2 : 1);
    return width;
};

/**
 * Get the right position of the element where this popover should be positioned.
 * @param {Element} elem The element to position next to.
 * @return {Object} Top and left positioning for the popover.
 * @private
 */
Popover.prototype._getRightPosition = function (elem) {
    this._activePosition = Popover.POSITIONS.RIGHT;
    var boundingRect = domUtil.getBoundingClientRect(elem);
    var top = boundingRect.top + domUtil.getScrollY();
    var left = boundingRect.right + domUtil.getScrollX() + 10;
    var width = document.body.clientWidth - left;
    return {top: top, left: left, width: width};
};

/**
 * Automatically pick the best position for the popover.
 * @param {Element} elem The element to position next to.
 * @return {Object} Top and left positioning for the popover.
 * @private
 */
Popover.prototype._getSmartPosition = function (elem) {
    var position = this._getRightPosition(elem);
    if (position.width < this.opts.minWidth) {
        return this._getBottomPosition(elem);
    }
    return position;
};

/**
 * Scroll the popover into position. The works on the top and bottom. If it's on
 * the top, it scrolls down so that the top of the popover is 20 pixels below
 * the top fold. If it's on the bottom, it scrolls up so that 200 pixels of the
 * popover are visible. Don't scroll in addition to another scroll, however,
 * which could be the case when there is a permalink being scrolled to.
 * @param {number} top The top position of the popover.
 */
Popover.prototype._scrollIntoPosition = function (top) {
    var scrollElem = $('body,html');
    if (scrollElem.is(':animated')) {
        return;
    }

    var scrollY = domUtil.getScrollY();
    var bottomViewport = scrollY + $(window).height();
    var isAboveBottomFold = top + (this.opts.minPopoverInView || 0) <= bottomViewport;
    var isBelowTopFold = top > scrollY + (this.opts.topSpacing || 0);

    // If it's satisfactorily in view, don't shift the top position.
    if (isAboveBottomFold && isBelowTopFold) {
        return;
    }

    var scrollTop;
    if (!isAboveBottomFold) {
        scrollTop = scrollY + ((this.opts.minPopoverInView || 0) + top - bottomViewport);
    } else if (!isBelowTopFold) {
        scrollTop = top - (this.opts.topSpacing || 0);
    }
    scrollElem.animate({scrollTop: scrollTop}, this.opts.scrollDuration);
};

/** @override */
Popover.prototype.render = function () {
    Container.prototype.render.call(this);
    this.$_contentNode = this.$('.' + Popover.CLASSES.CONTENT);
};

/** @override */
Popover.prototype.resizeAndReposition = function (elem) {
    // Position popover
    var position = this[Popover.POSITION_FN_MAP[this._position]].call(this, elem);
    var POSITION_PREFIX = Popover.CLASSES.POSITION_PREFIX;
    position.width = this._getPopoverWidth(position.width);
    this.$el.css(position).removeClass(function () {
        var classes = [];
        for (var pos in Popover.POSITIONS) {
            if (Popover.POSITIONS.hasOwnProperty(pos)) {
                classes.push(POSITION_PREFIX + Popover.POSITIONS[pos]);
            }
        }
        return classes.join(' ');
    }).addClass(POSITION_PREFIX + this._activePosition);

    var boundingClientRect = this.el.getBoundingClientRect();
    if (boundingClientRect.left < 0) {
        this.$el.css('left', position.left - boundingClientRect.left+'px');
    }

    //this._scrollIntoPosition(position.top);
};

/**
 * @param {Element} el The root element of the content
 */
Popover.prototype.setContentNode = function (el) {
    this.$_contentNode.empty();
    this.$_contentNode.append(el);
};

module.exports = Popover;
