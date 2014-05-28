/**
 * @fileOverview Base Controller
 */

var delegate = require('view/delegate');
var EventEmitter = require('event-emitter');
var inherits = require('inherits');

/**
 * Base class for components that handle events but do not map to visual nodes.
 * @constructor
 * @param {Object} opts
 */
function BaseController(opts) {
    EventEmitter.call(this);

    /**
     * Element that events will be bubbled to so that they can be handled.
     * @type {jQuery}
     */
    this.$antenna = opts.antenna;

    /**
     * The collection object.
     * @type {AnnotationsCollection}
     * @private
     */
    this._collection = opts.collection;

    /**
     * Config object.
     * @type {Object}
     * @private
     */
    this._config = opts.config;

    /**
     * The unique id of this controller.
     * @type {string}
     * @private
     */
    this._uid = delegate.getUniqueId();

    this.delegateEvents();
}
inherits(BaseController, EventEmitter);

/** @enum {string} */
BaseController.prototype.events = {};

/**
 * Delegate the events
 */
BaseController.prototype.delegateEvents = function () {
    delegate.delegateEvents(this.$antenna, this.events, this._uid, this);
};

/**
 * Get the active block at any given time.
 * @return {?Block} The active block.
 * @private
 */
BaseController.prototype._getActiveBlock = function () {
    return this._collection.block;
};

/**
 * Destroy the controller.
 */
BaseController.prototype.destroy = function() {
    delegate.undelegateEvents(this.$antenna, this._uid);
    this.$antenna = null;
};

module.exports = BaseController;
