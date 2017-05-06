/**
 * Created by huy on 4/25/17.
 */
const m = require('mithril');
const header = require('./orderCompactHeader')
const body = require('./orderCompactBody')
const orderCompact = {
    oninit: vnode => {
        //something
        console.log(vnode.attrs.list)
    },
    data: {},
    view: vnode => m('table.ba.w-100.db',
        m(header),
        vnode.attrs.data.list.map(c => m(body, {data:c}))
    )
};

module.exports = orderCompact;