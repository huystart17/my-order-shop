'use strict';

// order-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const statusList = [
    {
        description: "",
        text: "Chờ Tiếp nhận",
        editable: true
    },
    {
        description: "",
        text: "Đã xác nhận",
        editable: true
    },
    {
        description: "",
        text: "Chưa liên lạc được với shop",
        editable: true
    },
    {
        description: "",
        text: "Đang xử lý",
        editable: true
    },
    {
        description: "",
        text: "Chậm nhập kho Trung Quốc",
        editable: true
    },
    {
        description: "",
        text: "Đã về kho",
        editable: true
    },
    {
        description: "",
        text: "Đang ship cho khách ",
        editable: true
    },
    {
        description: "",
        text: "Đã hoàn thành",
        editable: false
    },

];

module.exports = function (app) {
    const mongooseClient = app.get('mongooseClient');
    const order = new mongooseClient.Schema({
            //text: {type: String, required: true},
            createdAt: {type: Date, default: Date.now},
            updatedAt: {type: Date, default: Date.now},
            status: {type: String, default: statusList[0].text},

            sessionId: {type: String},
            userId: {type: String},
            orderCode: {type: String},
            otherInfo: {type: mongooseClient.Schema.Types.Mixed},
            address: {type: mongooseClient.Schema.Types.Mixed},
            userName: {type: String},
            phone: {type: String},
            payBy: {type: String},
            message: {type: String},

            adminNote: {type: String},
            isSubmited: {type: Boolean, default: true},

            products: [mongooseClient.Schema.Types.Mixed]


        })
        ;

    return mongooseClient.model('order', order);
};

