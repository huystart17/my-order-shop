/**
 * Created by huy on 4/25/17.
 */
const m = require('mithril');
const orderTable = require('./orderManage/orderCompact/orderCompact')
const clientService = require('../service/rest-api')
const orderControl = require('./orderManage/orderControl')
const adminPage = {
    oninit: function (vnode) {
        this.get_data()
    },
    data: {
        list: []
    },
    get_data: () => {
        clientService.service('order').find().then(result => {
            adminPage.data.list = result.data
            console.log(adminPage.data.list)
            m.redraw();
        }).catch(err => console.log(err))
    },
    view: vnode => m('.db.overflow-auto',
        m('.db.w-20.fl', m(orderControl, {data: adminPage.data})),
        m('.db.w-80.fl', m(orderTable, {data: adminPage.data}))
    )
};

module.exports = adminPage;