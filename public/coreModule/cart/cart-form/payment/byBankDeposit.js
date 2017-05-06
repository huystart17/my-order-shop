/**
 * Created by huy on 4/14/17.
 */
var m = require('mithril');

var byBankDeposit = {
    oninit: function () {

    },
    bankData: [
        {
            bankName: "Techcombank",
            accountNumber: "0123456789",
            accountName: "Dinh Hoang Minh"
        }, {
            bankName: "BIDV",
            accountNumber: "0123456789",
            accountName: "Dinh Hoang Minh"
        }, {
            bankName: "Agribank",
            accountNumber: "0123456789",
            accountName: "Dinh Hoang Minh"
        }, {
            bankName: "Techcombank",
            accountNumber: "0123456789",
            accountName: "Dinh Hoang Minh"
        }
    ],
    currentBank: "Techcombank",
    content: function (bank) {
        return m('ul',
            m('li', `Ngân hàng : ${bank.bankName}`),
            m('li', `Số tài khoản : ${bank.accountNumber}`),
            m('li', `Chủ tài khoản : ${bank.accountName}`)
        )
    },
    view: function () {
        return [
            m('.db.pa3',
                m('p', 'Lựa chọn ngân hàng của bạn'),
                m('select', {
                    onchange: function (e) {
                        byBankDeposit.currentBank = e.target.value;
                        console.log(byBankDeposit.currentBank)
                    }
                }, byBankDeposit.bankData.map(b => m('option',{value: b.bankName}, b.bankName))),
                m('p', byBankDeposit.content(byBankDeposit.bankData.find(b => (b.bankName == byBankDeposit.currentBank))))
            )
        ]
    }
};

module.exports = byBankDeposit;
