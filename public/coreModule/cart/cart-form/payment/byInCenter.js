/**
 * Created by huy on 4/14/17.
 */
var m = require('mithril');

var byInCenter = {
    oninit: function (vnode) {

    },
    view: function (vnode) {
        return [

            m('.db.pa3', m.trust(`
        <p>Bước 1: Quý khách hãy đến nạp tiền trực tiếp tại trụ sở của nhập hàng tiết kiệm</p> 
        <p>Địa chỉ: 
        <b>12 Ngã Tư Sở - Hà Nội</b> </p>
        <p>Bước 2: Sau đó cung cấp mã đơn hàng <b>${vnode.attrs.orderCode}</b> hoặc <b>số điện thoại</b> của quý khách cho nhân viên </p>
        <p>Bước 3: Nạp tiền và nhận hóa đơn</p>
        
      `))
        ]
    }

};

module.exports = byInCenter;
