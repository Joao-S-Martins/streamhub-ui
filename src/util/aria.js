'use strict'

/**
 * If it is a key event, check to see if it is a space or enter
 */
exports.isNotAriaKeyEvent = function (event) {
    if (event.type === "keyup") {
        // key event is not space or enter
        if (event.which !== 13 && event.which !== 32) {
            return true;
        }
        // prevent space from scrolling the page
        if (event.which === 32) {
            event.preventDefault();
        }
    }
    // event is mouse click or space or enter
    return false;
}
