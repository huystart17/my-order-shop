/**
 * Created by huy on 4/5/17.
 */
const m = require('mithril');
/*
 * table interface:
 * tableHeader:[]
 * data :[]
 * **/
let table = {
  oninit: function () {

  },
  view: function (vnode) {
    return m('table',
      //header
      m('tr', vnode.attrs.tableHeader.map(function (th) {
        return m('th', th)
      })),
      vnode.attrs.data.map(function (tr) {
        tr.map(function (td) {
          return m('td', td)
        })
      })
    )
  }
};


module.exports = table;
