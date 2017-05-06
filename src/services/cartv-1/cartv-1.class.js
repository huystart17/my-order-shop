/* eslint-disable no-unused-vars */
const cartModel = require('./cartModel');
class Service {
  constructor (options) {
    this.options = options || {};
  }

  find (params) {
    return Promise.resolve(cartModel.get_my_cart(params.mySid));
  }

  get (id, params) {
    return Promise.resolve({
      id, text: `A new message with ID: ${id}!`
    });
  }

  create (data, params) {
    cartModel.add_to_cart(data.cart,data.prd);

    return Promise.resolve(data);
  }

  update (id, data, params) {
    cartModel.update_cart(data.cart)
    return Promise.resolve(data);
  }

  patch (id, data, params) {
    return Promise.resolve(data);
  }

  remove (id, params) {
    cartModel.put_to_db(params.query.orderCode);
    return Promise.resolve({ id });
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
