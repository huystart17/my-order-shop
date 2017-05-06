/**
 * Created by huy on 5/6/17.
 */
const m = require('mithril');

const otherInfo = {
    oninit: vnode => {
        vnode.attrs.data.otherInfo = vnode.attrs.data.otherInfo || {
                prepaid: 0,
                shipFromChina: 0
            }
        //something
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
        } else {
            return {totalPrice: 0, totalQuantity: 0};
        }
    },
    view: vnode => m(
        '.db.pa1.mb2',
        m('.db.underline', 'Đã trả'),
        m('label.db',
            m('span', 'Trả trước(*VND)'),
            m('input.db[type=Number]', {
                value: vnode.attrs.data.otherInfo.prepaid || 0,
                oninput: e => {
                    vnode.attrs.data.otherInfo.prepaid = e.target.value
                }
            })
        ),
        m('.db.underline.b.mb2', m('span', 'Tổng chi phí:'), m('span', otherInfo.cal_totalPrice(vnode.attrs.data.products).totalPrice + vnode.attrs.data.otherInfo.shipFromChina)),
        m('label.db',
            m('span.db', 'Tiền Ship từ Trung Quốc(*VND)'),
            m('input[type=Number]', {
                value: vnode.attrs.data.otherInfo.shipFromChina || 0,
                oninput: e => {
                    vnode.attrs.data.otherInfo.shipFromChina = e.target.value
                }
            })
        ),
        m('label.db',
            m('span.db  ', 'Giá trị hóa đơn(*VND)'),
            m('input[type=Number][disabled]', {
                value: otherInfo.cal_totalPrice(vnode.attrs.data.products).totalPrice
            })
        ),

        m('.db.underline', m('span', 'Tiền phải trả:'), m('span', Number(otherInfo.cal_totalPrice(vnode.attrs.data.products).totalPrice) + Number(vnode.attrs.data.otherInfo.shipFromChina) - Number(vnode.attrs.data.otherInfo.prepaid)))
    )
};

module.exports = otherInfo;