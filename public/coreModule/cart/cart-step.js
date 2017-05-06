/**
 * Created by huy on 4/17/17.
 */
const m = require('mithril');
const cartStep = {
    oninit: function (vnode) {
        cartStep.step = vnode.attrs.step;

    },
    step: 0,
    //chon san pham
    //Nhap thong tin
    //Phuong thuc thanh toan
    //Cam on
    //ma don hang 170417-stt
    view: function (vnode) {
        return m('ul.list.breadcrumb', [
            m('li', m('a.link' + ((vnode.attrs.step == 0) ? ".b" : ""), "Giỏ hàng")),
            m('li', m('a.link' + ((vnode.attrs.step == 1) ? ".b" : ""), "Nhập thông tin")),
            m('li', m('a.link' + ((vnode.attrs.step == 2) ? ".b" : ""), "Thanh toán")),
            m('li', m('a.link' + ((vnode.attrs.step == 3) ? ".b" : ""), "Cám ơn"))
        ])
    }

};
module.exports = cartStep;
