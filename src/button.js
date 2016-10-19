'use strict';

var $ = require('jquery');
var ButtonTemplate = require('hgn!streamhub-ui/templates/button');
var Command = require('streamhub-ui/command');
var inherits = require('inherits');
var View = require('view');

/**
 * A View that, when clicked, executes a Command.
 * @param command {!Command} The command to execute
 * @param [opts] {?Object=}
 * @param [opts.elClassPrefix] {?string=}
 * @param [opts.className] {?string=}
 * @param [opts.label] {?string=}
 * @param [opts.errback] {?function=} Node-style callback
 */
function Button (command, opts) {
    opts = opts || {};
    if (opts.elClassPrefix) {
        this.elClassPrefix = opts.elClassPrefix;
    }
    if (opts.className) {
        this.elClass += ' '+opts.className;
    }
    if (this.elClassPrefix) {
        this.elClass = distributeClassPrefix(this.elClassPrefix, this.elClass);
    }
    this._disabled = false;
    this._label = opts.label || '';
    this._errback = opts.errback;
    this._insightsVerb = opts.insightsVerb || opts.label || '';

    View.call(this, opts);

    if (typeof command === 'function') {
        command = new Command(command);
    }
    if (command) {
        this._setCommand(command);
    }
}
inherits(Button, View);

function distributeClassPrefix(prefix, classAttr) {
    var classTemplate = "{prefix}-{class}";
    var classes = classAttr
        .split(' ')
        .filter(function (s) { return s; })
        .map(function (oneClass) {
            var prefixedClass = classTemplate
                .replace('{prefix}', prefix)
                .replace('{class}', oneClass);
            return prefixedClass;
        });
    return classes.join(' ');
}

// DOM Event Listeners
Button.prototype.events = View.prototype.events.extended({
    click: '_execute',
    keyup: '_execute'
});

Button.prototype.elClassPrefix = 'lf';
Button.prototype.elClass += 'btn';
Button.prototype.template = ButtonTemplate;

/**
 * The CSS Class to put on this.$el when the command is
 * not allowed to be executed
 */
Button.prototype.disabledClass = 'disabled';

/** Disable the button */
Button.prototype.disable = function () {
    this._setEnabled(false);
};

/** Enable the button */
Button.prototype.enable = function () {
    this._setEnabled(true);
};

Button.prototype.updateLabel = function (label) {
    this._label = label;
    this.render();
};

Button.prototype.updateInsightsVerb = function (verb) {
    this._insightsVerb = verb;
};

Button.prototype.getTemplateContext = function () {
    var context = {};
    context.buttonLabel = this._label;

    return context;
};

Button.prototype.render = function () {
    View.prototype.render.call(this);
    if (this.ariaLabel && !this.opts.buttonUrl) {
        this.el.setAttribute('aria-label', this.ariaLabel);
    }
};

/**
 * Execute the button's command
 * @protected
 */
Button.prototype._execute = function (evt) {
    if (evt.type === "keyup" && 13 !== evt.which && 32 !== evt.which) {
        return;
    }
    if (!this._disabled) {
        this._command.execute(this._errback);
        $(evt.target).trigger('insights:local', {type: this._insightsVerb});
    }
};

/**
 * Set the Command that the Button executes.
 * Only intended to be called once
 * @protected
 * @param command {Command}
 */
Button.prototype._setCommand = function (command) {
    var self = this;
    this._command = command;
    this._setEnabled(this._command.canExecute());
    this._command.on('change:canExecute', function (canExecute) {
        self._setEnabled(canExecute);
    });
};

/**
 * Set whether the Button is enabled or not
 * @protected
 * @param {boolean} isEnabled - Whether the button should be enabled
 */
Button.prototype._setEnabled = function (isEnabled) {
    this.$el.toggleClass(this.disabledClass, ! isEnabled);
    this._disabled = !isEnabled;
};

module.exports = Button;
