/**
 * Created by huy on 4/5/17.
 */
const m = require('mithril');
const appService = require('../../service/rest-api');

const city = ["Hà Nội", "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu", "Bắc Ninh", "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước", "Bình Thuận", "Cà Mau", "Cao Bằng", "Đắk Lắk", "Đắk Nông", "Điện Biên", "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Giang", "Hà Nam", "Hà Tĩnh", "Hải Dương", "Hậu Giang", "Hòa Bình", "Hưng Yên", "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu", "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Long An", "Nam Định", "Nghệ An", "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Quảng Bình", "Quảng Nam", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sóc Trăng", "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên", "Thanh Hóa", "Thừa Thiên Huế", "Tiền Giang", "Trà Vinh", "Tuyên Quang", "Vĩnh Long", "Vĩnh Phúc", "Yên Bái", "Phú Yên  Cần Thơ", "Đà Nẵng", "Hải Phòng", "TP HCM"];
let register = {

    oninit: function () {

    },
    regData: {
        email: "",
        password: "",
        userInfo: {
            userName: "",
            phone: "",
            address: {
                city: "",
                province: "",
                other: ""
            }
        }
    },
    checkData: function () {

    },
    sendData: function () {

    },
    view: function () {
        return m('.container',
            m('form.register', {
                    onsubmit: function (e) {
                        console.log(register.regData);
                        e.preventDefault();
                        appService.service('users').create(register.regData).then(function (result) {
                            console.log(result)
                        }).catch(function (err) {
                            console.log(err)
                        })
                    }
                },
                [
                    //Tên người dùng
                    m('label',
                        m('span', "Tên của bạn"),
                        m('input', {
                            name: "userName", type: 'text',
                            required: true,
                            oninput: function (e) {
                                register.regData.userInfo.userName = event.target.value;
                            }
                        })
                    ),

                    //Mật khẩu
                    m('label',
                        m('span', "Mật khẩu"),
                        m('input',
                            {
                                name: "password",
                                type: 'password',
                                required: true,
                                oninput: function (e) {
                                    register.regData.password = e.target.value;
                                }
                            })),

                    //Số điện thoại
                    m('label',
                        m('span', "Số điện thoại"),
                        m('input',
                            {
                                name: "phone",
                                type: 'tel',
                                required: true,
                                oninput: function (e) {
                                    register.regData.userInfo.phone = e.target.value;
                                }
                            })),

                    //email
                    m('label',
                        m('span', "Email"),
                        m('input', {
                            name: "email",
                            type: "email",
                            required: true,
                            oninput: function (e) {
                                register.regData.email = e.target.value;
                            }
                        })),

                    //Địa chỉ ,thành phố
                    m('label',
                        m('span', "Thành phố"),
                        m('select', {
                                name: "province", required: true,
                                onchange: function (e) {
                                    register.regData.userInfo.address.province = e.target.value
                                }
                            }, city.map((ct) => m('option', {value: ct}, ct))
                        )
                    ),

                    //Địa chỉ ( số nhà , phố)
                    m('label',
                        m('span', "Địa chỉ"),
                        m('input', {
                            name: "address", type: "text", oninput: function (e) {
                                register.regData.userInfo.address.other = e.target.value
                            }
                        })),

                    //submit
                    m('input', {type: 'submit', value: "Đăng ký"})
                ])
        )
    }
};

module.exports = register;
