/**
 * Created by huy on 4/14/17.
 */
const m = require('mithril');
const payment = {
    byAccount: require('./payment/byAccount'),
    byBankDeposit: require('./payment/byBankDeposit'),
    byInCenter: require('./payment/byInCenter'),
    byMobileCard: require('./payment/byMobileCard')
};


// let tabs = {
//   oninit: function () {
//
//   },
//   choosenMethod: 0,
//   view: function () {
//     return m('.db',
//       ["Chuyển khoản", "Thẻ cào", "Nạp tiền trực tiếp", "Tài khoản tiết kiệm"].map(
//         (tab) => m('button.pa2', tab)
//       ))
//   }
// };

let paymentMethod = {
    oninit: function (vnode) {

    vnode.attrs.cart.payBy = paymentMethod.method[1].text
    },
    choosenPayment: "default",
    method: [
        {
            payby: 'account',
            text: 'Thanh toán qua tài khoản nhập hàng tiết kiệm'
        }, {
            payby: 'center',
            text: 'Thanh toán tại cửa hàng'
        }, {
            payby: 'bank',
            text: 'Chuyển khoản ngân hàng'
        }, {
            payby: 'mobile',
            text: 'Thanh toán qua thẻ cào điện thoại *(Đang hoàn thiện)'
        }],
    paymentView: function () {
        if (paymentMethod.choosenPayment == "default") {
            return payment.byInCenter

        } else if (paymentMethod.choosenPayment == "account") {
            return payment.byAccount

        } else if (paymentMethod.choosenPayment == "center") {
            return payment.byInCenter

        } else if (paymentMethod.choosenPayment == "bank") {
            return payment.byBankDeposit

        } else if (paymentMethod.choosenPayment == "mobile") {
            return payment.byMobileCard

        } else {
            return payment.byInCenter

        }
    },

    view: function (vnode) {
        return m('.db.f5',
            m('.db.f5.mt3.b ', "Phương thức thanh toán"),
            m('hr'),
            //tabs container
            m('.db.pa3', paymentMethod.method.map(
                p => m('label.db',
                    {
                        onclick: function (e) {
                            paymentMethod.choosenPayment = p.payby;
                            vnode.attrs.cart.payBy = p.text;
                            console.log(paymentMethod.choosenPayment)
                        }
                    }, m('input[type=radio][name=payment]',{checked: vnode.attrs.cart.payBy==p.text}), m('span', p.text)
                )
            )),
            m('.db', m('.db', m(paymentMethod.paymentView(), vnode.attrs.cart))
            )
        )
    }


};

module.exports = paymentMethod;
