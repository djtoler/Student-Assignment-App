const moment = require('moment');
const Student = require('../models/Students');

function formatMessage(username, text) {
    return {
        username,
        text,
        time: moment().format('h:mm:a')
    }
};

module.exports = formatMessage;