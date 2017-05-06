'use strict';

// src/services/orderv1/hooks/guestOrder.js
//
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/hooks/readme.html

const defaults = {};
let orderNum = 0;
module.exports = function (options) {
  options = Object.assign({}, defaults, options);

  return function (hook) {

    const orderModel =hook.app.service('orderv1s');
    //Check available order , if not make new, if have push product in side
      //find available order
    console.log("find 1");
    const currentOrder = orderModel.find({query:{sessionId: hook.params.mySid}});

      //create new with added product

      //update to database


      // make new
    let ordPrd = hook.data;

    let prd = {
      shop: ordPrd.seller_id,

      itemId: ordPrd.item_id,
      itemName: ordPrd.item_title,
      itemLink: ordPrd.item_link,
      itemImg: ordPrd.item_image,
      itemPrc: ordPrd.item_price,
      itemQty: ordPrd.quantity,

      msg: ordPrd.comment,

      itemDetail: ordPrd


    };
    orderNum++;
    let data = {
      sessionId: hook.params.mySid,
      //userId: "",
      orderCode: ''+Date.getDate()+Date.getMonth()+Date.getFullYear()+'_'+orderNum,
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
      prd: [],
    };
    data.prd.push(prd);
    hook.data = data;
    hook.guestOrder = false;
  };
};
let sampleRequest = {
  data: {
    type: 'forever21',
    item_id: '2000269309',
    item_title: '纯色一字肩七分袖连衣裙',
    item_image: 'http://www.forever21.cn/images/1_front_58/00269309-01.jpg',
    item_link: 'http://www.forever21.cn/Product/Product.aspx?BR=f21',
    Category: 'promo_offshoulder',
    ProductID: '2000269309',
    VariantID: '',
    item_price: '169.00',
    comment: 'fdsfd',
    color_size: 'Light blue(淡蓝色);S',
    seller_id: 'forever21',
    seller_name: 'forever21',
    quantity: '1',
    version: '20140225'
  },
  params: {
    query: {},
    provider: 'rest',
    session: {
      Session: {
        cookie: {
          path: '/',
          _expires: null,
          originalMaxAge: null,
          httpOnly: true
        }
      }
    },
    mySid: 'A0Z5CIKLCJodpFmJV2aZpCuGIMQUl2vP',
    token: undefined
  }
};
