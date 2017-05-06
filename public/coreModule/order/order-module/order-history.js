/**
 * Created by huy on 4/24/17.
 */
const m = require('mithril');
const appService = require('../../../service/rest-api')
const orderHistory = {
        oninit: function (vnode) {
            orderHistory.data.orderCode = vnode.attrs.orderCode
            orderHistory.get_data()
        },
        data: {
            historyLog: [],
            orderCode: ""
        },
        get_data: () => {
            orderHistory.data.orderCode ?
                appService.service('history-log').find({
                    query: {
                        $limit: 1000,
                        orderCode: orderHistory.data.orderCode
                    }
                }).then(
                    result => {
                        orderHistory.data.historyLog = result.data;
                        m.redraw();
                    }
                ).catch(
                    err => console.log(err)
                ) : ""
        },
        view: vnode => m('.db.ba.bg-black-10',
            m('.db.f5.underline.ma2', 'Lịch sử hóa đơn'),
            orderHistory.data.historyLog ?
                m('.db.pa2',
                    m('ul',
                        orderHistory.data.historyLog.map(
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
                                    orderCode: orderHistory.data.orderCode,
                                    text: e.target.message.value
                                }).then(result => {
                                    orderHistory.get_data()
                                }).catch(err => console.log(err))
                            }
                        },
                        m('input[type=text][name=message]', {
                            placeholder: "Tin nhắn của bạn"
                        }),
                        m('input[type=submit][value=Gửi]')
                    )
                ) : ""
        )
    }
    ;
//sender , orderCode , createdAt, text
module.exports = orderHistory;