'use strict'

var $ = require('streamhub-sdk/jquery');
var Command = require('streamhub-sdk/ui/command');
var log = require('streamhub-sdk/debug')('streamhub-sdk/ui/share-command');
var inherits = require('inherits');
var Popover = require('streamhub-sdk/ui/popover');
var ShareMenu = require('streamhub-sdk/ui/share-menu');

var ShareCommand = function(opts) {
    this._opts = opts = opts || {};

    Command.call(this, this._defaultFn, opts);

    if (opts.content) {
        this.setContent(opts.content);
    }
    if (opts.positionEl) {
        this.setPositionElement(opts.positionEl);
    }
};
inherits(ShareCommand, Command);

ShareCommand.prototype._defaultFn = function () {
    var self = this;
    //Get the permalink
    if (this._content.permalink) {
        showShare();
        return;
    }

    this._content.collection.getPermalink(this._opts, function (err, data) {
        if (err) {
            log(err);
            return
        }
        self._content.permalink = data;
        showShare();
    });


    function showShare() {
        var share = new ShareMenu({
            model: self._content
        });
        share.render();

        var popover = new Popover();
        popover._position = Popover.POSITIONS.BOTTOM;
        popover.events
        popover.render();
        popover.setContentNode(share.el);

        share.initialize();
        popover.resizeAndReposition(self._positionView.el);

        //Timeout the listener attachment so that it doesn't pick-up the button click
        setTimeout($.proxy(function () {
            $('html').one('click', $.proxy(hideShare, self));
        }, self), 100);


        function hideShare(ev) {
            share.detach();
            share.destroy();
            popover.destroy();
            popover = share = null;
        }
    }
};

ShareCommand.prototype.setContent = function (content) {
    this._content = content;
    this._emitChangeCanExecute();
};

ShareCommand.prototype.setPositionView = function (el) {
    this._positionView = el;
};

ShareCommand.prototype.canExecute = function () {
    return (Command.prototype.canExecute.call(this) && this._content) ? true : false;
};

module.exports = ShareCommand;
