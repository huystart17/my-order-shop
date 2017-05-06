/**
 * Created by huy on 4/17/17.
 */
const m = require('mithril');
const EX_RATE = 3.1;

let cartSummary =
        {
            oninit: function (vnode) {

            },
            cal_totalPrice: function (prdList) {
                if (prdList) {
                    let totalPrice = 0;
                    let totalQuantity = 0;
                    prdList.forEach(function (t) {
                        totalQuantity = totalQuantity + Number(t.itemQty);
                        totalPrice = totalPrice + t.itemQty * t.itemPrc
                    });
                    return {totalPrice: totalPrice, totalQuantity: totalQuantity};
                }else{
                    return {totalPrice: 0, totalQuantity: 0};
                }
            },

            view: function (vnode) {
                return m('.db',
                    m('.db.f5.mt3.b ', "Thông tin đơn hàng"),
                    m('hr'),

                    m('.db', m('span', m('span', 'Mã đơn: '), m('b', vnode.attrs.orderCode))),
                    m('hr'),

                    m('.db', m('span', m('span', 'Thời gian: '), m('b', (new Date()).toLocaleString()))),
                    m('hr'),

                    m('.db', m('span', `Tổng sản phẩm : ${cartSummary.cal_totalPrice(vnode.attrs.products).totalQuantity}`)),
                    m('hr'),

                    m('.db', m('span', 'Thành tiền (NDT): '), m('b', cartSummary.cal_totalPrice(vnode.attrs.products).totalPrice)),
                    m('hr'),

                    m('.db', m('span', 'Thành tiền (VND): '), m('b', (cartSummary.cal_totalPrice(vnode.attrs.products).totalPrice * EX_RATE * 1000).toLocaleString())),
                    m('hr')
                )
            }
        }
    ;

module.exports = cartSummary;
