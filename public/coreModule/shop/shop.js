/**
 * Created by huy on 4/11/17.
 */
const m = require('mithril');
const client = require('../../service/rest-api');
const sampleProduct = require('./sampleProduct');

const shop = {
    oninit: function (vnode) {

    },

    view: function (vnode) {
        return [
            m('h1', 'Chào bạn đến với shop'),
            m('button', {
                onclick: function () {
                    client.service('cartv-1').create(sampleProduct).then(function (result) {
//                        console.log(result)
                    }).catch(function (err) {
//                      console.log(err)
                    })
                }
            }, 'Gửi hàng demo')
        ]
    }
};
module.exports = shop;
