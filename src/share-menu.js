'use strict'

var $ = require('streamhub-sdk/jquery');
var BaseMenu = require('streamhub-sdk/ui/menu/base');
var inherits = require('inherits');
var loader = require('livefyre-bootstrap/loader');
var log = require('streamhub-sdk/debug')('streamhub-sdk/ui/share-menu');
var Share = require('streamhub-sdk/ui/menu/share');
var SocialUtil = require('streamhub-sdk/share-format');

/**
 * Flag menu.
 * @constructor
 * @extends {BaseMenu}
 * @param {Object} opts Config options.
 */
function ShareMenu(opts) {
    Share.call(this, opts);

    this.topNavEnabled = false;
}
inherits(ShareMenu, Share);

ShareMenu.prototype.events = BaseMenu.prototype.events;

ShareMenu.prototype.render = function () {
    Share.prototype.render.call(this);
    loader.decorate($('.lf-loader-container')[0], 162);
};

ShareMenu.prototype._renderContent = function () {
    Share.prototype._renderContent.call(this);

    var link = document.createElement('a');
    link.setAttribute('href', this._model.permalink);
    link.setAttribute('class', 'lf-share-link fycon-format-link');
    link.innerText = '  Copy Permalink';
    this.$el.find('.lf-menu-foot').html('').append(link);

    this.delegateEvents();
};

/**
 * Fetches permalink data.
 * @private
 */
ShareMenu.prototype._fetchPermalink = function () {
    if (this._model.permalink) {
        this._renderContent();
        return;
    }
    
    var self = this;
    this._model.collection.getPermalink({content: this._model}, function (err, data) {
        if (err) {
            log(err);
            return
        }
        self._handleFetchSuccess(err, data);
    });
};

/**
 * Handle the option click event. This should trigger a write event that will
 * flag the comment.
 * @param {jQuery.Event} ev
 */
ShareMenu.prototype.handleOptionClick = function (ev) {
    // ev.stopPropagation();
    // this.emit(this.postEvent, this.buildEventData(ev));
    var data = this.buildEventData(ev);

    /** From sharer.js and previously, an annotations controller */
    var baseUrl = SHARE_URLS[data.value];
    var specs = [
        'height=',
        420,
        ',width=',
        550
    ].join('');

    // Support the case where this event bubbles from someone clicking share on
    // a comment or from the selected text popover.
    var content = data.model;
    var shareObj = SocialUtil.contentToShare(content, data.value);
    shareObj.assetServer = this.opts.assetServer;
    shareObj.provider = data.value;
    
    var params = SocialUtil.generateParams(shareObj);
    window.open(baseUrl + params, 'intent', specs);
};

ShareMenu.prototype.hide = function (ev) {
    this.detach();
    this.destroy();
};

/** 
 * From sharer.js and previously, an annotations controller
 * @enum {string}
 */
var SHARE_URLS = {
    facebook: 'https://www.facebook.com/dialog/feed',
    twitter: 'https://twitter.com/intent/tweet'
};


module.exports = ShareMenu;
