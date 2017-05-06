/**
 * Created by huy on 4/25/17.
 */
const m = require('mithril');

const ordersManager = {
    oninit: function (vnode) {

    },
    view: function (vnode) {
        return m('.db', 'hello world')
    }
};

module.exports = ordersManager;