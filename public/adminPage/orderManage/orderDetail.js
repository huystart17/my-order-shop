/**
 * Created by huy on 4/25/17.
 */
const m = require('mithril');
const clientService = require('../../service/rest-api')
const orderCompactBody = require('./orderCompact/orderCompactHeader')
const product = require('./product')
const orderHistory = require('./order-history')
const orderNote = require('./orderNote')
const otherInfo = require('./otherInfo')
const orderDetail = {
    oninit: function (vnode) {

    },
    data: {},
    get_data: () => {
    },
    view: function (vnode) {
        return [
            m('.db.fl.w-50', vnode.attrs.data.products.map(p => m(product, {product: p}))),
            m('.db.fl.w-50',
                m(otherInfo, {data:vnode.attrs.data}),
                m(orderNote, {data: vnode.attrs.data}),
                m(orderHistory, vnode.attrs.data),

                m('button', {
                    onclick: e => {
                        console.log(vnode.attrs.data)
                        let cf = confirm('Bạn có muốn cập nhập thay đổi')
                        let id = vnode.attrs.data._id
                        let data = vnode.attrs.data
                        cf ? clientService.service('order').update(id, data)
                            .then(clientService.service('history-log').create({
                                sender: 'Hệ Thống',
                                orderCode: vnode.attrs.data.orderCode,
                                text: `Cập nhập----${vnode.attrs.data.status}`
                            }))
                            .then(() => {
                                clientService.service('history-log').find({
                                    query: {
                                        $limit: 1000,
                                        orderCode: vnode.attrs.data.orderCode
                                    }
                                }).then(
                                    result => {
                                        vnode.attrs.data.historyLog = result.data;
                                        m.redraw();
                                    }
                                ).catch(
                                    err => console.log(err)
                                )
                            })
                            .catch(console.log)
                            : ""
                    }
                }, `Cập nhập`)
            )

        ]
    }
};

module.exports = orderDetail;