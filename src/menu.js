/**
 * @fileOverview Base menu. This provides menu-specific abilities.
 */

var $ = require('jquery');
var inherits = require('inherits');
var linkTemplate = require('hgn!streamhub-ui/templates/menu');
var Navigable = require('streamhub-ui/navigable');
var UserAgentUtil = require('streamhub-ui/util/user-agent');

/**
 * Base menu.
 * @constructor
 * @extends {Navigable}
 * @param {Object} opts Config options.
 */
var BaseMenu = function(opts) {
    Navigable.call(this, opts);

    /**
     * Comment model.
     * @type {Comment}
     * @private
     */
    this._model = opts.model;

    /**
     * The post event type for this class.
     * @type {string}
     * @private
     */
    this.postEvent = null;
};
inherits(BaseMenu, Navigable);

/** @enum {string} */
BaseMenu.CLASSES = Navigable.CLASSES;

/** @override */
BaseMenu.prototype.events = (function() {
    var events = {};
    var event = UserAgentUtil.isMobile() ? 'tap' : 'click';
    events[event + ' .' + BaseMenu.CLASSES.BODY + ' > li'] = 'handleOptionClick';
    return events;
})();
$.extend(BaseMenu.prototype.events, Navigable.prototype.events);

/**
 * Iterate over the list of link configs and build a document fragment from them.
 * @return {?DocumentFragment}
 * @private
 */
BaseMenu.prototype._buildMenuLinks = function() {
    var linkConfig = this.getLinkConfig();
    if (!linkConfig.length) {
        return null;
    }
    var frag = document.createDocumentFragment();
    $.each(linkConfig, function(i, cfg) {
        frag.appendChild($(linkTemplate(cfg))[0]);
    });
    return frag;
};

/**
 * Build the event data object.
 * @param {jQuery.Event} ev
 * @return {Object}
 */
BaseMenu.prototype.buildEventData = function(ev) {
    return {
        messageId: this._model.id,
        model: this._model,
        value: $(ev.currentTarget).attr('data-value')
    };
};

/**
 * Config for the user-clickable links.
 * @type {function(): Array.<Object>}
 */
BaseMenu.prototype.getLinkConfig = function() {
    return [];
};

/**
 * Handle the option click event. This should trigger a write event that will
 * flag the comment.
 * @param {jQuery.Event} ev
 */
BaseMenu.prototype.handleOptionClick = function(ev) {
    ev.stopPropagation();
    this.$el.trigger(this.postEvent, this.buildEventData(ev));
};

/**
 * Load menu links onto the page.
 */
BaseMenu.prototype.loadMenuLinks = function() {
    var frag = this._buildMenuLinks();
    frag && this.$('.' + BaseMenu.CLASSES.BODY).prepend(frag);
};

/** @override */
BaseMenu.prototype.render = function() {
    Navigable.prototype.render.call(this);
    this.loadMenuLinks();
};

module.exports = BaseMenu;
