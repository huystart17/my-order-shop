/**
 * Created by huy on 4/5/17.
 */
const m = require('mithril');
const appService = require('../../service/rest-api');


let login = {
    oninit: function () {

    },
    lgData: {
        strategy: "local",
        email: "",
        password: ""
    },
    sentData: function () {
        appService.authenticate(login.lgData)
            .then(() => {
                location.href = '/'
            }).catch(function (error) {
            console.error('Error authenticating!', error);
        });

    },
    view: function () {
        return m('form.login', {
            onsubmit: function (e) {
                e.preventDefault();
                login.sentData();
            }
        }, [
            m('label',
                m('span', "Tài khoản: "),
                m('input', {
                    type: "text", required: true, oninput: function (e) {
                        login.lgData.email = e.target.value
                    }
                })
            ),
            m('label',
                m('span', "Mật khẩu"),
                m('input', {
                    type: "password", required: true, oninput: function (e) {
                        login.lgData.password = e.target.value
                    }
                })
            ),
            m('p',
                m('a', {href: '/register', oncreate: m.route.link}, "Tạo tài khoản mới?")
            ),
            m('input', {type: 'submit', value: "Đăng nhập"})
        ])
    }
};

module.exports = login;
