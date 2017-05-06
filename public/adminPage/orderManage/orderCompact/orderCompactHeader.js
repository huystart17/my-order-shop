/**
 * Created by huy on 4/25/17.
 */
const m = require('mithril');

const orderCompactHeader = {
    oninit: vnode => {
        //something
    }
    ,
    view: vnode => m(
        'tr',
        m('td.w-10', 'Mã hóa đơn'),
        m('td.w-10', 'Tên khách hàng'),
        m('td.w-10', 'Số điện thoại'),
        m('td.w-10', 'Phương thức thanh toán'),
        m('td.w-10', 'Số lượng'),
        m('td.w-20', 'Địa chỉ'),
        m('td.w-10', 'kVND/NDT'),
        m('td.w-10', 'Status'),
        m('td.w-10', '')
    )
};

module.exports = orderCompactHeader;