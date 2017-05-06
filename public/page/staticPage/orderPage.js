/**
 * Created by huy on 4/14/17.
 */
const EX_RATE = 3.1
var m = require('mithril');
const orderService = require('../../service/rest-api').service('order');

const cartSummary = require('../../coreModule/cart/cart-summary');
const productCompact = require('../../coreModule/cart/productCompact');
const orderHistory = require('../../coreModule/order/order-module/order-history')

var order = {
    oninit: function (vnode) {
        let queryString = m.route.get();
        let queryresult = m.parseQueryString(queryString.split('/')[2]);
        order.data.orderCode = queryresult.orderCode;
        order.get_data()
    },
    data: {},
    get_data: () => {
        if (order.data.orderCode) {
            orderService.find({
                query: {
                    orderCode: order.data.orderCode
                }
            }).then(result => {
                if (result.data.length > 0) {
                    Object.assign(order.data, result.data[0])
                    console.log(result)
                    order.view = order.result_view
                    m.redraw()
                } else {
                    order.view = order.not_found_view
                    m.redraw()
                }
            }).catch(err => {
                console.log(err)
            })
        } else {

        }
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

    view: vnode => m('.db',
        m('.db.f3.b.tc', 'Tra cứu đơn hàng'),
        m('.db',
            m('p', 'Tìm kiếm đơn hàng'),
            m('.db', m('input', {
                placeholder: "Số điện thoại/ mã đơn",
                oninput: e => {
                    order.data.orderCode = e.target.value
                },
            }), m('button', {
                onclick: () => {
                    order.get_data();
                }
            }, "Tìm"))
        )
    ),
    not_found_view: vnode => [
        m('.db.f3.b.tc', 'Tra cứu đơn hàng'),
        m('.db',
            m('p', 'Tìm kiếm đơn hàng'),
            m('form.db', {
                    onsubmit: e => {
                        e.preventDefault();
                        order.get_data()
                    }
                }, m('input[type=text][name=order]', {
                    placeholder: "Số điện thoại/ mã đơn",
                    oninput: e => {
                        order.data.orderCode = e.target.value
                    },
                }), m('input[type=submit][value=Tìm]')
            ),
            m('hr'),
            m('.db.pt3',
                m('.db.f4', m('span', 'Mã đơn '), m('b', order.data.orderCode || "__"))
            )
        ),
        m('.db', 'Không tìm thấy hóa đơn')
    ],
    result_view: (vnode) => [
        m('.db.f3.b.tc', 'Tra cứu đơn hàng'),
        m('.db',
            m('p', 'Tìm kiếm đơn hàng'),
            m('form.db', {
                    onsubmit: e => {
                        e.preventDefault();
                        order.get_data()
                    }
                }, m('input[type=text][name=order]', {
                    placeholder: "Số điện thoại/ mã đơn",
                    oninput: e => {
                        order.data.orderCode = e.target.value
                    },
                }), m('input[type=submit][value=Tìm]')
            ),
            m('hr'),
            m('.db.pt3',
                m('.db.f4', m('span', 'Mã đơn '), m('b', order.data.orderCode || "__"))
            )
        ),
        order.data.products ?
            m('.db.overflow-auto',

                m('.db.w-50-l.w-50-m.w-100.fl',
                    m('h4', `Trạng thái đơn hàng : ${order.data.status}`),
                    m('h4', 'Thông tin đơn hàng'),
                    m('.db', m(orderHistory, {orderCode: order.data.orderCode})
                    )
                ),
                m('.db.w-50-l.w-50-m.w-100.fl',
                    m('table.prd-list.mt2.pa2.w-100-l.w-100-m.fl.w-100',
                        m('tr',
                            m('th', "Ảnh "),
                            m('th', "Kích cỡ - Size"),
                            m('th', "Số lượng"),
                            m('th', "Giá"),
                            m('th', "Thành tiền")
                        ),
                        order.data.products ? order.data.products.map(function (p) {
                            return m(productCompact, p)
                        }) : "",
                        m('tr',
                            m('td', ""),
                            m('td', ""),
                            m('tđ', m('b',
                                order.cal_totalPrice(order.data.products).totalQuantity
                            )),
                            m('td', ""),
                            m('td', m('b',
                                ` NDT ${order.cal_totalPrice(order.data.products).totalPrice}---
                          VND ${(order.cal_totalPrice(order.data.products).totalPrice * EX_RATE).toLocaleString()}`
                            ))
                        )
                    )
                )
            ) :
            m('h3', 'Đơn hàng không tồn tại')

    ]
};

module.exports = order;
