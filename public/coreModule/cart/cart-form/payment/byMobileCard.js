/**
 * Created by huy on 4/14/17.
 */
var m = require('mithril');

var byMobileCard = {
    oninit: function () {

    },
    view: function () {
        return [
            m('.db.pa3',
                m('label.db.w-100', m('span', 'Mã thẻ cào'), m('input')),
                m('label.db.w-100', m('span', 'Số seri'), m('input'))
            )
        ]
    }
};

module.exports = byMobileCard;
