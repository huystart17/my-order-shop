/**
 * Created by huy on 4/25/17.
 */
const m = require('mithril');
const stream = require('mithril/stream')
const client = require('../../service/rest-api')
const statusList = require('./statusList')
let query = {
    data: {
        status: {
            $in: []
        }
        ,
        createdAt: {
            $lte: '',
            $gte: ''
        }
    },
    run: () => client.service('order').find({
            query: query.data
        }
    )
}
let search_text = {
    query: {
        $or: [
            {orderCode: ''},
            {phone: ''}
        ]
    },
    run: () => client.service('order').find({
            query: search_text.query
        }
    )
}
function default_date_now(durationToPast) {
    let change = durationToPast || 0
    let d = new Date(new Date().getTime() - change)
    let day = d.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false})
    let month = (d.getMonth() + 1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false})
    let year = d.getFullYear()
    return `${year}-${month}-${day}`

}
const form = {
    status: {
        allchecked: false
    },
    createdAt: {
        min: default_date_now(60 * 24 * 60 * 60 * 1000),
        max: default_date_now()
    }
}
const orderControl = {
    oninit: function (vnode) {

    },
    view: vnode => m(
        '.db.w-100.pa2',
        m('.db.w-100.f5', {
            onsubmit: e => {
                e.preventDefault()
                search_text.query.$or[0].orderCode = e.target.searchString.value
                search_text.query.$or[1].phone = e.target.searchString.value
                //run query
                console.log(search_text.query)
                search_text.run()
                    .then(result => {
                        vnode.attrs.data.list = result.data
                        console.log(vnode.attrs.data)
                        m.redraw()
                    })
                    .catch(console.log)
            }

        }, m('form', m('input[type=search][placeholder=Tìm nhanh][name=searchString]'))),
        m('hr'),
        m('form#queryOrders',
            {
                onsubmit: e => {
                    e.preventDefault()
                    let status = []
                    e.target.status.forEach(child => {
                        child.checked ? status.push(child.value) : ""
                    })
                    //set query
                    query.data.status.$in = status.length == 0 ? ["NOTHING"] : status
                    query.data.createdAt.$gte = new Date(e.target.dateMin.value)
                    query.data.createdAt.$lte = new Date(e.target.dateMax.value)
                    //run query
                    console.log(query.data)
                    query.run()
                        .then(result => {
                            vnode.attrs.data.list = result.data
                            console.log(vnode.attrs.data)
                            m.redraw()
                        })
                        .catch(console.log)
                }
            }
            ,
            m('.db.w-100.f5.underline.b1', 'Trạng thái'),

            m('label.f5.db.mb1', m('input[type=checkbox][name=statusAll]', {
                checked: form.status.allchecked,

                onchange: e => {
                    form.status.allchecked = e.target.checked
                    document.getElementById('queryOrders').status.forEach(child => {
                        child.checked = form.status.allchecked
                    })
                }
            }), m('span.mt1', 'Tất cả')),
            statusList.map(status => m('label.f5.db.mb1', m('input[type=checkbox][name=status]', {
                value: status.text,
                checked: form.status.allchecked
            }), m('span.mt1', status.text))),

            // m('.db.w-100.f5.underline.mb1', 'Giá trị hóa đơn'),
            // m('label.f5.db.mb1', m('input[type=range]'), m('span.mt1', 'Tối đa')),
            // m('label.f5.db.mb1', m('input[type=range]'), m('span.mt1', 'Tối thiểu')),

            m('.db.w-100.f5.underline.,b1', 'Thời gian'),
            m('label.f5.db.mb1', m('span.mt1', 'Từ ngày'), m('input[type=date][name=dateMin]', {
                value: form.createdAt.min,
                onchange: e => {
                    form.createdAt.min = e.target.value
                }
            })),
            m('label.f5.db.mb1', m('span.mt1', 'Đến ngày'), m('input[type=date][name=dateMax]', {
                value: form.createdAt.max,
                onchange: e => {
                    form.createdAt.max = e.target.value
                }
            })),

            m('hr'),

            m('button', 'Lọc')
        )
    )

};

module.exports = orderControl;