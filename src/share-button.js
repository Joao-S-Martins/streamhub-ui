'use strict'

var Button = require('streamhub-sdk/ui/hub-button');
var inherits = require('inherits');
var ShareCommand = require('streamhub-sdk/ui/share-command');

/**
 * 
 * [opts] {Object=}
 * [opts.command] {Command=} Command in place of the default.
 * [opts.content] {Content=} Content to share. Can be set later.
 */
var ShareButton = function (opts) {
    opts = opts || {};
    opts.className = opts.className || 'btn-link content-share';
    opts.label = opts.label || 'Share';

    var cmd = opts.command;
    if (!cmd) {
        cmd = new ShareCommand(opts); 
    }

    Button.call(this, cmd, opts);
    cmd.setPositionView(this);
}
inherits(ShareButton, Button);

ShareButton.prototype.setContent = function (content) {
    this._command.setContent && this._command.setContent(content);
};

module.exports = ShareButton;
