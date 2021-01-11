const moment = require('moment');

/**
 * Wrap message in an object
 * @param {*} userName
 * @param {*} text 
 */
function formatMessage(userName, text) {
    return {
        userName,
        text,
        time: moment().format('h:mm a')
    }
}

module.exports = formatMessage;