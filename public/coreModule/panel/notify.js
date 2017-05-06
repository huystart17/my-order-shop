/**
 * Created by huy on 4/5/17.
 */
let m = require('mithril');
let options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};

let notify = {
  oninit: function () {

  },
  view: function () {
    return m('div.notify',
      [
        m('span.date-view', new Date().toLocaleString('vi-VI', options)),
        m('span.exchange-rate-view', m('b', "3.360Đ/NDT")),
        m('span.hot-line', m('a', m('b', 'Hot-line', m('a', {href: "tel:01889940451"}, " 01889940451")))),
        m('span.message-view', m('a', m('span',"Tin nhắn5*"), m('sup', '2!'))),
        m('span.cart-view', m('a', 'Giỏ hàng', m('sup', ' 3!'))),


      ]
    )
  }
};

module.exports = notify;
