'use strict';

// historyLog-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
    const mongooseClient = app.get('mongooseClient');
    const historyLog = new mongooseClient.Schema({
        sender : {type: String, default : 'Khách'},
        orderCode: {type: String, required: true},
        text: {type: String, required: true},
        createdAt: {type: Date, default: Date.now},
        updatedAt: {type: Date, default: Date.now}
    });

    return mongooseClient.model('historyLog', historyLog);
};
