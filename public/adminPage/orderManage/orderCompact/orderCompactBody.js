/**
 * Created by huy on 4/25/17.
 */
const m = require('mithril');
const EXRATE = 3.1
const statusList = require('../statusList')
const orderDetail = require('../orderDetail')
const addressData = require('../../../coreModule/otherData/vietnam_provinces_cities.json')

const orderCompact = {

    oninit: function (vnode) {
        vnode.attrs.viewDetail = false
    },
    data: {
        cart: {}
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

    view: function (vnode) {
        return vnode.attrs ? [m('tr',
            m('td', vnode.attrs.data.orderCode),
            m('td', vnode.attrs.data.userName),
            m('td', vnode.attrs.data.phone),
            //m('td', vnode.attrs.data.address.toString()),
            m('td', vnode.attrs.data.payBy),
            m('td', orderCompact.cal_totalPrice(vnode.attrs.data.products).totalQuantity),
            m('td', `${addressData[vnode.attrs.data.address.province].name} ,${addressData[vnode.attrs.data.address.province].cities[vnode.attrs.data.address.city]}, ${vnode.attrs.data.address.other}`),
            m('td', (orderCompact.cal_totalPrice(vnode.attrs.data.products).totalPrice * EXRATE).toLocaleString() + '/' + orderCompact.cal_totalPrice(vnode.attrs.data.products).totalPrice.toLocaleString()),
            m('td', !vnode.attrs.data.viewDeatail ? `${vnode.attrs.data.status}` :
                m('select',
                    {
                        onchange: e => {
                            vnode.attrs.data.status = e.target.value

                        }
                    },
                    statusList.map(status => m('option', {
                        value: status.text,
                        selected: status.text == vnode.attrs.data.status,

                    }, status.text))
                )
            ),
            m('td', m('span.underline.pointer.hover-blue',
                {onclick: e => vnode.attrs.data.viewDeatail = !vnode.attrs.data.viewDeatail}, 'Chi tiết'))
        ),
            vnode.attrs.data.viewDeatail ? m('tr',
                m('td[colspan=9].pb3.bg-washed-yellow',
                    m(orderDetail, {data: vnode.attrs.data}))
            ) : ""
        ] : ""
    }
};

module.exports = orderCompact;