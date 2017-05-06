/**
 * Created by huy on 4/5/17.
 */
const m = require('mithril');
const stream = require('mithril/stream');
const appService = require('../../service/rest-api');
const cartService = appService.service('/cartv-1');
const sampleRequest = require('./samplecart');

const step = require('./cart-step');
const cartSummary = require('./cart-summary');

const product = require('./product');
const productCompact = require('./productCompact');

const orderInfo = require('./cart-form/orderInfo');
const payment = require('./cart-form/paymentMethod');


const EX_RATE = 3.1;
const cart = {
    oninit: function (vnode) {
        cart.view = cart.defaultView;
        cart.get_data();

    },

    switch_view: function () {
        if (cart.step == 0) {
            cart.view = cart.defaultView;
        }
        else if (cart.step == 1) {
            cart.view = cart.inputInfoView;

        } else if (cart.step == 2) {
            cart.view = cart.paymentView;

        }
    },

    data: {},
    step: stream(0),
    isWantedToBuy: false,

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

    get_data: function (vnode) {

        cartService.find().then(function (result) {
            cart.data = result;
            // console.log(result);
            // console.log(cart.data);
            m.redraw();
        }).catch(function (err) {
            console.log(err)
        })
    },
    update_data: function () {
        cartService.update(1, {cart: cart.data}).then(function (result) {
            // console.log(result)
        }).catch(function (err) {
            console.log(err)
        })
    },
    view: function () {
        return m('.db', 'In loading')
    },

    defaultView: function (vnode) {
        return m('.cart.f6', [

            m('.db.ma2',
                m(step, {step: cart.step})
            ),
            m('hr'),
            m('.prd-list.mt2.pa2.w-60-l.w-60-m.fl.w-100',
                cart.data.products ? cart.data.products.map(function (p) {
                    return m('.w-100.fl.relative', [
                        m(product, {product: p, update: cart.update_data}),
                        m('button.br-100.absolute',
                            {
                                onclick: function () {
                                    let removeIndex = cart.data.products.indexOf(p);
                                    cart.data.products.splice(removeIndex, 1);
                                    cart.update_data();
                                },
                                style: {right: '-5px', top: '-5px'}
                            },
                            'x')
                    ])
                }) : m('h2', 'Bạn chưa mua hàng')
            ),


            m('.total.db.fl.w-40-l.w-40-m.w-100.pa2',
                m(cartSummary, cart.data),
                m('.db.i', '*Bạn cần chọn hàng để nhập thông tin'),
                m('button[type=button].pa2.br3.w-100.bg-orange.white', {
                    disabled: (!cart.data.products) ? true : (cart.data.products.length == 0),

                    onclick: function (e) {
                        cart.isWantedToBuy = true;
                        cart.step(1);
                        cart.switch_view();

                    }
                }, 'Nhập thông tin')
            )
        ])
    },
    inputInfoView: function () {
        return m('.cart.f6', [

            m('.db.ma2',
                m(step, {step: cart.step})
            ),
            m('hr'),

            m('.total.db.fl.w-40-l.w-40-m.w-100.pa2',
                m(orderInfo, {
                    cart: cart.data,
                    step: cart.step,
                    switch_view: cart.switch_view,
                    update: cart.update_data
                }),
                m('a.db.tc', {
                    onclick: function () {
                        cart.step(0);
                        cart.switch_view();
                    }
                })
            ),

            m('table.prd-list.mt2.pa2.w-60-l.w-60-m.fl.w-100',
                m('tr',
                    m('th', "Ảnh "),
                    m('th', "Kích cỡ - Size"),
                    m('th', "Số lượng"),
                    m('th', "Giá"),
                    m('th', "Thành tiền")
                ),
                cart.data.products ? cart.data.products.map(function (p) {
                    return m(productCompact, p)
                }) : "",
                m('tr',
                    m('td', ""),
                    m('td', ""),
                    m('tđ', m('b', cart.cal_totalPrice(cart.data.products).totalQuantity)),
                    m('td', ""),
                    m('td', m('b',
                        ` NDT ${cart.cal_totalPrice(cart.data.products).totalPrice}--- 
                          VND ${(cart.cal_totalPrice(cart.data.products).totalPrice * EX_RATE).toLocaleString()}`
                    ))
                )
            )


        ])

    },
    paymentView: function () {
        return m('.db', [
            m('.db.ma2',
                m(step, {step: cart.step})
            ),
            m('.fl.w-50', m(payment, {cart: cart.data})),
            m('.fl.w-50', m(cartSummary, cart.data),
                m('button[type=button].pa2.br3.w-20.bg-orange.white.w-20', {
                    onclick: function (e) {
                        cart.isWantedToBuy = true;
                        cart.step(2);
                        cart.switch_view();

                        cartService.remove(1, {query: {orderCode: cart.data.orderCode}}).then(function (result) {
                            console.log(result)
                        }).catch(function (err) {
                            console.log(err)
                        });
                        appService.service('order').create(cart.data)

                        appService.service('history-log').create({
                            orderCode: cart.data.orderCode,
                            text: 'Hóa đơn được khởi tạo',
                            sender: 'Hệ thống'
                        })
                        appService.service('history-log').create({
                            orderCode: cart.data.orderCode,
                            text: cart.data.message,
                            sender: 'Khách hàng'
                        })
                        location.href = `/#!/order/&orderCode=${cart.data.orderCode}`
                    }
                }, 'Gửi đơn hàng')
            ),

        ])
    }
};

module.exports = cart;

