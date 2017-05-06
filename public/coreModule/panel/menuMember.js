/**
 * Created by huy on 4/5/17.
 */
var m = require('mithril');
const client = require('../../service/rest-api')
var menu = {
    oninit: function () {

    },
    view: function () {
        return m('nav.ma0.bg-black.fixed.h-30px.w-80-l.w-100.z-9999', {style: {top: 0}},
            [
                //{text: 'Home', href: '/'},
                {text: 'Giỏ hàng', href: '/cart'},
                {text: 'Cửa hàng', href: '/shop'},
                {text: 'Đơn hàng', href: '/order'},
                {text: 'Thông tin và tài chính', href: '/my-info'}

            ].map(
                l => m('span', m('a.dib.link.pa2.white.bg-animate', {
                        href: l.href, oncreate: m.route.link
                    }
                    , l.text))),
            m('span', m('a.dib.link.pa2.white.bg-animate', {
                    onclick: e=>client.logout().then(()=> {location.href= '/'})
                }
                , 'Đăng xuất')),
            m('span.fr', m('a.dib.link.pa2.white.bg-animate', 'Hotline: 0962710499'))
        )
    }
};

module.exports = menu;
