/**
 * Created by huy on 4/24/17.
 */
const m = require('mithril');
const appService = require('../../service/rest-api')
const orderHistory = {
        oninit: function (vnode) {

            orderHistory.get_data(vnode)
        },
        data: {
            historyLog: [],
            orderCode: ""
        },
        get_data: (vnode) => {
            vnode.attrs.orderCode ?
                appService.service('history-log').find({
                    query: {
                        $limit: 1000,
                        orderCode: vnode.attrs.orderCode
                    }
                }).then(
                    result => {
                        vnode.attrs.historyLog = result.data;
                        m.redraw();
                    }
                ).catch(
                    err => console.log(err)
                ) : ""
        },
        view: vnode => m('.db.bg-black-10',
            m('.db.f5.underline', 'Lịch sử hóa đơn'),
            vnode.attrs.historyLog ?
                m('.db.pa2',
                    m('ul.db', {
                            style: {
                                'max-height': '150px',
                                'overflow-y': 'scroll'
                            }
                        },
                        vnode
                            .attrs.historyLog.map(
                            msg => m('li',
                                m('b', `${msg.sender}`),
                                m('span', `(${(new Date(msg.createdAt)).toLocaleString()}) : `),
                                m('span', `${msg.text}`)
                            )
                        )
                    ),
                    m('form', {
                            onsubmit: e => {
                                e.preventDefault()
                                appService.service('history-log').create({
                                    sender: 'Khách',
                                    orderCode: vnode.attrs.orderCode,
                                    text: e.target.message.value
                                }).then(result => {
                                    orderHistory.get_data(vnode)
                                }).catch(err => console.log(err))
                            }
                        },
                        m('input[type=text][name=message]', {
                            placeholder: "Tin nhắn của bạn"
                        }),
                        m('input[type=submit][value=Gửi]')
                    )
                ) :
                ""
        )
    }
    ;
//sender , orderCode , createdAt, text
module.exports = orderHistory;