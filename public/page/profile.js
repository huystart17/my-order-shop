/**
 * Created by huy on 5/3/17.
 */
const m = require('mithril');
const word = {}
const client = require('../service/rest-api')
const cityData = require('../coreModule/otherData/vietnam_provinces_cities.json')
const profile = {
    oninit: vnode => {
        //something
        profile.get_data(profile.data)
    },

    data: {
        email: "",
        password: "",
        userInfo: {
            phone: '',
            userName: '',
            address: {
                province: "HANOI",
                city: "QUANBADINH",
                other: ""
            }
        }
    },
    get_data: () =>
        client.authenticate()
            .then(() => client.service('users').find())
            .then(result => Object.assign(profile.data, result.data[0]))
            .then(console.log)
            .then(m.redraw)
            .catch(console.log)
    ,
    view: vnode => m(
        '.db.pa3',
        m('.db.f4.b' , 'Thông tin cá nhân'),
        m('label.mt3.db',
            m('span.b', 'Email:'),
            m('span', profile.data.email )
        ), m('label.mt3.db',
            m('span.b', 'Tên: '),
            m('span', profile.data.userInfo.userName)
        ), m('label.mt3.db',
            m('span.b', 'Số điện thoại: '),
            m('span', profile.data.userInfo.phone)
        ), m('label.mt3.db',
            m('.db.b', 'Địa chỉ: '),
            m('.db.ml2', `Tỉnh: ${cityData[profile.data.userInfo.address.province].name}`),
            m('.db.ml2', `Huyện: ${cityData[profile.data.userInfo.address.province].cities[profile.data.userInfo.address.city]}`),
            m('.db.ml2', `Địa chỉ: ${profile.data.userInfo.address.other}`)
        )
    )
};

module.exports = profile;