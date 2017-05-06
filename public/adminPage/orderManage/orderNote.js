/**
 * Created by huy on 4/30/17.
 */
const m = require('mithril');

const adminNote = {
    oninit: vnode => {
        //something
    }
    ,
    view: vnode => m(
        '.db.bg-black-10',
        m('.db.f5.underline', 'Ghi chú'),
        m('textarea.db.w-100', {
                placeholder: "Ghi chú riêng của đơn hàng",
                style: {
                    overflow: "hidden"
                },
                value : vnode.attrs.data.adminNote,
                oninput: e => {
                    vnode.attrs.data.adminNote = e.target.value
                    e.target.style.height = `1px`
                    e.target.style.height = (e.target.scrollHeight + 25) + 'px'
                }
            }
        )
    )
};

module.exports = adminNote;