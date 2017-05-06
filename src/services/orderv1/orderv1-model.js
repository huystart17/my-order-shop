'use strict';

// orderv1-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


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

const productSchema = new Schema({
    shop: {type: String, required: true},

    itemId: {type: String, required: true},
    itemName: {type: String, required: true},
    itemLink: {type: String},
    itemImg: {type: String},
    itemPrc: {type: Number, required: true},
    itemQty: {type: Number, required: true},

    msg: {type: String},

    itemDetail: {type: Schema.Types.Mixed}
});


const orderv1Schema = new Schema({
    sessionId: {type: String},
    userId: {type: Schema.Types.ObjectId},
    orderCode: {type: String, required: true, unique: true},


    /*
     * Status :
     * draft : Hóa đơn mới khỏi tạo chưa được xác nhận
     * wait: Chờ xác nhận
     * confirm: Đã xác nhận
     * in working: đang xử lý
     * delayed on china : Chậm nhập kho bên tàu
     * in warehouse : Đã về kho
     * in shiper: chuyển cho shipper
     * shipping: đang giao hàng
     *
     * */
    status: {type: Number, required: true, default: 0},
    isSubmited: {type: Boolean, default: true},
    /*
     * ordered: đã đặt hàng
     * delayed on china: chậm hàng bên tàu
     * delayed on vietnam: chậm hàng bên việt
     * in warehouse : Trong kho
     * */


    logStatus: {type: String, default: "Đang nghĩ"},


    msgFrmCpn: {type: String, default: "Cám ơn đã tin tưởng chúng tôi"},

    prd: [productSchema],

    createdAt: {type: Date, 'default': Date.now},
    updatedAt: {type: Date, 'default': Date.now}
});

const orderv1Model = mongoose.model('orderv1', orderv1Schema);

module.exports = orderv1Model;
