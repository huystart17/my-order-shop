/**
 * Created by huy on 4/13/17.
 */
const m = require('mithril');
const service = require('../../service/rest-api')
const provinces = require('../otherData/vietnam_provinces_cities.json');

let signUp = {
    oninit: function (vnode) {

        //sau nay dung cho tu dien thong tin
        //signUp.data = {}
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


    formSeclectData: {
        get_provinceList: function () {
            let provinceList = [];
            for (key in provinces) {
                provinceList.push(key);
            }
            return provinceList
        },
        get_cityList: function (province) {
            let cityList = [];
            for (key in provinces[province].cities) {
                cityList.push(key);
            }
            return cityList
        }
    },
    view: function (vnode) {
        return m('.db',

            m('.f5.b.mt3', "Thông tin của bạn"),
            m('hr'),
            m('form', {
                    onsubmit: function (e) {
                        e.preventDefault();
                        service.service('users').create(signUp.data)
                            .then(() => {
                                location.href = '#!/signin'
                            })
                            .catch(console.log)
                    }
                },
                [
                    m('label.db.ma2',
                        m('.db', "Email"),
                        m('input.db.w-100', {
                            type: 'email',
                            required: true,
                            value: signUp.data.email,
                            oninput: function (e) {
                                signUp.data.email = e.target.value
                            }
                        })
                    ), m('label.db.ma2',
                    m('.db', "Password"),
                    m('input.db.w-100', {
                        type: 'password',
                        required: true,
                        value: signUp.data.password,
                        oninput: function (e) {
                            signUp.data.password = e.target.value
                        }
                    })
                ), m('label.db.ma2',
                    m('.db', "Nhập lại mật khẩu"),
                    m('input.db.w-100', {
                        type: 'password',
                        required: true,
                        oninput: function (e) {
                            if (e.target.value != signUp.data.password) {
                            } else {
                                e.target.style.backgroundColor = "lightgreen"
                            }
                        }
                    })
                ), m('label.db.ma2',
                    m('.db', "Tên của bạn"),
                    m('input.db.w-100', {
                        required: true,
                        value: signUp.data.userInfo.userName,
                        oninput: function (e) {
                            signUp.data.userInfo.userName = e.target.value
                        }
                    })
                ),

                    m('label.db.ma2',
                        m('.db', "Số điện thoại"),
                        m('input.db.w-100[type=tel]', {
                            required: true,
                            value: signUp.data.userInfo.phone,
                            oninput: function (e) {
                                signUp.data.userInfo.phone = e.target.value
                            },
                            onblur: function () {

                            }
                        })
                    ),

                    m('label.db.ma2',
                        m('.db', "Tinh"),
                        m('select.db.w-100', {
                                value: signUp.data.userInfo.address.province,
                                onchange: function (e) {

                                    signUp.data.userInfo.address.province = e.target.value;
                                    signUp.data.userInfo.address.city = signUp.formSeclectData.get_cityList(signUp.data.userInfo.address.province)[0];

                                },
                                onblur: function () {

                                }
                            },
                            signUp.formSeclectData.get_provinceList().map((c) => m('option', {
                                value: c
                            }, provinces[c].name))
                        )
                    ),

                    m('label.db.ma2',
                        m('.db', "Huyện"),
                        m('select.db.w-100', {
                                value: signUp.data.userInfo.address.city,
                                onchange: function (e) {
                                    signUp.data.userInfo.address.city = e.target.value;
                                    // console.log(signUp.data.address)
                                },
                                onblur: function () {

                                }
                            },
                            signUp.formSeclectData.get_cityList(signUp.data.userInfo.address.province).map((p) => m('option', {
                                value: p,

                            }, provinces[signUp.data.userInfo.address.province].cities[p]))
                        )
                    ),

                    m('label.db.ma2',
                        m('.db', "Địa chỉ"),
                        m('textarea.w-100', {
                            required: true,
                            oninput: function (e) {
                                signUp.data.userInfo.address.other = e.target.value
                            },
                            onblur: function () {

                            }
                        })
                    ),


                    m('input.db[type=submit].pa2.br3.w-100.bg-orange.white', {value: 'Đăng ký'})
                ])
        )

    }
};

module.exports = signUp;
