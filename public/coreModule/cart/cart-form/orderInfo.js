/**
 * Created by huy on 4/13/17.
 */
const m = require('mithril');
const client = require('../../../service/rest-api')
const provinces = require('../../otherData/vietnam_provinces_cities.json');
let orderInfo = {
    oninit: function (vnode) {
        client.authenticate().then(function () {
            orderInfo.isLogin = true;
            client.service('users')
                .find()
                .then(console.log)
                .catch(console.log)
        }).catch(function (err) {
            orderInfo.isLogin = false;
            console.log(err)
        });
        Object.assign(vnode.attrs.cart, orderInfo.data)
        client.service('users').find()
            .then(result => {
                orderInfo.data = result.data[0].userInfo
                vnode.attrs.cart.userId = result.data[0]._id
                Object.assign(vnode.attrs.cart, orderInfo.data)
                console.log(vnode.attrs.cart)
            }).then(m.redraw)
            .catch(console.log)
        //sau nay dung cho tu dien thong tin
        //orderInfo.data = {}

    },

    isLogin: false,
    buyAsGuest: true,
    data: {
        userName: "",
        phone: "",
        address: {
            province: "HANOI",
            city: "QUANBADINH",
            other: ""
        }
    },
    set_orderData: function (order) {
        order.userName = orderInfo.data.userName
        order.phone = orderInfo.data.phone
        order.address = {
            city: orderInfo.data.address.city,
            province: order.address.province
        }

    },
    formSeclectData: {
        get_provinceList: function () {
            let provinceList = [];
            for (key in provinces) {
                provinceList.push(key);
            }
            return provinceList
        },
        get_cityList: function (province) {
            console.log(province)
            let cityList = [];
            for (key in provinces[province].cities) {
                cityList.push(key);
            }
            return cityList
        }
    },
    view: function (vnode) {
        return m('.db',

            m('.f5.b.mt3', "Thông tin của bạn"),
            m('hr'),
            m('form', {
                    onsubmit: function (e) {
                        e.preventDefault();
                        vnode.attrs.step(2);
                        vnode.attrs.switch_view();
                    }
                },
                [
                    m('label.db.ma2',
                        m('.db', "Tên của bạn"),
                        m('input.db.w-100', {
                            required: true,
                            value: vnode.attrs.cart.userName,
                            oninput: function (e) {
                                vnode.attrs.cart.userName = e.target.value
                            }
                        })
                    ),

                    m('label.db.ma2',
                        m('.db', "Số điện thoại"),
                        m('input.db.w-100[type=tel]', {
                            required: true,
                            value: vnode.attrs.cart.phone,
                            oninput: function (e) {
                                vnode.attrs.cart.phone = e.target.value
                            },
                            onblur: function () {
                                vnode.attrs.update();
                            }
                        })
                    ),

                    m('label.db.ma2',
                        m('.db', "Tinh"),
                        m('select.db.w-100', {
                                value: vnode.attrs.cart.address.province,
                                onchange: function (e) {
                                    vnode.attrs.cart.address.province = e.target.value;
                                    vnode.attrs.cart.address.city = orderInfo.formSeclectData.get_cityList(vnode.attrs.cart.address.province)[0];

                                },
                                onblur: function () {
                                    vnode.attrs.update();
                                }
                            },
                            orderInfo.formSeclectData.get_provinceList().map((c) => m('option', {
                                value: c
                            }, provinces[c].name))
                        )
                    ),

                    m('label.db.ma2',
                        m('.db', "Huyện"),
                        m('select.db.w-100', {
                                value: vnode.attrs.cart.address.city,
                                onchange: function (e) {
                                    vnode.attrs.cart.address.city = e.target.value;
                                    // console.log(orderInfo.data.address)
                                },
                                onblur: function () {
                                    vnode.attrs.update();
                                }
                            },
                            orderInfo.formSeclectData.get_cityList(vnode.attrs.cart.address.province).map((p) => m('option', {
                                value: p,

                            }, provinces[vnode.attrs.cart.address.province].cities[p]))
                        )
                    ),

                    m('label.db.ma2',
                        m('.db', "Địa chỉ"),
                        m('textarea.w-100', {
                            required: true,
                            value: vnode.attrs.cart.address.other,
                            oninput: function (e) {
                                vnode.attrs.cart.address.other = e.target.value
                            },
                            onblur: function () {
                                vnode.attrs.update();
                            }
                        })
                    ),

                    m('label.db.ma2',
                        m('.db', "Tin nhắn"),
                        m('textarea.db.w-100', {
                            oninput: function (e) {
                                vnode.attrs.cart.message = e.target.value;
                            },
                            onblur: function (e) {
                                vnode.attrs.update();
                            }
                        })
                    ),
                    m('p.db.pa2.underline.pointer', {
                        onclick: function (e) {
                            vnode.attrs.step(0);
                            vnode.attrs.switch_view();
                        }
                    }, "Quay lại giỏ hàng"),
                    m('input.db[type=submit].pa2.br3.w-100.bg-orange.white', {value: 'Tiến hành thanh toán'})
                ])
        )

    }
};

module.exports = orderInfo;
