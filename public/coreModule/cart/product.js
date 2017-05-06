/**
 * Created by huy on 4/5/17.
 */
const m = require('mithril');
const service = require('../../service/rest-api');


const product = {
    oninit: function (vnode) {
        if (vnode.attrs.product.itemLink != '') {
            product.view = product.defaultView;
        } else {
            product.view = product.emptyView;
        }
    },

    data: {},
    view: function (vnode) {
        return m('h2', 'is loading')
    },
    //
    defaultView: function (vnode) {
        return m('.fl.w-100.bg-black-10.mb2',
            m('.fl.w-10-l.w-10-m.w-20.mb1',
                m('a.db.w-100.ba', {href: vnode.attrs.product.itemLink}, m('img.db.w-100', {src: vnode.attrs.product.itemImg}))
            ),
            m('.fl.w-90-l.w-90-m.w-80.pa2.f6',
                [
                    m('.fl.w-60-l.w-60-m.w-100.pa2',

                        m('.db', `Màu sắc - Size: ${vnode.attrs.product.itemDetail.color_size}`),

                        m('.db', `Thành tiền: NDT ${vnode.attrs.product.itemQty * vnode.attrs.product.itemPrc} --- VND ${vnode.attrs.product.itemQty * vnode.attrs.product.itemPrc * 3.1}`),
                        m('.db', m('a', {href: vnode.attrs.product.itemLink}, "Link sản phẩm")),
                        m('hr'),
                        m('.db', "Tin nhăn"),
                        m('textarea.w-100',
                            {
                                oninput: function (e) {
                                    vnode.attrs.product.msg = e.target.value;

                                },
                                onblur: function (e) {
                                    vnode.attrs.update()
                                }
                            }
                            , vnode.attrs.product.msg)
                    ),


                    m('.fl.w-20-l.w-20-m.w-50', m('.db', 'Đơn giá'), m('.db', vnode.attrs.product.itemPrc)),
                    m('.fl.w-20-l.w-20-m.w-50',
                        m('.db',
                            m('.db', 'Số lượng'),
                            m('.db', m('input[type=number][min=0][max=100].w-100', {
                                    value: vnode.attrs.product.itemQty,
                                    oninput: function (e) {
                                        vnode.attrs.product.itemQty = e.target.value;
                                        vnode.attrs.update();
                                    }
                                })
                            )
                        )
                    )
                    //m('tr', m('td.tr', '='), m('td', vnode.attrs.product.itemQty * vnode.attrs.product.itemPrc)),
                ]
            )
        )
    },
    emptyView: function (vnode) {
        return m('h2', "Bạn không có sản phẩm nào")
    }

};


module.exports = product;

// let product = function (ordPrd) {
//   this.shop = ordPrd.shop;
//
//   this.itemId = ordPrd.itemId;
//   this.itemName = ordPrd.itemName;
//   this.itemLink = ordPrd.itemLink;
//   this.itemImg = ordPrd.itemImg;
//   this.itemPrc = ordPrd.itemPrc;
//   this.itemQty = ordPrd.itemQty;
//
//   this.msg = ordPrd.msg;
//
//   this.itemDetail = ordPrd.itemDetail;
//
// };
