/**
 * Created by huy on 4/18/17.
 */
const m = require('mithril');
const productCompact = {
  oninit: function (vnode) {
    this.view = this.secondView
  },
  view: function (vnode) {

    return m('.db.w-50.pa2.fl',
      m('.db.w-20.w-20-l.w-20-m.fl', m('img', {src: vnode.attrs.itemImg})),
      m('.db.w-80.w-80-l.w-80-m.fl', m('.db',
        m('span.db', `Màu sắc - Size : ${vnode.attrs.itemDetail.color_size}`),
        m('span.db', `Số lượng : ${vnode.attrs.itemQty} || Giá  :NDT ${vnode.attrs.itemPrc}`),
        //luu i chi so ty gia sau nay
        m('span.db', `Thành tiền: NDT ${vnode.attrs.itemQty * vnode.attrs.itemPrc} --- VND ${vnode.attrs.itemQty * vnode.attrs.itemPrc * 3.1}`),
        m('span.db', m('a', {href: vnode.attrs.itemLink}))
        )
      )
    )
  },
  secondView: function (vnode) {
    return m('tr.f6',
      m('td.w-10', m('img', {src: vnode.attrs.itemImg})),
      m('td', `${vnode.attrs.itemDetail.color_size}`),
      m('td', `${vnode.attrs.itemQty} `),
      m('td', `NDT ${vnode.attrs.itemPrc}`),
      //luu i chi so ty gia sau nay
      m('td', `NDT ${vnode.attrs.itemQty * vnode.attrs.itemPrc} --- VND ${vnode.attrs.itemQty * vnode.attrs.itemPrc * 3.1}`),
      m('td', m('a', {href: vnode.attrs.itemLink}))
    )
  }
};
module.exports = productCompact;
