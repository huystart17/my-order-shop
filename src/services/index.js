'use strict';



const order = require('./order/order.service.js');
const cartv1 = require('./cartv-1/cartv-1.service');


const users = require('./users/users.service.js');


const otherContent = require('./other-content/other-content.service.js');


const historyLog = require('./history-log/history-log.service.js');


module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(cartv1);
  app.configure(order);
  app.configure(users);
  app.configure(otherContent);
  app.configure(historyLog);
};
