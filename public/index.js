/**
 * Created by huy on 4/5/17.
 */
const m = require('mithril');
const panel = {
    menuGuest: require('./coreModule/panel/menuGuest'),
    notify: require('./coreModule/panel/notify'),
    menuMember: require('./coreModule/panel/menuMember')
};
const client = require('./service/rest-api')

const home = require('./page/staticPage/homePage');
const order = require('./page/staticPage/orderPage');
const cart = require('./coreModule/cart/cart');
const shop = require('./coreModule/shop/shop');
const profile = require('./page/profile')
const admin = require('./adminPage/adminPage')

const form = {
    login: require('./coreModule/form/login'),
    register: require('./coreModule/form/register'),
    signup: require('./coreModule/form/signup')
};

let app = {
    oninit: function (vnode) {

    },
    view: (vnode) => {
        return m('.db#content.db.w-100.w-80-l', [
            m('.db', m(panel.menuGuest)),
            m('main', vnode.children)
        ]);
    },
};
let memberApp = {
    oninit: function (vnode) {

    },
    view: (vnode) => {
        return m('.db#content.db.w-100.w-80-l', [
            m('.db', m(panel.menuMember)),
            m('main', vnode.children)
        ])
    },
}
client.authenticate().then(
    () => {
        m.route(document.getElementById('app'), '/', {
            '/': {view: () => m(memberApp, m(cart))},

            '/cart': {view: () => m(memberApp, m(cart))},
            '/shop': {view: () => m(memberApp, m(shop))},
            '/order/:orderCode': {view: () => m(memberApp, m(order))},
            '/order': {view: () => m(memberApp, m(order))},
            '/admin': {view: () => m(memberApp, m(admin))},
            '/my-info': {view: () => m(memberApp, m(profile, {}))}
        })
    }
).catch(err => {
    m.route(document.getElementById('app'), '/', {
        '/': {view: () => m(app, m(cart))},

        '/cart': {view: () => m(app, m(cart))},
        '/shop': {view: () => m(app, m(shop))},
        '/order/:orderCode': {view: () => m(app, m(order))},
        '/order': {view: () => m(app, m(order))},
        '/login': {view: () => m(app, m(form.login))},
        '/register': {view: () => m(app, m(form.signup))},
        '/signup': {view: () => m(app, m(form.signup))}
    })
})

